# Module Map

This file summarizes current backend modules and useful mental models for new threads.

## Auth

Purpose:

- Login
- Register
- Refresh token
- Logout
- JWT issuance and refresh token persistence

Notes:

- Refresh tokens are persisted as hashed values in `auth_refresh_tokens`.
- Security infrastructure lives in `shared/security`.
- Auth application should work with domain objects, not persistence entities.

## User

Purpose:

- User account domain
- Learner profile
- User summaries for other modules

Important distinction:

- `users.id` is the authenticated principal id.
- Some features need profile ids, for example `mentor_profiles.id`, not user id.

## Mentor

Purpose:

- Mentor profile
- Mentor verification
- Mentor subjects
- Mentor traits/highlights/personalities
- Mentor achievements
- Public mentor listing and detail slices

Current public mentor APIs are split to avoid large one-to-many joins:

- Basic detail
- Subjects
- Traits
- Achievements
- Availabilities

## Catalog

Purpose:

- Categories
- Subjects
- Grades
- Subject grades

Important distinction:

- `subject_grades.id` is a catalog subject/grade combination.
- `mentor_subjects.id` is the specific subject/grade that a mentor teaches.
- Booking request should use `mentorSubjectId = mentor_subjects.id`, not `subject_grade_id`.

## Scheduling

Purpose:

- Mentor availability windows
- Availability checks for booking

Current direction uses flexible windows instead of fixed time slots.

## Booking

Purpose:

- Create booking
- User booking history
- Mentor booking list
- Admin/manager booking list
- Booking snapshots and amount calculation

Booking create flow:

```text
request minimal ids/time
-> lookup student snapshot
-> lookup mentor snapshot
-> lookup mentor subject snapshot
-> validate mentor availability
-> validate no overlapping booking
-> calculate total amount from price and duration
-> save booking
```

## Payment

Purpose:

- Create payment for booking
- Create Stripe Checkout Session
- Store checkout/payment provider data
- Handle Stripe webhook in progress

Current Stripe direction:

- `provider_reference_id` stores Checkout Session id.
- `provider_transaction_id` stores PaymentIntent id after success.
- `checkout.session.completed` should mark payment as paid.

## Media

Purpose:

- Provider-neutral media asset records
- Cloudinary signed direct-upload intent
- Upload confirmation and provider metadata tracking

Current direction:

- Client requests an upload intent from backend.
- Client uploads binary file directly to Cloudinary.
- Client confirms the upload with backend.
- Backend marks the media asset `READY`.
- Business modules attach ready media ids to their own tables.

Important distinction:

- `media_assets.object_key` is the provider object key. For Cloudinary, it maps to `public_id`.
- `media_assets.delivery_url` is for rendering/downloading; it is not the stable internal identity.
- `access_type` is resolved by backend from media purpose, not chosen by client.

See `media-upload.md` for the full flow.

## Review

Purpose:

- Review after booking
- Review tags/options

Mostly skeleton/domain setup at this stage.

## Notification

Purpose:

- Store notification records
- Notification type enum
- Read/unread state currently modeled by boolean `isRead`

Mostly skeleton/domain setup at this stage.

## Location

Purpose:

- Cities
- Districts

Location data is seeded/base data and changes rarely.
