const initialBecomeMentorFormState = {
  avatarUrl: '',
  avatarMediaId: null,
  fullName: '',
  gender: '',
  hometownCityId: '',
  hometown: '',
  currentCityId: '',
  currentDistrictId: '',
  currentLocation: '',
  headline: '',
  introduction: '',
  teachingStyle: '',
  experienceYears: '',
  currentPosition: '',
  workplace: '',
  education: '',
  major: '',
  meetingType: '',
  offerings: [],
  availabilities: [],
  verificationFullName: '',
  idCardNumber: '',
  documents: {
    idFront: {
      fileName: '',
      mediaId: null,
      previewUrl: ''
    },
    idBack: {
      fileName: '',
      mediaId: null,
      previewUrl: ''
    },
    selfieWithId: {
      fileName: '',
      mediaId: null,
      previewUrl: ''
    }
  }
}
const verificationDocumentMeta = [
  {
    key: 'idFront',
    label: 'M\u1EB7t tr\u01B0\u1EDBc CCCD / ID',
    description:
      '\u1EA2nh r\xF5 n\xE9t, kh\xF4ng l\xF3a s\xE1ng, th\u1EA5y \u0111\u1EE7 th\xF4ng tin c\xE1 nh\xE2n.'
  },
  {
    key: 'idBack',
    label: 'M\u1EB7t sau CCCD / ID',
    description:
      'C\u1EA7n hi\u1EC7n \u0111\u1EA7y \u0111\u1EE7 m\xE3 QR, n\u01A1i c\u1EA5p ho\u1EB7c th\xF4ng tin b\u1ED5 sung.'
  },
  {
    key: 'selfieWithId',
    label: '\u1EA2nh ch\xE2n dung c\u1EA7m gi\u1EA5y t\u1EDD',
    description:
      'Gi\xFAp \u0111\u1ED9i ng\u0169 ki\u1EC3m tra t\xEDnh x\xE1c th\u1EF1c tr\u01B0\u1EDBc khi duy\u1EC7t.'
  }
]
export { initialBecomeMentorFormState, verificationDocumentMeta }
