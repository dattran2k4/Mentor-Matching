import { RoleGuard } from '@/components/RoleGuard'
import { ROLES } from '@/constants/roles'
function AdminRoleLayout() {
  return <RoleGuard role={ROLES.ADMIN} />
}
export { AdminRoleLayout as default }
