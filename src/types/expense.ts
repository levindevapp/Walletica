export type ExpenseKind = '必要支出' | '浪費' | '投資'
export type CostType = '固定費' | '変動費'

export type Expense = {
  id: number
  date: string
  description: string
  category: string
  subcategory: string
  amount: number
  paymentMethod: string
  costType: CostType
  kind: ExpenseKind
}

export type CategorySummary = {
  name: string
  amount: number
  color: string
  budget: number
}
