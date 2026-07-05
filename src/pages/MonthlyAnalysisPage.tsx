import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'
import { PeriodSelector } from '../components/common/PeriodSelector'
import { CategoryDonut } from '../features/analysis/CategoryDonut'
import { SpendingBarChart } from '../features/analysis/SpendingBarChart'
import { formatCurrency } from '../features/expenses/data'
import { expenseApi } from '../services/api'
import type { MonthlyAnalysisResponse } from '../types/api'

const month = '2026-07'

export function MonthlyAnalysisPage() {
  const [data, setData] = useState<MonthlyAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    expenseApi.getMonthlyAnalysis(month).then(setData).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : '月次分析を取得できませんでした。'))
  }, [])

  if (error) return <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  if (!data) return <p className="py-16 text-center text-sm text-slate-500">読み込み中…</p>

  const summaries = [['月の総支出', data.total], ['前月との差額', data.difference], ['1日平均', data.dailyAverage], ['予算残額', data.remainingBudget]] as const

  return (
    <>
      <PageHeader title="月次分析" description="月ごとの支出傾向を詳しく分析します"><PeriodSelector label="2026年7月" /></PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{summaries.map(([label, value]) => <Card key={label} className="p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(value)}</p></Card>)}</div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]"><Card title="日別支出推移"><div className="p-4"><SpendingBarChart data={data.daily} /></div></Card><Card title="カテゴリ別支出"><div className="p-5"><CategoryDonut compact data={data.categories} /></div></Card></div>
      <Card className="mt-5" title="カテゴリ予算との比較"><div className="h-72 p-5"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.categories} layout="vertical" margin={{ left: 10 }}><CartesianGrid horizontal={false} stroke="#edf1ef" /><XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} /><YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={60} axisLine={false} tickLine={false} /><Tooltip formatter={(value: number | string | undefined) => formatCurrency(Number(value ?? 0))} /><Bar dataKey="budget" name="予算" fill="#d9e4df" radius={[0, 4, 4, 0]} /><Bar dataKey="amount" name="支出" fill="#219667" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></Card>
    </>
  )
}
