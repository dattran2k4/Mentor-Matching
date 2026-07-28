import { RoleGuard } from '@/components/RoleGuard'
import { ROLES } from '@/constants/roles'
function UserRoleLayout() {
  return <RoleGuard role={ROLES.LEARNER} />
}
export { UserRoleLayout as default }
