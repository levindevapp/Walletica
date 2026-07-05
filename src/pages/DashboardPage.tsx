import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'
import { PeriodSelector } from '../components/common/PeriodSelector'
import { CategoryDonut } from '../features/analysis/CategoryDonut'
import { SpendingBarChart } from '../features/analysis/SpendingBarChart'
import { ExpenseTable } from '../features/expenses/ExpenseTable'
import { formatCurrency } from '../features/expenses/data'
import { toExpense } from '../features/expenses/mappers'
import { expenseApi } from '../services/api'
import type { DashboardResponse } from '../types/api'

const month = '2026-07'
const today = '2026-07-05'
const toneClass = { red: 'text-red-500 bg-red-50', blue: 'text-blue-600 bg-blue-50', green: 'text-brand-600 bg-brand-50', amber: 'text-amber-600 bg-amber-50' }

export function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    expenseApi.getDashboard(month, today).then(setData).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'ダッシュボードを取得できませんでした。'))
  }, [])

  if (error) return <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  if (!data) return <p className="py-16 text-center text-sm text-slate-500">読み込み中…</p>

  const summaries = [
    { label: '今月の支出合計', value: data.total, detail: `前月差 ${formatCurrency(data.difference)}`, tone: 'red', icon: Wallet, up: data.difference > 0 },
    { label: '今日の支出', value: data.todayTotal, detail: `${data.month.replace('-', '年')}月`, tone: 'blue', icon: CalendarDays, up: false },
    { label: '予算残額', value: data.remainingBudget, detail: `月予算 ${formatCurrency(data.budget)}`, tone: 'green', icon: Wallet, up: false },
    { label: '前月の支出', value: data.previousTotal, detail: data.difference > 0 ? '支出が増加しています' : '支出が減少しています', tone: 'amber', icon: ArrowUpRight, up: data.difference > 0 },
  ] as const

  return (
    <>
      <PageHeader title="ダッシュボード" description="支出状況をひと目で確認できます"><PeriodSelector label="2026年7月" /></PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{summaries.map(({ label, value, detail, tone, icon: Icon, up }) => <Card key={label} className="p-5"><div className="flex justify-between"><p className="text-sm text-slate-500">{label}</p><span className={`rounded-lg p-2 ${toneClass[tone]}`}><Icon size={17} /></span></div><p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{formatCurrency(value)}</p><p className={`mt-2 flex items-center gap-1 text-xs ${up ? 'text-red-500' : 'text-slate-500'}`}>{up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{detail}</p></Card>)}</div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.35fr]"><Card title="カテゴリ別支出（今月）" action={<Link to="/analysis/monthly" className="text-xs font-medium text-brand-600">詳細を見る</Link>}><div className="p-5"><CategoryDonut compact data={data.categories} /></div></Card><Card title="日別支出推移（今月）" action={<span className="rounded-md bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">日別</span>}><div className="p-4"><SpendingBarChart data={data.daily} /></div></Card></div>
      <Card className="mt-5" title="最近の支出" action={<Link to="/expenses" className="flex items-center gap-1 text-xs font-medium text-brand-600">すべて見る <ArrowRight size={13} /></Link>}>{data.recent.length > 0 ? <ExpenseTable items={data.recent.map(toExpense)} /> : <p className="p-8 text-center text-sm text-slate-500">支出がありません。</p>}</Card>
    </>
  )
}
