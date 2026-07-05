export type MasterDataOption = {
  id: number
  name: string
}

export type CategoryOption = MasterDataOption & {
  color: string
  subcategories: MasterDataOption[]
}

export type MasterDataResponse = {
  categories: CategoryOption[]
  paymentMethods: MasterDataOption[]
}

export type ExpenseResponse = {
  id: number
  spentOn: string
  amount: number
  merchant: string | null
  memo: string | null
  costType: 'fixed' | 'variable'
  spendingType: 'necessary' | 'waste' | 'investment'
  category: string
  subcategory: string
  paymentMethod: string
}

export type CreateExpenseRequest = {
  spentOn: string
  amount: number
  categoryId: number
  subcategoryId: number
  paymentMethodId: number
  merchant: string | null
  memo: string | null
  costType: 'fixed' | 'variable'
  spendingType: 'necessary' | 'waste' | 'investment'
}

export type ExpenseDetailResponse = CreateExpenseRequest & {
  id: number
  createdAt: string
  updatedAt: string
}

export type CategoryAggregate = {
  name: string
  color: string
  amount: number
  budget: number
}

export type DailyAggregate = { day: string; amount: number }

export type MonthlyAnalysisResponse = {
  month: string
  total: number
  previousTotal: number
  difference: number
  dailyAverage: number
  budget: number
  remainingBudget: number
  daily: DailyAggregate[]
  categories: CategoryAggregate[]
}

export type YearlyAnalysisResponse = {
  year: string
  total: number
  monthlyAverage: number
  maxMonth: { month: string; amount: number }
  minMonth: { month: string; amount: number }
  monthly: { month: string; amount: number }[]
  categories: Omit<CategoryAggregate, 'budget'>[]
}

export type DashboardResponse = MonthlyAnalysisResponse & {
  todayTotal: number
  recent: ExpenseResponse[]
}
