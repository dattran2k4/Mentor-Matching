import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
  UserCircle,
  BookOpen,
  DollarSign,
  BarChart3,
  Shield,
  GraduationCap,
  ClipboardList
} from 'lucide-react'
import { path } from '@/config/path'
const userNavItems = [
  { label: 'T\u1ED5ng quan', to: path.user.root, icon: LayoutDashboard, end: true },
  { label: 'L\u1ECBch h\u1ECDc', to: path.user.bookings, icon: Calendar },
  { label: 'Thanh to\xE1n', to: path.user.payments, icon: CreditCard },
  { label: 'H\u1ED3 s\u01A1', to: path.user.profile, icon: UserCircle }
]
const mentorNavItems = [
  { label: 'T\u1ED5ng quan', to: path.mentorPanel.root, icon: LayoutDashboard, end: true },
  { label: 'L\u1ECBch d\u1EA1y', to: path.mentorPanel.schedule, icon: Calendar },
  { label: 'H\u1ECDc vi\xEAn', to: path.mentorPanel.students, icon: GraduationCap },
  { label: 'Thu nh\u1EADp', to: path.mentorPanel.earnings, icon: DollarSign },
  { label: 'H\u1ED3 s\u01A1 mentor', to: path.mentorPanel.profile, icon: BookOpen },
  { label: 'X\xE1c th\u1EF1c danh t\xEDnh', to: path.mentorPanel.verification, icon: Shield }
]
const adminNavItems = [
  { label: 'T\u1ED5ng quan', to: path.admin.root, icon: LayoutDashboard, end: true },
  { label: 'Ng\u01B0\u1EDDi d\xF9ng', to: path.admin.users, icon: Users },
  { label: 'Mentor', to: path.admin.mentors, icon: Shield },
  { label: 'Booking', to: path.admin.bookings, icon: ClipboardList },
  { label: 'Danh m\u1EE5c', to: path.admin.catalog, icon: BookOpen },
  { label: 'B\xE1o c\xE1o', to: path.admin.reports, icon: BarChart3 },
  { label: 'C\xE0i \u0111\u1EB7t', to: path.admin.settings, icon: Settings }
]
export { adminNavItems, mentorNavItems, userNavItems }
