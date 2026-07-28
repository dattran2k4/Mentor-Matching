import { DashboardSectionHeader } from '@/components/DashboardSectionHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/utils/cn'
function WorkspacePanel({ action, children, className, contentClassName, headerClassName, title }) {
  return (
    <Card className={cn('rounded-3xl', className)}>
      <CardHeader className={cn('pb-0', headerClassName)}>
        <DashboardSectionHeader action={action} title={title} />
      </CardHeader>
      <CardContent className={cn('space-y-4', contentClassName)}>{children}</CardContent>
    </Card>
  )
}
export { WorkspacePanel }
