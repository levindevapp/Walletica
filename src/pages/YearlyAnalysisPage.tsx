import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'
import { PeriodSelector } from '../components/common/PeriodSelector'
import { formatCurrency, monthlySpending } from '../features/expenses/data'

export function YearlyAnalysisPage() {
  const total = monthlySpending.reduce((sum, item) => sum + item.amount, 0)
  return (
    <>
      <PageHeader title="年次分析" description="年間の支出推移と傾向を確認します"><PeriodSelector label="2026年" /></PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['年間総支出', total], ['月平均支出', Math.round(total / 12)], ['最大支出月', 137500], ['最小支出月', 92400]].map(([label, value]) => <Card key={String(label)} className="p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(Number(value))}</p></Card>)}</div>
      <Card className="mt-5" title="月別支出推移"><div className="h-80 p-5"><ResponsiveContainer width="100%" height="100%"><LineChart data={monthlySpending} margin={{ top: 10, right: 20, left: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eeeb" /><XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip formatter={(value: number | string | undefined) => formatCurrency(Number(value ?? 0))} /><Line type="monotone" dataKey="amount" name="2026年" stroke="#16875a" strokeWidth={3} dot={{ fill: '#16875a', r: 3 }} /></LineChart></ResponsiveContainer></div></Card>
      <div className="mt-5 grid gap-5 lg:grid-cols-2"><Card title="年間サマリー"><div className="space-y-4 p-5">{[['食費', 385200, 28], ['住居費', 372000, 27], ['娯楽費', 180400, 13], ['交通費', 145200, 11]].map(([name, amount, ratio]) => <div key={String(name)}><div className="mb-1 flex justify-between text-sm"><span className="text-slate-600">{name}</span><span className="font-medium">{formatCurrency(Number(amount))}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${ratio}%` }} /></div></div>)}</div></Card><Card title="分析メモ"><div className="space-y-3 p-5 text-sm text-slate-600"><p className="rounded-lg bg-brand-50 p-4">食費は年間支出の28%を占めています。直近3か月は緩やかな増加傾向です。</p><p className="rounded-lg bg-amber-50 p-4">7月の支出は年間平均を上回っています。娯楽費の増加が主な要因です。</p></div></Card></div>
    </>
  )
}
