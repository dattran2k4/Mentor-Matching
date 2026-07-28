import { path } from '@/config/path'
import { ROLES } from '@/constants/roles'
function getDashboardPath(roles) {
  if (roles.includes(ROLES.ADMIN)) return path.admin.root
  if (roles.includes(ROLES.MENTOR)) return path.mentorPanel.root
  if (roles.includes(ROLES.LEARNER)) return path.user.root
  return path.discover
}
export { getDashboardPath }
