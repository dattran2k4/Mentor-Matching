import { cn } from '@/utils/cn'
const SectionTitle = ({ eyebrow, title, subtitle, align = 'left', size = 'lg' }) => {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left'
  const titleClassName =
    size === 'md'
      ? 'text-3xl leading-tight font-black tracking-tight md:text-[2.65rem]'
      : 'text-3xl leading-tight font-black tracking-tight md:text-5xl'
  return (
    <div className={cn('flex max-w-4xl flex-col gap-3', alignment)}>
      {eyebrow ? (
        <span className='text-primary text-2xl font-bold uppercase'>{eyebrow}</span>
      ) : null}
      <h2 className={cn('text-ink', titleClassName)}>{title}</h2>
      {subtitle ? (
        <p className='text-muted max-w-2xl text-base leading-relaxed md:text-lg'>{subtitle}</p>
      ) : null}
    </div>
  )
}
var stdin_default = SectionTitle
export { stdin_default as default }
