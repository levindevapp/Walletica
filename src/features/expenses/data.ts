import type { CategorySummary, Expense } from '../../types/expense'

export const categories: CategorySummary[] = [
  { name: '食費', amount: 35120, color: '#f26461', budget: 40000 },
  { name: '住居費', amount: 31000, color: '#f79538', budget: 35000 },
  { name: '交通費', amount: 15130, color: '#f6bd45', budget: 18000 },
  { name: '娯楽費', amount: 12550, color: '#57b58a', budget: 15000 },
  { name: '日用品', amount: 10200, color: '#668bd1', budget: 12000 },
  { name: 'その他', amount: 21030, color: '#9d92c7', budget: 30000 },
]

export const expenses: Expense[] = [
  { id: 1, date: '2026-07-05', description: 'ランチ（カフェ）', category: '食費', subcategory: '外食', amount: 1200, paymentMethod: 'クレジットカード', costType: '変動費', kind: '必要支出' },
  { id: 2, date: '2026-07-04', description: 'Amazon', category: '日用品', subcategory: '生活用品', amount: 2980, paymentMethod: 'クレジットカード', costType: '変動費', kind: '必要支出' },
  { id: 3, date: '2026-07-04', description: '電車代', category: '交通費', subcategory: '電車', amount: 580, paymentMethod: 'ICカード', costType: '変動費', kind: '必要支出' },
  { id: 4, date: '2026-07-03', description: '映画鑑賞', category: '娯楽費', subcategory: '映画', amount: 1800, paymentMethod: 'クレジットカード', costType: '変動費', kind: '浪費' },
  { id: 5, date: '2026-07-02', description: 'スーパー', category: '食費', subcategory: 'スーパー', amount: 3450, paymentMethod: 'クレジットカード', costType: '変動費', kind: '必要支出' },
  { id: 6, date: '2026-07-01', description: '家賃', category: '住居費', subcategory: '家賃', amount: 31000, paymentMethod: '銀行振込', costType: '固定費', kind: '必要支出' },
]

export const dailySpending = [
  3400, 8900, 2100, 4800, 1900, 9200, 2800, 7100, 2200, 4100,
  5400, 5600, 4800, 2700, 4200, 12800, 8900, 2200, 1800, 4000,
  5500, 9200, 2100, 5700, 3500, 1800, 5400, 3900, 0, 0, 0,
].map((amount, index) => ({ day: `${index + 1}日`, amount }))

export const monthlySpending = [
  98200, 108400, 92400, 112300, 124970, 119800,
  128500, 121400, 133200, 126800, 137500, 125030,
].map((amount, index) => ({ month: `${index + 1}月`, amount }))

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount)
