import { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'
import { PeriodSelector } from '../components/common/PeriodSelector'
import { formatCurrency } from '../features/expenses/data'
import { expenseApi } from '../services/api'
import type { YearlyAnalysisResponse } from '../types/api'

const year = '2026'

export function YearlyAnalysisPage() {
  const [data, setData] = useState<YearlyAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    expenseApi.getYearlyAnalysis(year).then(setData).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : '年次分析を取得できませんでした。'))
  }, [])

  if (error) return <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  if (!data) return <p className="py-16 text-center text-sm text-slate-500">読み込み中…</p>

  const summaries = [
    ['年間総支出', formatCurrency(data.total)],
    ['月平均支出', formatCurrency(data.monthlyAverage)],
    ['最大支出月', `${data.maxMonth.month} ${formatCurrency(data.maxMonth.amount)}`],
    ['最小支出月', `${data.minMonth.month} ${formatCurrency(data.minMonth.amount)}`],
  ] as const

  return (
    <>
      <PageHeader title="年次分析" description="年間の支出推移と傾向を確認します"><PeriodSelector label="2026年" /></PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{summaries.map(([label, value]) => <Card key={label} className="p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-xl font-bold text-slate-900">{value}</p></Card>)}</div>
      <Card className="mt-5" title="月別支出推移"><div className="h-80 p-5"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.monthly} margin={{ top: 10, right: 20, left: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eeeb" /><XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip formatter={(value: number | string | undefined) => formatCurrency(Number(value ?? 0))} /><Line type="monotone" dataKey="amount" name={`${data.year}年`} stroke="#16875a" strokeWidth={3} dot={{ fill: '#16875a', r: 3 }} /></LineChart></ResponsiveContainer></div></Card>
      <div className="mt-5 grid gap-5 lg:grid-cols-2"><Card title="カテゴリ別年間支出"><div className="space-y-4 p-5">{data.categories.map((category) => <div key={category.name}><div className="mb-1 flex justify-between text-sm"><span className="text-slate-600">{category.name}</span><span className="font-medium">{formatCurrency(category.amount)}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full" style={{ width: `${data.total > 0 ? category.amount / data.total * 100 : 0}%`, backgroundColor: category.color }} /></div></div>)}</div></Card><Card title="年間構成"><div className="space-y-3 p-5 text-sm text-slate-600">{data.categories.slice(0, 3).map((category, index) => <p key={category.name} className={`rounded-lg p-4 ${index === 0 ? 'bg-brand-50' : 'bg-slate-50'}`}>{category.name}は年間支出の{data.total > 0 ? Math.round(category.amount / data.total * 100) : 0}%です。</p>)}</div></Card></div>
    </>
  )
}
