import { useState, type FormEvent } from 'react'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'

const inputClass = 'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export function ExpenseFormPage() {
  const [saved, setSaved] = useState(false)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaved(true) }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="支出入力" description="日々の支出を記録します" />
      <Card className="p-5 sm:p-7">
        {saved && <div role="status" className="mb-5 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">支出を保存しました。</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">日付<span className="ml-1 text-red-500">*</span><input required type="date" defaultValue="2026-07-05" className={inputClass} /></label>
            <label className="text-sm font-medium text-slate-700">金額<span className="ml-1 text-red-500">*</span><div className="relative"><input required min="1" type="number" placeholder="0" className={`${inputClass} pr-9`} /><span className="absolute bottom-2.5 right-3 text-sm text-slate-400">円</span></div></label>
            <label className="text-sm font-medium text-slate-700">カテゴリ<span className="ml-1 text-red-500">*</span><select required className={inputClass} defaultValue=""><option value="" disabled>選択してください</option><option>食費</option><option>住居費</option><option>交通費</option><option>娯楽費</option><option>日用品</option></select></label>
            <label className="text-sm font-medium text-slate-700">サブカテゴリ<span className="ml-1 text-red-500">*</span><select required className={inputClass} defaultValue=""><option value="" disabled>選択してください</option><option>スーパー</option><option>コンビニ</option><option>外食</option><option>カフェ</option></select></label>
            <label className="text-sm font-medium text-slate-700">支払い方法<span className="ml-1 text-red-500">*</span><select required className={inputClass}><option>クレジットカード</option><option>現金</option><option>ICカード</option><option>銀行振込</option></select></label>
            <label className="text-sm font-medium text-slate-700">店舗・サービス名<input className={inputClass} placeholder="例：〇〇スーパー" /></label>
          </div>
          <fieldset><legend className="mb-2 text-sm font-medium text-slate-700">固定費 / 変動費<span className="ml-1 text-red-500">*</span></legend><div className="flex gap-3">{['固定費', '変動費'].map((value) => <label key={value} className="flex-1 cursor-pointer rounded-lg border border-slate-200 p-3 text-center text-sm text-slate-600 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700"><input className="sr-only" type="radio" name="costType" value={value} defaultChecked={value === '変動費'} />{value}</label>)}</div></fieldset>
          <fieldset><legend className="mb-2 text-sm font-medium text-slate-700">支出区分<span className="ml-1 text-red-500">*</span></legend><div className="grid grid-cols-3 gap-3">{['必要支出', '浪費', '投資'].map((value) => <label key={value} className="cursor-pointer rounded-lg border border-slate-200 p-3 text-center text-sm text-slate-600 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700"><input className="sr-only" type="radio" name="kind" value={value} defaultChecked={value === '必要支出'} />{value}</label>)}</div></fieldset>
          <label className="block text-sm font-medium text-slate-700">メモ<textarea rows={3} className={inputClass} placeholder="任意のメモを入力" /></label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="reset" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600">クリア</button><button type="submit" className="rounded-lg bg-brand-600 px-7 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">保存する</button></div>
        </form>
      </Card>
    </div>
  )
}
