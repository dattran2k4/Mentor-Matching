import { DashboardShell } from '@/components/DashboardShell'
import { mentorNavItems } from '@/constants/dashboard-nav'
import { path } from '@/config/path'
function MentorLayout() {
  return (
    <DashboardShell
      accentClass='bg-emerald-600'
      brandHref={path.mentorPanel.root}
      brandLabel='Mentor'
      homeLink='/'
      navItems={mentorNavItems}
    />
  )
}
export { MentorLayout as default }
