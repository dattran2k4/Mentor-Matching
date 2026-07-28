import { z } from 'zod'
import { createPasswordSchema, emailSchema } from '@/schemas/common.schema'
const loginSchema = z.object({
  email: emailSchema,
  password: createPasswordSchema()
})
export { loginSchema }
