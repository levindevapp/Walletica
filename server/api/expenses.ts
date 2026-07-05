import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db/client.js'
import { expenses } from '../db/schema.js'

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
const isPositiveInteger = (value: unknown): value is number => Number.isInteger(value) && Number(value) > 0
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
  .get('/', (c) => c.json(db.select().from(expenses).orderBy(desc(expenses.spentOn)).all()))
  .post('/', async (c) => {
    const body = parseExpenseBody(await c.req.json<unknown>())
    if (!body) return c.json({ message: '入力内容が正しくありません。' }, 400)
    const created = db.insert(expenses).values(body).returning().get()
    return c.json(created, 201)
  })
  .delete('/:id', (c) => {
    const id = Number(c.req.param('id'))
    if (!Number.isInteger(id) || id <= 0) return c.json({ message: 'IDが正しくありません。' }, 400)
    const deleted = db.delete(expenses).where(eq(expenses.id, id)).returning().get()
    if (!deleted) return c.json({ message: '支出が見つかりません。' }, 404)
    return c.json({ id: deleted.id })
  })
