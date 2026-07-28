import { z } from 'zod'
import { createRequiredStringSchema } from '@/schemas/common.schema'
const becomeMentorOfferingSchema = z.object({
  gradeId: createRequiredStringSchema('Vui l\xF2ng ch\u1ECDn c\u1EA5p l\u1EDBp'),
  subjectGradeId: createRequiredStringSchema(
    'Vui l\xF2ng ch\u1ECDn t\u1ED5 h\u1EE3p m\xF4n h\u1ECDc v\xE0 c\u1EA5p l\u1EDBp h\u1EE3p l\u1EC7'
  ),
  subjectId: createRequiredStringSchema('Vui l\xF2ng ch\u1ECDn m\xF4n h\u1ECDc'),
  teachingNote: createRequiredStringSchema(
    'Vui l\xF2ng nh\u1EADp m\xF4 t\u1EA3 ng\u1EAFn v\u1EC1 m\xF4n h\u1ECDc'
  ),
  pricePerHour: createRequiredStringSchema(
    'Vui l\xF2ng nh\u1EADp h\u1ECDc ph\xED m\u1ED7i gi\u1EDD'
  )
})
export { becomeMentorOfferingSchema }
