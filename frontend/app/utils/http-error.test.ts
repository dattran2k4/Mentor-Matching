import { describe, expect, it } from 'vitest'

import { getErrorMessage, parseValidationFieldErrors } from '@/utils/http-error'

describe('parseValidationFieldErrors', () => {
  it('maps backend validation messages to form fields', () => {
    const errors = parseValidationFieldErrors('fullName: must not be blank; phone: invalid phone', {
      fullName: 'fullName',
      phone: 'phone'
    })

    expect(errors).toEqual({
      fullName: 'must not be blank',
      phone: 'invalid phone'
    })
  })

  it('ignores unknown fields and malformed message parts', () => {
    const errors = parseValidationFieldErrors(
      'email: cannot be changed; malformed part; birthYear: must be past',
      {
        birthYear: 'birthYear'
      }
    )

    expect(errors).toEqual({
      birthYear: 'must be past'
    })
  })
})

describe('getErrorMessage', () => {
  it('prefers backend error response messages', () => {
    const message = getErrorMessage(
      {
        response: {
          data: {
            message: 'Backend validation failed'
          }
        }
      },
      'Fallback'
    )

    expect(message).toBe('Backend validation failed')
  })

  it('falls back when no usable message exists', () => {
    expect(getErrorMessage({}, 'Fallback')).toBe('Fallback')
  })
})
