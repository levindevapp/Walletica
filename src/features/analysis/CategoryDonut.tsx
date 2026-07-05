import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { categories, formatCurrency } from '../expenses/data'

type CategoryDonutProps = { compact?: boolean }

export function CategoryDonut({ compact = false }: CategoryDonutProps) {
  const total = categories.reduce((sum, category) => sum + category.amount, 0)

  return (
    <div className={`grid items-center gap-4 ${compact ? 'md:grid-cols-[180px_1fr]' : 'md:grid-cols-[220px_1fr]'}`}>
      <div className={compact ? 'h-44' : 'h-52'}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={categories} dataKey="amount" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={1}>
              {categories.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(value: number | string | undefined) => formatCurrency(Number(value ?? 0))} />
            <text x="50%" y="46%" textAnchor="middle" className="fill-slate-400 text-[11px]">支出合計</text>
            <text x="50%" y="58%" textAnchor="middle" className="fill-slate-800 text-sm font-bold">{formatCurrency(total)}</text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.name} className="grid grid-cols-[10px_1fr_auto_auto] items-center gap-2 text-xs">
            <span className="size-2 rounded-full" style={{ backgroundColor: category.color }} />
            <span className="text-slate-600">{category.name}</span>
            <span className="text-slate-400">{Math.round(category.amount / total * 100)}%</span>
            <span className="min-w-17 text-right font-medium text-slate-700">{formatCurrency(category.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
