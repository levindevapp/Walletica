import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'
import { expenseApi } from '../services/api'
import type { CreateExpenseRequest, ExpenseDetailResponse, MasterDataResponse } from '../types/api'

const inputClass = 'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

const emptyMasterData: MasterDataResponse = { categories: [], paymentMethods: [] }

export function ExpenseFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const expenseId = id ? Number(id) : null
  const editing = expenseId !== null
  const [masterData, setMasterData] = useState<MasterDataResponse>(emptyMasterData)
  const [expense, setExpense] = useState<ExpenseDetailResponse | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(editing)

  useEffect(() => {
    const requests = [expenseApi.getMasterData(), expenseId ? expenseApi.getExpense(expenseId) : Promise.resolve(null)] as const
    Promise.all(requests)
      .then(([masterDataResponse, expenseResponse]) => {
        setMasterData(masterDataResponse)
        setExpense(expenseResponse)
        if (expenseResponse) setSelectedCategoryId(String(expenseResponse.categoryId))
      })
      .catch((error: unknown) => setStatus({ type: 'error', message: error instanceof Error ? error.message : 'マスターデータを取得できませんでした。' }))
      .finally(() => setLoading(false))
  }, [expenseId])

  const selectedCategory = masterData.categories.find((category) => category.id === Number(selectedCategoryId))

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setSubmitting(true)
    setStatus(null)
    const form = event.currentTarget
    const values = new FormData(form)
    const body: CreateExpenseRequest = {
      spentOn: String(values.get('spentOn')),
      amount: Number(values.get('amount')),
      categoryId: Number(values.get('categoryId')),
      subcategoryId: Number(values.get('subcategoryId')),
      paymentMethodId: Number(values.get('paymentMethodId')),
      merchant: String(values.get('merchant') ?? '').trim() || null,
      memo: String(values.get('memo') ?? '').trim() || null,
      costType: values.get('costType') === 'fixed' ? 'fixed' : 'variable',
      spendingType: values.get('spendingType') === 'waste' ? 'waste' : values.get('spendingType') === 'investment' ? 'investment' : 'necessary',
    }

    try {
      if (expenseId) {
        await expenseApi.updateExpense(expenseId, body)
        navigate('/expenses')
      } else {
        await expenseApi.createExpense(body)
        form.reset()
        setSelectedCategoryId('')
        setStatus({ type: 'success', message: '支出を保存しました。' })
      }
    } catch (error: unknown) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : '支出を保存できませんでした。' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={editing ? '支出編集' : '支出入力'} description={editing ? '登録済みの支出を変更します' : '日々の支出を記録します'} />
      <Card className="p-5 sm:p-7">
        {status && <div role="status" className={`mb-5 rounded-lg border px-4 py-3 text-sm ${status.type === 'success' ? 'border-brand-100 bg-brand-50 text-brand-700' : 'border-red-100 bg-red-50 text-red-700'}`}>{status.message}</div>}
        {loading ? <p className="py-12 text-center text-sm text-slate-500">読み込み中…</p> : editing && !expense ? <p className="py-12 text-center text-sm text-slate-500">支出を読み込めませんでした。</p> :
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">日付<span className="ml-1 text-red-500">*</span><input name="spentOn" required type="date" defaultValue={expense?.spentOn ?? '2026-07-05'} className={inputClass} /></label>
            <label className="text-sm font-medium text-slate-700">金額<span className="ml-1 text-red-500">*</span><div className="relative"><input name="amount" required min="1" type="number" defaultValue={expense?.amount} placeholder="0" className={`${inputClass} pr-9`} /><span className="absolute bottom-2.5 right-3 text-sm text-slate-400">円</span></div></label>
            <label className="text-sm font-medium text-slate-700">カテゴリ<span className="ml-1 text-red-500">*</span><select name="categoryId" required className={inputClass} value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.target.value)}><option value="" disabled>選択してください</option>{masterData.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">サブカテゴリ<span className="ml-1 text-red-500">*</span><select key={selectedCategoryId} name="subcategoryId" required className={inputClass} defaultValue={expense && String(expense.categoryId) === selectedCategoryId ? String(expense.subcategoryId) : ''} disabled={!selectedCategory}><option value="" disabled>選択してください</option>{selectedCategory?.subcategories.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">支払い方法<span className="ml-1 text-red-500">*</span><select name="paymentMethodId" required className={inputClass} defaultValue={expense?.paymentMethodId ?? ''}><option value="" disabled>選択してください</option>{masterData.paymentMethods.map((paymentMethod) => <option key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">店舗・サービス名<input name="merchant" defaultValue={expense?.merchant ?? ''} className={inputClass} placeholder="例：〇〇スーパー" /></label>
          </div>
          <fieldset><legend className="mb-2 text-sm font-medium text-slate-700">固定費 / 変動費<span className="ml-1 text-red-500">*</span></legend><div className="flex gap-3">{[{ label: '固定費', value: 'fixed' }, { label: '変動費', value: 'variable' }].map((item) => <label key={item.value} className="flex-1 cursor-pointer rounded-lg border border-slate-200 p-3 text-center text-sm text-slate-600 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700"><input className="sr-only" type="radio" name="costType" value={item.value} defaultChecked={item.value === (expense?.costType ?? 'variable')} />{item.label}</label>)}</div></fieldset>
          <fieldset><legend className="mb-2 text-sm font-medium text-slate-700">支出区分<span className="ml-1 text-red-500">*</span></legend><div className="grid grid-cols-3 gap-3">{[{ label: '必要支出', value: 'necessary' }, { label: '浪費', value: 'waste' }, { label: '投資', value: 'investment' }].map((item) => <label key={item.value} className="cursor-pointer rounded-lg border border-slate-200 p-3 text-center text-sm text-slate-600 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700"><input className="sr-only" type="radio" name="spendingType" value={item.value} defaultChecked={item.value === (expense?.spendingType ?? 'necessary')} />{item.label}</label>)}</div></fieldset>
          <label className="block text-sm font-medium text-slate-700">メモ<textarea name="memo" rows={3} defaultValue={expense?.memo ?? ''} className={inputClass} placeholder="任意のメモを入力" /></label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type={editing ? 'button' : 'reset'} onClick={() => { if (editing) navigate('/expenses'); else { setSelectedCategoryId(''); setStatus(null) } }} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600">{editing ? 'キャンセル' : 'クリア'}</button><button disabled={submitting} type="submit" className="rounded-lg bg-brand-600 px-7 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? '保存中…' : editing ? '変更を保存' : '保存する'}</button></div>
        </form>
        }
      </Card>
    </div>
  )
}
