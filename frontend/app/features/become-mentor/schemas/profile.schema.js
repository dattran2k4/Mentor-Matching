import { z } from 'zod'
import { createRequiredStringSchema } from '@/schemas/common.schema'
const becomeMentorProfileSchema = z.object({
  fullName: createRequiredStringSchema('Vui l\xF2ng nh\u1EADp h\u1ECD v\xE0 t\xEAn'),
  gender: z.string().trim().optional(),
  hometownCityId: createRequiredStringSchema('Vui l\xF2ng ch\u1ECDn qu\xEA qu\xE1n'),
  currentCityId: createRequiredStringSchema(
    'Vui l\xF2ng ch\u1ECDn t\u1EC9nh/th\xE0nh ph\u1ED1 hi\u1EC7n t\u1EA1i'
  ),
  currentDistrictId: createRequiredStringSchema(
    'Vui l\xF2ng ch\u1ECDn qu\u1EADn/huy\u1EC7n hi\u1EC7n t\u1EA1i'
  ),
  headline: createRequiredStringSchema('Vui l\xF2ng nh\u1EADp ti\xEAu \u0111\u1EC1 ng\u1EAFn'),
  introduction: createRequiredStringSchema(
    'Vui l\xF2ng nh\u1EADp gi\u1EDBi thi\u1EC7u b\u1EA3n th\xE2n'
  ),
  teachingStyle: createRequiredStringSchema(
    'Vui l\xF2ng nh\u1EADp phong c\xE1ch gi\u1EA3ng d\u1EA1y'
  ),
  experienceYears: createRequiredStringSchema(
    'Vui l\xF2ng nh\u1EADp s\u1ED1 n\u0103m kinh nghi\u1EC7m'
  ),
  currentPosition: createRequiredStringSchema(
    'Vui l\xF2ng nh\u1EADp v\u1ECB tr\xED hi\u1EC7n t\u1EA1i'
  ),
  workplace: createRequiredStringSchema('Vui l\xF2ng nh\u1EADp khu v\u1EF1c l\xE0m vi\u1EC7c'),
  education: createRequiredStringSchema('Vui l\xF2ng nh\u1EADp h\u1ECDc v\u1EA5n'),
  major: createRequiredStringSchema('Vui l\xF2ng nh\u1EADp chuy\xEAn ng\xE0nh'),
  meetingType: createRequiredStringSchema('Vui l\xF2ng ch\u1ECDn h\xECnh th\u1EE9c d\u1EA1y')
})
export { becomeMentorProfileSchema }
