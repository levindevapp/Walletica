import { Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'
import { ExpenseTable } from '../features/expenses/ExpenseTable'
import { formatCurrency } from '../features/expenses/data'
import { expenseApi } from '../services/api'
import type { Expense } from '../types/expense'
import { toExpense } from '../features/expenses/mappers'

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    expenseApi.getExpenses()
      .then((items) => setExpenses(items.map(toExpense)))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : '支出を取得できませんでした。'))
      .finally(() => setLoading(false))
  }, [])

  const categoryOptions = useMemo(() => [...new Set(expenses.map((expense) => expense.category))], [expenses])
  const filteredExpenses = useMemo(() => expenses.filter((expense) => {
    const matchesKeyword = expense.description.toLowerCase().includes(keyword.toLowerCase())
    const matchesCategory = !category || expense.category === category
    return matchesKeyword && matchesCategory
  }), [category, expenses, keyword])

  async function handleDelete(id: number): Promise<void> {
    if (!window.confirm('この支出を削除しますか？')) return
    setDeletingId(id)
    setError(null)
    try {
      await expenseApi.deleteExpense(id)
      setExpenses((items) => items.filter((item) => item.id !== id))
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : '支出を削除できませんでした。')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <PageHeader title="支出一覧" description="登録した支出の検索・編集・削除ができます"><Link to="/expenses/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"><Plus size={17} />支出を登録</Link></PageHeader>
      {error && <div role="alert" className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <Card className="mb-5 p-4"><div className="grid gap-3 md:grid-cols-[1fr_200px]">
        <label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500" placeholder="内容・店舗・メモを検索" /></label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-slate-200 px-3 text-sm text-slate-600"><option value="">すべてのカテゴリ</option>{categoryOptions.map((name) => <option key={name}>{name}</option>)}</select>
      </div></Card>
      <div className="mb-4 flex gap-6 text-sm"><span className="text-slate-500">件数 <strong className="ml-1 text-slate-800">{filteredExpenses.length}件</strong></span><span className="text-slate-500">合計 <strong className="ml-1 text-red-500">{formatCurrency(filteredExpenses.reduce((sum, item) => sum + item.amount, 0))}</strong></span></div>
      <Card>{loading ? <p className="p-8 text-center text-sm text-slate-500">読み込み中…</p> : filteredExpenses.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">該当する支出はありません。</p> : <ExpenseTable items={filteredExpenses} editable onDelete={(id) => void handleDelete(id)} deletingId={deletingId} />}</Card>
    </>
  )
}
