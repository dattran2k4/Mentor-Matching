import { Button as UIButton } from '@/components/ui/button'
const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive'
}
const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg'
}
function Button({ size = 'md', variant = 'primary', ...props }) {
  return <UIButton {...props} size={sizeMap[size]} variant={variantMap[variant]} />
}
export { Button }
