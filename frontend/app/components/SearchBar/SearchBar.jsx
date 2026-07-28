import { BookOpen, MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'
const SearchBar = ({
  keywordPlaceholder = 'M\xF4n h\u1ECDc, mentor ho\u1EB7c m\u1EE5c ti\xEAu h\u1ECDc t\u1EADp',
  contextPlaceholder = 'L\u1EDBp, khu v\u1EF1c ho\u1EB7c h\xECnh th\u1EE9c h\u1ECDc',
  buttonLabel = 'T\xECm mentor',
  quickTags = [],
  helperText = 'C\xF3 th\u1EC3 t\xECm theo m\xF4n h\u1ECDc, m\u1EE5c ti\xEAu h\u1ECDc, l\u1EDBp ho\u1EB7c h\xECnh th\u1EE9c h\u1ECDc mong mu\u1ED1n.',
  keywordValue,
  contextValue,
  onKeywordChange,
  onContextChange,
  onQuickTagClick,
  onSubmit,
  isSubmitting = false,
  contextSuggestions = [],
  isContextSuggestionsLoading = false,
  contextSuggestionsError,
  contextSuggestionsEmptyText = 'Kh\xF4ng t\xECm th\u1EA5y th\xE0nh ph\u1ED1 ph\xF9 h\u1EE3p.',
  onContextSuggestionSelect,
  className
}) => {
  const [isContextFocused, setIsContextFocused] = useState(false)
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.()
  }
  const shouldShowContextSuggestions =
    isContextFocused &&
    Boolean(onContextSuggestionSelect) &&
    Boolean(contextValue?.trim()) &&
    (isContextSuggestionsLoading ||
      Boolean(contextSuggestionsError) ||
      contextSuggestions.length > 0 ||
      (contextValue?.trim().length ?? 0) >= 2)
  return (
    <Card className={cn('shadow-soft rounded-[28px] border-slate-200/80 bg-white', className)}>
      <CardContent className='p-4 md:p-5'>
        <form
          className='grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end'
          onSubmit={handleSubmit}
        >
          <label className='flex flex-col gap-2'>
            <span className='text-ink text-[11px] font-semibold tracking-[0.2em] uppercase'>
              Môn học hoặc mục tiêu
            </span>
            <div className='relative'>
              <Search className='text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2' />
              <Input
                aria-label='Tìm theo môn học, mentor hoặc mục tiêu học tập'
                className='h-12 bg-slate-50 pr-4 pl-10'
                placeholder={keywordPlaceholder}
                value={keywordValue}
                onChange={(event) => onKeywordChange?.(event.target.value)}
              />
            </div>
          </label>

          <label className='flex flex-col gap-2'>
            <span className='text-ink text-[11px] font-semibold tracking-[0.2em] uppercase'>
              Cấp lớp hoặc bối cảnh học
            </span>
            <div className='relative'>
              <MapPin className='text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2' />
              <Input
                aria-label='Lớp, khu vực hoặc hình thức học'
                className='h-12 bg-slate-50 pr-4 pl-10'
                placeholder={contextPlaceholder}
                value={contextValue}
                onBlur={() => {
                  window.setTimeout(() => setIsContextFocused(false), 120)
                }}
                onChange={(event) => onContextChange?.(event.target.value)}
                onFocus={() => setIsContextFocused(true)}
              />
              {shouldShowContextSuggestions ? (
                <div className='absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg'>
                  {isContextSuggestionsLoading ? (
                    <p className='px-4 py-3 text-sm text-slate-600'>Đang tìm khu vực phù hợp...</p>
                  ) : contextSuggestionsError ? (
                    <p className='px-4 py-3 text-sm text-red-600'>{contextSuggestionsError}</p>
                  ) : contextSuggestions.length ? (
                    <div className='py-2'>
                      {contextSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          className='flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition hover:bg-slate-50'
                          type='button'
                          onClick={() => onContextSuggestionSelect?.(suggestion)}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          <span className='text-ink text-sm font-medium'>{suggestion.label}</span>
                          {suggestion.description ? (
                            <span className='text-muted text-xs'>{suggestion.description}</span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className='px-4 py-3 text-sm text-slate-600'>
                      {contextSuggestionsEmptyText}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </label>

          <Button
            className='h-12 xl:min-w-[150px]'
            isLoading={isSubmitting}
            size='lg'
            type='submit'
          >
            {buttonLabel}
          </Button>
        </form>

        <Separator className='my-4' />

        <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex max-w-2xl items-start gap-2 text-sm text-slate-600'>
            <BookOpen className='text-primary mt-0.5 h-4 w-4 shrink-0' />
            <p className='leading-relaxed'>{helperText}</p>
          </div>

          {quickTags.length > 0 ? (
            <div className='flex flex-wrap gap-2 lg:justify-end'>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  className={cn(
                    buttonVariants({
                      className:
                        'h-8 rounded-full border-slate-200 bg-slate-50 px-3 text-xs hover:bg-white',
                      size: 'sm',
                      variant: 'outline'
                    })
                  )}
                  type='button'
                  onClick={() => onQuickTagClick?.(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
var stdin_default = SearchBar
export { stdin_default as default }
