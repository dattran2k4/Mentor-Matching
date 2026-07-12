# Media Upload

Tài liệu này mô tả flow upload file của backend. MVP hiện tại dùng Cloudinary làm provider chính, nhưng database và application ports được thiết kế trung lập provider để sau này có thể thêm S3/Firebase nếu cần.

## Mental Model

Upload media được tách thành ba phần:

1. Media module quản lý định danh file, upload intent, metadata từ provider, status và access policy.
2. Storage provider lưu file binary, hiện tại là Cloudinary.
3. Business module quyết định media asset đã `READY` sẽ được gắn vào đâu, ví dụ avatar mentor hoặc giấy tờ xác minh.

Rule quan trọng:

```text
Confirm upload != attach vào business entity
```

Confirm upload chỉ có nghĩa là file đã tồn tại trên provider và record `media_assets` đã sẵn sàng để dùng. Việc cập nhật avatar mentor, ảnh thành tích, hoặc giấy tờ xác minh vẫn thuộc trách nhiệm của business module sở hữu nghiệp vụ đó.

## Status Lifecycle

MVP hiện tại cố tình giữ status đơn giản:

```text
PENDING -> READY -> DELETED
```

- `PENDING`: backend đã tạo upload intent, nhưng file có thể chưa tồn tại trên provider.
- `READY`: upload đã được confirm và metadata từ provider đã được lưu.
- `DELETED`: asset không còn được dùng nữa.

Sau này production có thể có cleanup job để xóa hoặc mark các record `PENDING` quá lâu mà frontend chưa bao giờ upload.

## Access Type

Client không được tự chọn `accessType`. Backend sẽ tự resolve từ `purpose`.

Policy MVP hiện tại:

```text
AVATAR            -> PUBLIC
ACHIEVEMENT       -> PUBLIC
REVIEW_ATTACHMENT -> PUBLIC
VERIFICATION      -> PRIVATE
```

`PUBLIC` nghĩa là file có thể được render qua public/CDN URL.

`PRIVATE` nghĩa là file không được expose bằng public URL cố định. User muốn xem file phải đi qua backend authorization trước. Với file verification, rule dự kiến là:

```text
mentor owner được xem verification file của chính mình
ADMIN/MANAGER được xem để duyệt hồ sơ
user khác bị deny
```

Private delivery URL hoặc download endpoint chưa được implement trong MVP hiện tại.

## Create Upload Intent

Frontend bắt đầu bằng cách xin backend một upload intent.

```text
POST /api/v1/media/upload-intents
```

Request shape:

```json
{
  "purpose": "AVATAR",
  "resourceType": "IMAGE",
  "originalFilename": "avatar.png",
  "mimeType": "image/png",
  "fileSizeBytes": 123456
}
```

Backend chịu trách nhiệm:

1. Lấy authenticated user id từ principal.
2. Validate purpose, resource type, file size và các business rule cơ bản.
3. Resolve access type từ purpose.
4. Gọi active storage adapter để tạo object key.
5. Tạo record `media_assets` với `status = PENDING`.
6. Trả signed upload information cho frontend.

Ở thời điểm này, file chưa chắc đã tồn tại trên Cloudinary.

Dữ liệu backend biết chắc ở bước create:

- `provider`
- `objectKey`, với Cloudinary chính là `public_id`
- `purpose`
- `resourceType`
- `accessType`
- `uploadedByUserId`
- `originalFilename`
- `mimeType`
- `status = PENDING`

Dữ liệu chưa nên tin là final ở bước create:

- dung lượng thực tế
- width/height thực tế
- provider asset id
- provider version
- provider etag/checksum
- final delivery URL

## Direct Upload To Cloudinary

Frontend upload file binary trực tiếp lên Cloudinary bằng `uploadUrl` và `formFields` backend trả về.

Ví dụ response data từ backend:

```json
{
  "mediaAssetId": 123,
  "provider": "CLOUDINARY",
  "uploadUrl": "https://api.cloudinary.com/v1_1/<cloud-name>/image/upload",
  "objectKey": "mentor-matching/users/15/avatar/8f37...",
  "formFields": {
    "api_key": "<cloudinary-api-key>",
    "public_id": "mentor-matching/users/15/avatar/8f37...",
    "timestamp": "1782230000",
    "signature": "<signed-by-backend>"
  }
}
```

Cloudinary API secret tuyệt đối không được gửi xuống frontend. Backend dùng secret để ký các field được phép upload, frontend chỉ nhận signature.

## Confirm Upload

Sau khi upload lên Cloudinary thành công, frontend gửi dữ liệu Cloudinary trả về lại cho backend.

Planned endpoint:

```text
POST /api/v1/media/{mediaAssetId}/confirm
```

Expected command data:

- `mediaAssetId`
- authenticated `uploadedByUserId`
- `objectKey`, với Cloudinary là `public_id`
- `providerAssetId`, với Cloudinary là `asset_id`
- `deliveryUrl`, với Cloudinary là `secure_url`
- `fileSizeBytes`
- `width`
- `height`
- `version`
- `etag`
- optional `metadataJson`

Backend chịu trách nhiệm:

1. Tìm record `media_assets`.
2. Đảm bảo current user là owner của media asset đang pending.
3. Đảm bảo `objectKey` khớp với upload intent ban đầu.
4. Reject asset đã bị delete.
5. Nếu asset đã `READY`, coi như retry an toàn/idempotent success.
6. Gọi storage adapter để verify dữ liệu provider-specific.
7. Mark media asset thành `READY`.
8. Lưu actual provider metadata.

Provider metadata được lưu ở bước confirm vì chỉ sau khi file binary được upload và Cloudinary xử lý xong thì các thông tin đó mới thực sự tồn tại.

## Attach Vào Business Entity

Sau khi confirm thành công, frontend nên gọi endpoint nghiệp vụ tương ứng.

Ví dụ flow mentor avatar:

```text
POST /api/v1/media/upload-intents
-> frontend upload lên Cloudinary
-> POST /api/v1/media/{mediaAssetId}/confirm
-> PATCH /api/v1/mentor/me/avatar
```

Mentor module nên validate media asset có dùng được hay không trước khi lưu:

```text
status = READY
uploadedByUserId = current user id
purpose = AVATAR
resourceType = IMAGE
accessType = PUBLIC
```

Sau đó mới lưu:

```text
mentor_profiles.avatar_media_id = mediaAssetId
```

Media module không nên trực tiếp update bảng mentor profile, review, hoặc achievement trong bước confirm. Làm vậy giữ module boundary sạch hơn.

## MVP Versus Production-Hardening

MVP confirm hiện tại verify dữ liệu cơ bản:

- object key khớp với upload intent
- provider asset id tồn tại
- delivery URL tồn tại
- Cloudinary URL khớp configured cloud name
- size/width/height không âm

Production-hardening nên thêm một trong hai hướng:

1. Verify Cloudinary upload response signature.
2. Hoặc gọi Cloudinary Admin API bằng `public_id` và persist metadata backend lấy trực tiếp từ Cloudinary.

Hướng thứ hai chặt hơn vì backend không cần tin metadata provider do frontend gửi lên.

## Vì Sao Chọn Flow Này

Direct-upload flow được ưu tiên hơn việc proxy file qua backend:

```text
frontend -> Cloudinary
```

thay vì:

```text
frontend -> backend -> Cloudinary
```

Lợi ích:

- backend không phải xử lý multipart payload lớn và bandwidth file
- upload scale theo provider
- backend vẫn kiểm soát object key, purpose, file policy và signature
- pending uploads có thể cleanup sau
- business modules chỉ attach media asset đã được confirm `READY`
