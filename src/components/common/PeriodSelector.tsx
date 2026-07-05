import { ChevronLeft, ChevronRight } from 'lucide-react'

type PeriodSelectorProps = { label: string }

export function PeriodSelector({ label }: PeriodSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      <button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" type="button" aria-label="前の期間">
        <ChevronLeft size={16} />
      </button>
      <span className="min-w-24 text-center text-sm font-medium text-slate-700">{label}</span>
      <button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" type="button" aria-label="次の期間">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
