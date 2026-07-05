import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from './data'
import type { Expense } from '../../types/expense'

type ExpenseTableProps = { items: Expense[]; editable?: boolean }

export function ExpenseTable({ items, editable = false }: ExpenseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-500">
          <tr><th className="px-5 py-3">日付</th><th className="px-4 py-3">内容</th><th className="px-4 py-3">カテゴリ</th><th className="px-4 py-3">金額</th><th className="px-4 py-3">支払方法</th>{editable && <th className="px-4 py-3 text-right">操作</th>}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((expense) => (
            <tr key={expense.id} className="text-slate-600 hover:bg-slate-50">
              <td className="whitespace-nowrap px-5 py-3">{expense.date.replaceAll('-', '/')}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{expense.description}</td>
              <td className="px-4 py-3"><span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700">{expense.category}</span></td>
              <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(expense.amount)}</td>
              <td className="px-4 py-3">{expense.paymentMethod}</td>
              {editable && <td className="px-4 py-3"><div className="flex justify-end gap-1"><button type="button" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600" aria-label="編集"><Pencil size={15} /></button><button type="button" className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label="削除"><Trash2 size={15} /></button></div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
