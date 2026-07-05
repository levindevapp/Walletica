import { and, desc, eq, gte, lt } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db/client.js'
import { categories, expenses, paymentMethods, subcategories } from '../db/schema.js'
import { getMonthlyAnalysis } from '../services/analysis-service.js'

export const dashboardApi = new Hono().get('/', (c) => {
  const month = c.req.query('month')
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return c.json({ message: '対象月が正しくありません。' }, 400)
  const requestedDate = c.req.query('date')
  const today = requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? requestedDate : new Date().toISOString().slice(0, 10)
  const analysis = getMonthlyAnalysis(month)
  const monthEnd = `${month}-32`
  const todayTotal = db.select({ amount: expenses.amount }).from(expenses).where(eq(expenses.spentOn, today)).all().reduce((sum, item) => sum + item.amount, 0)
  const recent = db.select({
    id: expenses.id, spentOn: expenses.spentOn, amount: expenses.amount, merchant: expenses.merchant, memo: expenses.memo,
    costType: expenses.costType, spendingType: expenses.spendingType, category: categories.name, subcategory: subcategories.name, paymentMethod: paymentMethods.name,
  }).from(expenses)
    .innerJoin(categories, eq(expenses.categoryId, categories.id))
    .innerJoin(subcategories, eq(expenses.subcategoryId, subcategories.id))
    .innerJoin(paymentMethods, eq(expenses.paymentMethodId, paymentMethods.id))
    .where(and(gte(expenses.spentOn, `${month}-01`), lt(expenses.spentOn, monthEnd)))
    .orderBy(desc(expenses.spentOn), desc(expenses.id)).limit(5).all()

  return c.json({ ...analysis, todayTotal, recent })
})
