import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
function useQueryParams() {
  const [searchParams] = useSearchParams()
  return useMemo(() => Object.fromEntries([...searchParams]), [searchParams])
}
export { useQueryParams }
