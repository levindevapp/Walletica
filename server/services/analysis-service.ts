import { and, eq, gte, lt } from 'drizzle-orm'
import { db } from '../db/client.js'
import { budgets, categories, expenses } from '../db/schema.js'

type CategoryAggregate = { name: string; color: string; amount: number; budget: number }
type DailyAggregate = { day: string; amount: number }
type MonthlyAggregate = {
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

function monthBounds(month: string): { start: string; end: string } {
  const [year, monthNumber] = month.split('-').map(Number)
  const start = `${year}-${String(monthNumber).padStart(2, '0')}-01`
  const next = new Date(Date.UTC(year, monthNumber, 1))
  const end = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}-01`
  return { start, end }
}

function previousMonth(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number)
  const date = new Date(Date.UTC(year, monthNumber - 2, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

function sumAmounts(rows: { amount: number }[]): number {
  return rows.reduce((sum, row) => sum + row.amount, 0)
}

export function getMonthlyAnalysis(month: string): MonthlyAggregate {
  const { start, end } = monthBounds(month)
  const previousBounds = monthBounds(previousMonth(month))
  const rows = db.select().from(expenses).where(and(gte(expenses.spentOn, start), lt(expenses.spentOn, end))).all()
  const previousRows = db.select({ amount: expenses.amount }).from(expenses).where(and(gte(expenses.spentOn, previousBounds.start), lt(expenses.spentOn, previousBounds.end))).all()
  const categoryRows = db.select().from(categories).all()
  const budgetRows = db.select().from(budgets).where(eq(budgets.yearMonth, month)).all()
  const total = sumAmounts(rows)
  const previousTotal = sumAmounts(previousRows)
  const dayCount = new Date(`${end}T00:00:00Z`).getUTCDate() === 1
    ? Math.round((new Date(`${end}T00:00:00Z`).getTime() - new Date(`${start}T00:00:00Z`).getTime()) / 86400000)
    : 1
  const budget = budgetRows.filter((item) => item.categoryId === null).reduce((sum, item) => sum + item.amount, 0)

  return {
    month,
    total,
    previousTotal,
    difference: total - previousTotal,
    dailyAverage: dayCount > 0 ? Math.round(total / dayCount) : 0,
    budget,
    remainingBudget: budget - total,
    daily: Array.from({ length: dayCount }, (_, index) => {
      const dayNumber = index + 1
      const date = `${month}-${String(dayNumber).padStart(2, '0')}`
      return { day: `${dayNumber}日`, amount: sumAmounts(rows.filter((row) => row.spentOn === date)) }
    }),
    categories: categoryRows.map((category) => ({
      name: category.name,
      color: category.color,
      amount: sumAmounts(rows.filter((row) => row.categoryId === category.id)),
      budget: budgetRows.filter((item) => item.categoryId === category.id).reduce((sum, item) => sum + item.amount, 0),
    })).filter((category) => category.amount > 0 || category.budget > 0),
  }
}

export function getYearlyAnalysis(year: string) {
  const rows = db.select().from(expenses).where(and(gte(expenses.spentOn, `${year}-01-01`), lt(expenses.spentOn, `${Number(year) + 1}-01-01`))).all()
  const categoryRows = db.select().from(categories).all()
  const monthly = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = String(index + 1).padStart(2, '0')
    return { month: `${index + 1}月`, amount: sumAmounts(rows.filter((row) => row.spentOn.startsWith(`${year}-${monthNumber}`))) }
  })
  const total = sumAmounts(rows)
  const nonEmptyMonths = monthly.filter((item) => item.amount > 0)
  const maxMonth = nonEmptyMonths.reduce((max, item) => item.amount > max.amount ? item : max, { month: '-', amount: 0 })
  const minMonth = nonEmptyMonths.reduce((min, item) => item.amount < min.amount ? item : min, nonEmptyMonths[0] ?? { month: '-', amount: 0 })

  return {
    year,
    total,
    monthlyAverage: Math.round(total / 12),
    maxMonth,
    minMonth,
    monthly,
    categories: categoryRows.map((category) => ({
      name: category.name,
      color: category.color,
      amount: sumAmounts(rows.filter((row) => row.categoryId === category.id)),
    })).filter((category) => category.amount > 0).sort((a, b) => b.amount - a.amount),
  }
}
