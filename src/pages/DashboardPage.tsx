import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'
import { PeriodSelector } from '../components/common/PeriodSelector'
import { CategoryDonut } from '../features/analysis/CategoryDonut'
import { SpendingBarChart } from '../features/analysis/SpendingBarChart'
import { ExpenseTable } from '../features/expenses/ExpenseTable'
import { expenses, formatCurrency } from '../features/expenses/data'

const summaries = [
  { label: '今月の支出合計', value: 125030, detail: '前月比 +8.2%', tone: 'red', icon: Wallet, up: true },
  { label: '今日の支出', value: 1200, detail: '今週は ¥18,430', tone: 'blue', icon: CalendarDays },
  { label: '予算残額', value: 24970, detail: '月予算 ¥150,000', tone: 'green', icon: Wallet },
  { label: '前月との差額', value: 9470, detail: '支出が増加しています', tone: 'amber', icon: ArrowUpRight, up: true },
] as const

const toneClass = { red: 'text-red-500 bg-red-50', blue: 'text-blue-600 bg-blue-50', green: 'text-brand-600 bg-brand-50', amber: 'text-amber-600 bg-amber-50' }

export function DashboardPage() {
  return (
    <>
      <PageHeader title="ダッシュボード" description="支出状況をひと目で確認できます"><PeriodSelector label="2026年7月" /></PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaries.map(({ label, value, detail, tone, icon: Icon, up }) => (
          <Card key={label} className="p-5">
            <div className="flex justify-between"><p className="text-sm text-slate-500">{label}</p><span className={`rounded-lg p-2 ${toneClass[tone]}`}><Icon size={17} /></span></div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{formatCurrency(value)}</p>
            <p className={`mt-2 flex items-center gap-1 text-xs ${up ? 'text-red-500' : 'text-slate-500'}`}>{up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{detail}</p>
          </Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.35fr]">
        <Card title="カテゴリ別支出（今月）" action={<Link to="/analysis/monthly" className="text-xs font-medium text-brand-600">詳細を見る</Link>}><div className="p-5"><CategoryDonut compact /></div></Card>
        <Card title="日別支出推移（今月）" action={<span className="rounded-md bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">日別</span>}><div className="p-4"><SpendingBarChart /></div></Card>
      </div>
      <Card className="mt-5" title="最近の支出" action={<Link to="/expenses" className="flex items-center gap-1 text-xs font-medium text-brand-600">すべて見る <ArrowRight size={13} /></Link>}><ExpenseTable items={expenses.slice(0, 5)} /></Card>
    </>
  )
}
