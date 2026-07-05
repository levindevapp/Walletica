import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dailySpending, formatCurrency } from '../expenses/data'

export function SpendingBarChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailySpending} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eeeb" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#7a8880' }} interval={4} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#7a8880' }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number | string | undefined) => formatCurrency(Number(value ?? 0))} />
          <Bar dataKey="amount" name="支出" fill="#219667" radius={[3, 3, 0, 0]} maxBarSize={13} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
