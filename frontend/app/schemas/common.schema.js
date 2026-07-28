import { z } from 'zod'
const createRequiredStringSchema = (message = 'Tr\u01B0\u1EDDng n\xE0y l\xE0 b\u1EAFt bu\u1ED9c') =>
  z.string().trim().min(1, message)
const createOptionalStringSchema = () => z.string().trim().optional()
const emailSchema = createRequiredStringSchema('Email l\xE0 b\u1EAFt bu\u1ED9c').email(
  'Email kh\xF4ng h\u1EE3p l\u1EC7'
)
const phoneSchema = createRequiredStringSchema(
  'S\u1ED1 \u0111i\u1EC7n tho\u1EA1i l\xE0 b\u1EAFt bu\u1ED9c'
).refine(
  (value) => /^[+]?[0-9\s()-]{9,20}$/.test(value),
  'S\u1ED1 \u0111i\u1EC7n tho\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7'
)
const urlSchema = createRequiredStringSchema(
  '\u0110\u01B0\u1EDDng d\u1EABn l\xE0 b\u1EAFt bu\u1ED9c'
).url('\u0110\u01B0\u1EDDng d\u1EABn kh\xF4ng h\u1EE3p l\u1EC7')
const idSchema = z.union([
  createRequiredStringSchema('ID l\xE0 b\u1EAFt bu\u1ED9c'),
  z.number().int().positive('ID kh\xF4ng h\u1EE3p l\u1EC7')
])
const searchKeywordSchema = z
  .string()
  .trim()
  .max(255, 'T\u1EEB kh\xF3a t\xECm ki\u1EBFm qu\xE1 d\xE0i')
function createPasswordSchema(options = {}) {
  const { fieldLabel = 'M\u1EADt kh\u1EA9u', minLength = 6 } = options
  return z
    .string()
    .min(1, `${fieldLabel} l\xE0 b\u1EAFt bu\u1ED9c`)
    .min(minLength, `${fieldLabel} ph\u1EA3i c\xF3 \xEDt nh\u1EA5t ${minLength} k\xFD t\u1EF1`)
}
const pageSchema = z.number().int().positive()
const pageSizeSchema = z.number().int().positive()
export {
  createOptionalStringSchema,
  createPasswordSchema,
  createRequiredStringSchema,
  emailSchema,
  idSchema,
  pageSchema,
  pageSizeSchema,
  phoneSchema,
  searchKeywordSchema,
  urlSchema
}
