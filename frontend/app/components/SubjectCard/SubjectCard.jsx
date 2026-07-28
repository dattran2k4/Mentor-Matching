import * as Icons from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { path } from '@/config/path'
const SubjectCard = ({ subject }) => {
  const IconName = subject.icon ?? 'BookOpen'
  const Icon = Icons[IconName] || Icons.BookOpen
  const grades = subject.grades ?? []
  const destination = subject.href ?? path.discover
  const description =
    subject.description?.trim() ||
    'B\u1EAFt \u0111\u1EA7u t\u1EEB m\xF4n h\u1ECDc n\xE0y \u0111\u1EC3 t\xECm mentor ph\xF9 h\u1EE3p.'
  const badgeLabel = subject.badgeLabel ?? grades[0] ?? 'Nhi\u1EC1u c\u1EA5p l\u1EDBp'
  return (
    <motion.article whileHover={{ y: -4 }} className='h-full'>
      <Card className='shadow-soft h-full rounded-[28px] border-slate-200/80'>
        <CardContent className='flex h-full p-6'>
          <Link to={destination} className='flex h-full flex-col gap-4'>
            <div className='flex items-start justify-between gap-3'>
              <span className='bg-primary/10 text-primary flex h-13 w-13 items-center justify-center rounded-2xl'>
                <Icon size={22} />
              </span>
              <Badge className='px-3 py-1 text-sm font-semibold' variant='outline'>
                {badgeLabel}
              </Badge>
            </div>
            <div className='space-y-2.5'>
              <span className='text-ink text-lg font-bold md:text-[1.35rem]'>{subject.name}</span>
              <p className='text-muted text-[15px] leading-relaxed'>{description}</p>
            </div>
            <div className='mt-auto flex flex-wrap gap-2.5 pt-1'>
              {grades.slice(0, 3).map((grade) => (
                <Badge key={grade} className='px-3 py-1 text-sm font-medium' variant='muted'>
                  {grade}
                </Badge>
              ))}
            </div>
            <p className='text-primary text-base font-bold'>Khám phá mentor phù hợp</p>
          </Link>
        </CardContent>
      </Card>
    </motion.article>
  )
}
var stdin_default = SubjectCard
export { stdin_default as default }
