import { Star } from 'lucide-react'
const RatingStars = ({ rating, size = 16 }) => {
  const filledCount = Math.round(rating)
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={index < filledCount ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
        />
      ))}
    </div>
  )
}
var stdin_default = RatingStars
export { stdin_default as default }
