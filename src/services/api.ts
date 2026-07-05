import type { CreateExpenseRequest, DashboardResponse, ExpenseDetailResponse, ExpenseResponse, MasterDataResponse, MonthlyAnalysisResponse, YearlyAnalysisResponse } from '../types/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new Error('APIサーバーからJSONを取得できませんでした。開発サーバーを再起動してください。')
  }
  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null)
    const message = typeof errorBody === 'object' && errorBody !== null && 'message' in errorBody && typeof errorBody.message === 'string'
      ? errorBody.message
      : '通信に失敗しました。'
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

export const expenseApi = {
  getMasterData: (): Promise<MasterDataResponse> => request('/api/master-data'),
  getExpenses: (): Promise<ExpenseResponse[]> => request('/api/expenses'),
  getExpense: (id: number): Promise<ExpenseDetailResponse> => request(`/api/expenses/${id}`),
  createExpense: (body: CreateExpenseRequest): Promise<ExpenseDetailResponse> => request('/api/expenses', { method: 'POST', body: JSON.stringify(body) }),
  updateExpense: (id: number, body: CreateExpenseRequest): Promise<ExpenseDetailResponse> => request(`/api/expenses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteExpense: (id: number): Promise<{ id: number }> => request(`/api/expenses/${id}`, { method: 'DELETE' }),
  getDashboard: (month: string, date: string): Promise<DashboardResponse> => request(`/api/dashboard?month=${encodeURIComponent(month)}&date=${encodeURIComponent(date)}`),
  getMonthlyAnalysis: (month: string): Promise<MonthlyAnalysisResponse> => request(`/api/analysis/monthly?month=${encodeURIComponent(month)}`),
  getYearlyAnalysis: (year: string): Promise<YearlyAnalysisResponse> => request(`/api/analysis/yearly?year=${encodeURIComponent(year)}`),
}
