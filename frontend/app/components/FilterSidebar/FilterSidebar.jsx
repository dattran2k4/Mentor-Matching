import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
const defaultFilterGroups = [
  {
    title: 'M\xF4n h\u1ECDc',
    items: [
      {
        label: 'To\xE1n',
        value: 'subject:To\xE1n',
        helper: 'THCS, \xF4n chuy\u1EC3n c\u1EA5p v\xE0 n\u1EC1n t\u1EA3ng'
      },
      {
        label: 'Ti\u1EBFng Anh',
        value: 'subject:Ti\u1EBFng Anh',
        helper: 'THPT v\xE0 giao ti\u1EBFp c\u01A1 b\u1EA3n'
      },
      {
        label: 'V\u1EADt l\xFD',
        value: 'subject:V\u1EADt l\xFD',
        helper: 'M\xF4n h\u1ECDc c\u1EA7n so s\xE1nh c\xE1ch gi\u1EA3ng d\u1EA1y'
      },
      {
        label: 'L\u1EADp tr\xECnh',
        value: 'subject:L\u1EADp tr\xECnh Python',
        helper: 'Cho h\u1ECDc sinh c\u1EA7n n\u1EC1n t\u1EA3ng logic'
      }
    ]
  },
  {
    title: 'C\u1EA5p l\u1EDBp',
    items: [
      { label: 'L\u1EDBp 8', value: 'grade:L\u1EDBp 8' },
      { label: 'L\u1EDBp 9', value: 'grade:L\u1EDBp 9' },
      { label: 'THPT', value: 'grade:THPT' },
      { label: 'IELTS Foundation', value: 'grade:IELTS Foundation' }
    ]
  },
  {
    title: 'H\xECnh th\u1EE9c h\u1ECDc',
    items: [
      {
        label: 'Online',
        value: 'meeting:ONLINE',
        helper: 'Ph\xF9 h\u1EE3p l\u1ECBch linh ho\u1EA1t'
      },
      {
        label: 'Offline',
        value: 'meeting:OFFLINE',
        helper: 'C\u1EA7n g\u1EB7p tr\u1EF1c ti\u1EBFp'
      },
      {
        label: 'Hybrid',
        value: 'meeting:HYBRID',
        helper: 'C\xF3 th\u1EC3 k\u1EBFt h\u1EE3p online v\xE0 g\u1EB7p m\u1EB7t'
      }
    ]
  },
  {
    title: 'M\u1EE9c h\u1ECDc ph\xED m\u1ED7i gi\u1EDD',
    items: [
      { label: 'D\u01B0\u1EDBi 250k', value: 'price:under-250' },
      { label: '250k - 350k', value: 'price:250-350' },
      { label: '350k - 500k', value: 'price:350-500' },
      { label: 'Tr\xEAn 500k', value: 'price:500-plus' }
    ]
  },
  {
    title: 'Kh\u1EA3 d\u1EE5ng v\xE0 t\xEDn nhi\u1EC7m',
    items: [
      {
        label: 'Bu\u1ED5i t\u1ED1i',
        value: 'availability:evening',
        helper: 'D\u1EC5 gh\xE9p l\u1ECBch sau gi\u1EDD h\u1ECDc'
      },
      {
        label: 'Cu\u1ED1i tu\u1EA7n',
        value: 'availability:weekend',
        helper: '\u01AFu ti\xEAn Th\u1EE9 7 v\xE0 Ch\u1EE7 nh\u1EADt'
      },
      {
        label: 'C\xF3 l\u1ECBch g\u1EA7n nh\u1EA5t',
        value: 'availability:upcoming',
        helper: 'C\xF3 slot c\u1EE5 th\u1EC3 s\u1EAFp m\u1EDF'
      },
      {
        label: 'Ph\u1EA3n h\u1ED3i nhanh',
        value: 'availability:fast-response',
        helper: 'Th\u01B0\u1EDDng ph\u1EA3n h\u1ED3i trong 1-2 gi\u1EDD'
      },
      {
        label: '\u0110\xE3 duy\u1EC7t',
        value: 'trust:approved',
        helper: 'H\u1ED3 s\u01A1 \u0111\xE3 qua b\u01B0\u1EDBc duy\u1EC7t c\xF4ng khai'
      },
      {
        label: '\u0110\xE3 x\xE1c minh',
        value: 'trust:verified',
        helper: 'C\xF3 t\xEDn hi\u1EC7u x\xE1c minh b\u1ED5 sung'
      },
      {
        label: 'T\u1EEB 4.5 sao',
        value: 'trust:rating-4.5',
        helper: 'Ph\xF9 h\u1EE3p khi c\u1EA7n t\xEDn nhi\u1EC7m cao'
      }
    ]
  }
]
const FilterSidebar = ({
  groups = defaultFilterGroups,
  onApply,
  onClose,
  onReset,
  onToggleValue,
  selectedValues = []
}) => {
  const selectedCount = selectedValues.length
  return (
    <Card className='flex w-full flex-col rounded-3xl border-slate-200 bg-white shadow-sm'>
      <CardContent className='flex flex-1 flex-col gap-5 p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Badge className='gap-1.5' variant='info'>
                <SlidersHorizontal size={12} />
                Bộ lọc
              </Badge>
              {selectedCount ? <Badge variant='muted'>{selectedCount} đang chọn</Badge> : null}
            </div>
            <div>
              <h3 className='text-ink text-base font-semibold'>Thu hẹp danh sách mentor</h3>
              <p className='text-muted mt-1 text-sm leading-relaxed'>
                Chọn thêm hình thức học, khu vực chi tiết hoặc giới tính.
              </p>
            </div>
          </div>
          {onClose ? (
            <Button
              className='shrink-0 rounded-xl md:hidden'
              size='icon'
              type='button'
              variant='outline'
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          ) : null}
        </div>

        {groups.map((group, index) => (
          <div key={group.title}>
            {index > 0 ? <Separator className='mb-5' /> : null}
            <p className='text-ink text-sm font-semibold'>{group.title}</p>
            <div className='mt-3 space-y-2'>
              {group.items.map((item) => (
                <label
                  key={item.value}
                  className={`flex items-start gap-3 rounded-xl border px-3 py-3 transition ${item.disabled ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70' : 'cursor-pointer'} ${selectedValues.includes(item.value) ? 'border-blue-200 bg-blue-50' : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <Checkbox
                    checked={selectedValues.includes(item.value)}
                    disabled={item.disabled}
                    onChange={() => onToggleValue?.(item.value)}
                  />
                  <span className='min-w-0'>
                    <span className='flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700'>
                      <span>{item.label}</span>
                      {item.badgeLabel ? (
                        <span className='rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase'>
                          {item.badgeLabel}
                        </span>
                      ) : null}
                    </span>
                    {item.helper ? (
                      <span className='mt-1 block text-xs leading-relaxed text-slate-500'>
                        {item.helper}
                      </span>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className='mt-auto flex gap-3 border-t border-slate-200 pt-4'>
          <Button className='flex-1 rounded-xl' type='button' variant='outline' onClick={onReset}>
            <RotateCcw size={14} />
            Xóa bộ lọc
          </Button>
          <Button
            className='flex-1 rounded-xl'
            type='button'
            onClick={() => {
              onApply?.()
              onClose?.()
            }}
          >
            Áp dụng
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
var stdin_default = FilterSidebar
export { stdin_default as default, defaultFilterGroups }
