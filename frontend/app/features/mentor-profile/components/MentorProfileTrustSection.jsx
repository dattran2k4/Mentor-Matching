import { BriefcaseBusiness, CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react'
import { MentorProfileContentSection } from '@/features/mentor-profile/components/MentorProfilePageShell'
function MentorProfileTrustSection({ mentor }) {
  const experience = mentor.experience[0]
  const education = mentor.education[0]
  return (
    <MentorProfileContentSection id='experience' title='Điểm tin cậy và kinh nghiệm'>
      <div className='grid gap-3 md:grid-cols-3'>
        <InfoTile
          icon={<ShieldCheck size={18} />}
          title='Trạng thái hồ sơ'
          lines={[
            mentor.approvalStatus
              ? '\u0110\xE3 c\xF3 tr\u1EA1ng th\xE1i duy\u1EC7t'
              : 'Ch\u01B0a c\xF4ng khai tr\u1EA1ng th\xE1i duy\u1EC7t',
            mentor.verificationStatus
              ? '\u0110\xE3 c\xF3 tr\u1EA1ng th\xE1i x\xE1c minh'
              : 'Ch\u01B0a c\xF4ng khai x\xE1c minh'
          ]}
        />
        <InfoTile
          icon={<BriefcaseBusiness size={18} />}
          title='Kinh nghiệm'
          lines={experience ? [experience.period, experience.title] : ['Ch\u01B0a c\xF4ng khai']}
        />
        <InfoTile
          icon={<GraduationCap size={18} />}
          title='Học vấn'
          lines={education ? [education.degree, education.school] : ['Ch\u01B0a c\xF4ng khai']}
        />
      </div>

      {mentor.achievements.length ? (
        <div className='mt-4 rounded-xl bg-slate-50 p-4'>
          <p className='text-ink text-sm font-bold'>Thành tích và chứng nhận</p>
          <ul className='mt-2 space-y-2'>
            {mentor.achievements.slice(0, 4).map((achievement) => (
              <li key={achievement} className='text-muted flex gap-2 text-sm'>
                <CheckCircle2 className='mt-0.5 shrink-0 text-emerald-600' size={15} />
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </MentorProfileContentSection>
  )
}
function InfoTile({ icon, lines, title }) {
  return (
    <div className='rounded-xl bg-slate-50 p-4'>
      <div className='text-primary flex items-center gap-2'>
        {icon}
        <p className='text-ink text-sm font-bold'>{title}</p>
      </div>
      <div className='text-muted mt-2 space-y-1 text-xs'>
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}
export { MentorProfileTrustSection }
