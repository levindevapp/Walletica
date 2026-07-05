import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db/client.js'
import { categories, expenses, paymentMethods, subcategories } from '../db/schema.js'

type CreateExpenseBody = {
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

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const isPositiveInteger = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0
const isNullableString = (value: unknown): value is string | null => value === null || typeof value === 'string'

function parseExpenseBody(value: unknown): CreateExpenseBody | null {
  if (!isRecord(value) || typeof value.spentOn !== 'string' || typeof value.amount !== 'number' || value.amount <= 0) return null
  if (!isPositiveInteger(value.categoryId) || !isPositiveInteger(value.subcategoryId) || !isPositiveInteger(value.paymentMethodId)) return null
  if (!isNullableString(value.merchant) || !isNullableString(value.memo)) return null
  if (value.costType !== 'fixed' && value.costType !== 'variable') return null
  if (value.spendingType !== 'necessary' && value.spendingType !== 'waste' && value.spendingType !== 'investment') return null
  return {
    spentOn: value.spentOn,
    amount: value.amount,
    categoryId: value.categoryId,
    subcategoryId: value.subcategoryId,
    paymentMethodId: value.paymentMethodId,
    merchant: value.merchant,
    memo: value.memo,
    costType: value.costType,
    spendingType: value.spendingType,
  }
}

export const expensesApi = new Hono()
  .get('/', (c) => {
    const rows = db.select({
      id: expenses.id,
      spentOn: expenses.spentOn,
      amount: expenses.amount,
      merchant: expenses.merchant,
      memo: expenses.memo,
      costType: expenses.costType,
      spendingType: expenses.spendingType,
      category: categories.name,
      subcategory: subcategories.name,
      paymentMethod: paymentMethods.name,
    }).from(expenses)
      .innerJoin(categories, eq(expenses.categoryId, categories.id))
      .innerJoin(subcategories, eq(expenses.subcategoryId, subcategories.id))
      .innerJoin(paymentMethods, eq(expenses.paymentMethodId, paymentMethods.id))
      .orderBy(desc(expenses.spentOn), desc(expenses.id))
      .all()

    return c.json(rows)
  })
  .get('/:id', (c) => {
    const id = Number(c.req.param('id'))
    if (!Number.isInteger(id) || id <= 0) return c.json({ message: 'IDが正しくありません。' }, 400)
    const expense = db.select().from(expenses).where(eq(expenses.id, id)).get()
    if (!expense) return c.json({ message: '支出が見つかりません。' }, 404)
    return c.json(expense)
  })
  .post('/', async (c) => {
    const body = parseExpenseBody(await c.req.json<unknown>())
    if (!body) return c.json({ message: '入力内容が正しくありません。' }, 400)
    const created = db.insert(expenses).values(body).returning().get()
    return c.json(created, 201)
  })
  .put('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    if (!Number.isInteger(id) || id <= 0) return c.json({ message: 'IDが正しくありません。' }, 400)
    const body = parseExpenseBody(await c.req.json<unknown>())
    if (!body) return c.json({ message: '入力内容が正しくありません。' }, 400)
    const updated = db.update(expenses).set({ ...body, updatedAt: new Date().toISOString() }).where(eq(expenses.id, id)).returning().get()
    if (!updated) return c.json({ message: '支出が見つかりません。' }, 404)
    return c.json(updated)
  })
  .delete('/:id', (c) => {
    const id = Number(c.req.param('id'))
    if (!Number.isInteger(id) || id <= 0) return c.json({ message: 'IDが正しくありません。' }, 400)
    const deleted = db.delete(expenses).where(eq(expenses.id, id)).returning().get()
    if (!deleted) return c.json({ message: '支出が見つかりません。' }, 404)
    return c.json({ id: deleted.id })
  })
