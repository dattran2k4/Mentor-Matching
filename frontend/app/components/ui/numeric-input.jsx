import * as React from 'react'
import { Input } from '@/components/ui/input'
function sanitizeDigits(value) {
  return value.replace(/\D/g, '')
}
const NumericInput = React.forwardRef(
  ({ inputMode = 'numeric', onValueChange, value, ...props }, ref) => {
    return (
      <Input
        {...props}
        ref={ref}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onValueChange(sanitizeDigits(event.target.value))}
      />
    )
  }
)
NumericInput.displayName = 'NumericInput'
export { NumericInput, sanitizeDigits }
