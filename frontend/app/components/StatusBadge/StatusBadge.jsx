import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BOOKING_STATUS_CONFIG } from '@/constants/booking-status'
import { cn } from '@/utils/cn'
const toneVariantMap = {
  success: 'success',
  warning: 'warning',
  danger: 'destructive',
  info: 'info',
  muted: 'muted'
}
const statusConfigMap = {
  booking: {
    PENDING: { ...BOOKING_STATUS_CONFIG.PENDING, icon: Clock },
    CONFIRMED: { ...BOOKING_STATUS_CONFIG.CONFIRMED, icon: CheckCircle2 },
    COMPLETED: { ...BOOKING_STATUS_CONFIG.COMPLETED, icon: CheckCircle2 },
    CANCELLED: { ...BOOKING_STATUS_CONFIG.CANCELLED, icon: XCircle },
    REJECTED: { ...BOOKING_STATUS_CONFIG.REJECTED, icon: XCircle },
    NO_SHOW: { ...BOOKING_STATUS_CONFIG.NO_SHOW, icon: AlertTriangle }
  },
  payment: {
    PENDING: { label: 'Ch\u1EDD thanh to\xE1n', tone: 'warning', icon: Clock },
    PAID: { label: '\u0110\xE3 thanh to\xE1n', tone: 'success', icon: CheckCircle2 },
    FAILED: { label: 'Thanh to\xE1n l\u1ED7i', tone: 'danger', icon: AlertTriangle },
    CANCELLED: { label: '\u0110\xE3 h\u1EE7y', tone: 'muted', icon: XCircle },
    REFUNDED: { label: '\u0110\xE3 ho\xE0n ti\u1EC1n', tone: 'info', icon: CheckCircle2 }
  },
  approval: {
    DRAFT: { label: 'B\u1EA3n nh\xE1p', tone: 'muted', icon: Clock },
    PENDING: { label: 'Ch\u1EDD duy\u1EC7t', tone: 'warning', icon: Clock },
    APPROVED: { label: '\u0110\xE3 duy\u1EC7t', tone: 'success', icon: CheckCircle2 },
    REJECTED: { label: 'T\u1EEB ch\u1ED1i', tone: 'danger', icon: XCircle },
    SUSPENDED: { label: 'T\u1EA1m d\u1EEBng', tone: 'danger', icon: ShieldAlert }
  },
  verification: {
    UNVERIFIED: { label: 'Ch\u01B0a x\xE1c minh', tone: 'muted', icon: ShieldAlert },
    PENDING: { label: '\u0110ang x\xE1c minh', tone: 'warning', icon: Clock },
    VERIFIED: { label: '\u0110\xE3 x\xE1c minh', tone: 'success', icon: CheckCircle2 },
    REJECTED: { label: 'X\xE1c minh l\u1ED7i', tone: 'danger', icon: XCircle }
  },
  user: {
    ACTIVE: { label: '\u0110ang ho\u1EA1t \u0111\u1ED9ng', tone: 'success', icon: CheckCircle2 },
    INACTIVE: { label: 'Kh\xF4ng ho\u1EA1t \u0111\u1ED9ng', tone: 'muted', icon: Clock },
    BANNED: { label: '\u0110\xE3 kh\xF3a', tone: 'danger', icon: ShieldAlert }
  }
}
function StatusBadge({ className, kind, status }) {
  const config = statusConfigMap[kind][status] ?? {
    label: String(status),
    tone: 'muted',
    icon: Clock
  }
  const Icon = config.icon
  return (
    <Badge className={cn('gap-1.5', className)} variant={toneVariantMap[config.tone]}>
      <Icon aria-hidden='true' size={13} />
      {config.label}
    </Badge>
  )
}
export { StatusBadge }
