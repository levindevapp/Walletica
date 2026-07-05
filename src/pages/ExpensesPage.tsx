import { Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'
import { ExpenseTable } from '../features/expenses/ExpenseTable'
import { expenses, formatCurrency } from '../features/expenses/data'

export function ExpensesPage() {
  return (
    <>
      <PageHeader title="支出一覧" description="登録した支出の検索・編集・削除ができます">
        <Link to="/expenses/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"><Plus size={17} />支出を登録</Link>
      </PageHeader>
      <Card className="mb-5 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500" placeholder="内容・店舗・メモを検索" /></label>
          <select className="rounded-lg border border-slate-200 px-3 text-sm text-slate-600"><option>すべてのカテゴリ</option><option>食費</option><option>交通費</option></select>
          <select className="rounded-lg border border-slate-200 px-3 text-sm text-slate-600"><option>2026年7月</option><option>2026年6月</option></select>
          <button type="button" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">検索</button>
        </div>
      </Card>
      <div className="mb-4 flex gap-6 text-sm"><span className="text-slate-500">件数 <strong className="ml-1 text-slate-800">{expenses.length}件</strong></span><span className="text-slate-500">合計 <strong className="ml-1 text-red-500">{formatCurrency(expenses.reduce((sum, item) => sum + item.amount, 0))}</strong></span></div>
      <Card><ExpenseTable items={expenses} editable /></Card>
    </>
  )
}
