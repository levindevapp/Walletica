import type { ExpenseResponse } from '../../types/api'
import type { Expense } from '../../types/expense'

const costTypeMap = { fixed: '固定費', variable: '変動費' } as const
const spendingTypeMap = { necessary: '必要支出', waste: '浪費', investment: '投資' } as const

export function toExpense(item: ExpenseResponse): Expense {
  return {
    id: item.id,
    date: item.spentOn,
    description: item.merchant ?? item.memo ?? '名称未設定',
    category: item.category,
    subcategory: item.subcategory,
    amount: item.amount,
    paymentMethod: item.paymentMethod,
    costType: costTypeMap[item.costType],
    kind: spendingTypeMap[item.spendingType],
  }
}
