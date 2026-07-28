import { RoleGuard } from '@/components/RoleGuard'
import { ROLES } from '@/constants/roles'
function MentorRoleLayout() {
  return <RoleGuard role={ROLES.MENTOR} />
}
export { MentorRoleLayout as default }
