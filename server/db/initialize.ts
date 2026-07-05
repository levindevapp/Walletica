import { count, eq } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { db } from './client.js'
import { budgets, categories, expenses, paymentMethods, subcategories } from './schema.js'

const categorySeeds = [
  { name: '食費', color: '#f26461', subcategories: ['スーパー', 'コンビニ', '外食', 'カフェ', 'お菓子'] },
  { name: '住居費', color: '#f79538', subcategories: ['家賃', '修繕費'] },
  { name: '交通費', color: '#f6bd45', subcategories: ['電車', 'バス', 'タクシー', 'ガソリン', '高速道路'] },
  { name: '娯楽費', color: '#57b58a', subcategories: ['映画', 'ゲーム', '漫画', '書籍'] },
  { name: '日用品', color: '#668bd1', subcategories: ['生活用品', '消耗品'] },
  { name: '医療', color: '#d37c95', subcategories: ['診察', '薬'] },
  { name: 'その他', color: '#9d92c7', subcategories: ['その他'] },
] as const

const paymentMethodSeeds = ['現金', 'クレジットカード', 'ICカード', '銀行振込'] as const

function seedMasterData(): void {
  categorySeeds.forEach((category, categoryIndex) => {
    db.insert(categories).values({ name: category.name, color: category.color, sortOrder: categoryIndex }).onConflictDoNothing().run()
    const storedCategory = db.select({ id: categories.id }).from(categories).where(eq(categories.name, category.name)).get()
    if (!storedCategory) return
    category.subcategories.forEach((name, subcategoryIndex) => {
      db.insert(subcategories).values({ categoryId: storedCategory.id, name, sortOrder: subcategoryIndex }).onConflictDoNothing().run()
    })
  })

  paymentMethodSeeds.forEach((name, sortOrder) => {
    db.insert(paymentMethods).values({ name, sortOrder }).onConflictDoNothing().run()
  })
}

function seedExpenses(): void {
  const [{ value }] = db.select({ value: count() }).from(expenses).all()
  if (value > 0) return

  const categoryRows = db.select().from(categories).all()
  const subcategoryRows = db.select().from(subcategories).all()
  const paymentRows = db.select().from(paymentMethods).all()
  const categoryId = (name: string): number => categoryRows.find((item) => item.name === name)?.id ?? 0
  const subcategoryId = (name: string): number => subcategoryRows.find((item) => item.name === name)?.id ?? 0
  const paymentMethodId = (name: string): number => paymentRows.find((item) => item.name === name)?.id ?? 0

  db.insert(expenses).values([
    { spentOn: '2026-07-05', amount: 1200, categoryId: categoryId('食費'), subcategoryId: subcategoryId('外食'), paymentMethodId: paymentMethodId('クレジットカード'), merchant: 'ランチ（カフェ）', memo: null, costType: 'variable', spendingType: 'necessary' },
    { spentOn: '2026-07-04', amount: 2980, categoryId: categoryId('日用品'), subcategoryId: subcategoryId('生活用品'), paymentMethodId: paymentMethodId('クレジットカード'), merchant: 'Amazon', memo: null, costType: 'variable', spendingType: 'necessary' },
    { spentOn: '2026-07-04', amount: 580, categoryId: categoryId('交通費'), subcategoryId: subcategoryId('電車'), paymentMethodId: paymentMethodId('ICカード'), merchant: '電車代', memo: null, costType: 'variable', spendingType: 'necessary' },
    { spentOn: '2026-07-03', amount: 1800, categoryId: categoryId('娯楽費'), subcategoryId: subcategoryId('映画'), paymentMethodId: paymentMethodId('クレジットカード'), merchant: '映画鑑賞', memo: null, costType: 'variable', spendingType: 'waste' },
    { spentOn: '2026-07-02', amount: 3450, categoryId: categoryId('食費'), subcategoryId: subcategoryId('スーパー'), paymentMethodId: paymentMethodId('クレジットカード'), merchant: 'スーパー', memo: null, costType: 'variable', spendingType: 'necessary' },
    { spentOn: '2026-07-01', amount: 31000, categoryId: categoryId('住居費'), subcategoryId: subcategoryId('家賃'), paymentMethodId: paymentMethodId('銀行振込'), merchant: '家賃', memo: null, costType: 'fixed', spendingType: 'necessary' },
  ]).run()

}

function seedBudgets(): void {
  const categoryRows = db.select().from(categories).all()
  const existingBudgets = db.select().from(budgets).where(eq(budgets.yearMonth, '2026-07')).all()
  if (!existingBudgets.some((budget) => budget.categoryId === null && budget.subcategoryId === null)) {
    db.insert(budgets).values({ yearMonth: '2026-07', categoryId: null, subcategoryId: null, amount: 150000 }).run()
  }
  const categoryBudgets = [
    ['食費', 40000], ['住居費', 35000], ['交通費', 18000], ['娯楽費', 15000],
    ['日用品', 12000], ['医療', 10000], ['その他', 20000],
  ] as const
  categoryBudgets.forEach(([name, amount]) => {
    const categoryId = categoryRows.find((category) => category.name === name)?.id
    if (!categoryId || existingBudgets.some((budget) => budget.categoryId === categoryId && budget.subcategoryId === null)) return
    db.insert(budgets).values({ yearMonth: '2026-07', categoryId, subcategoryId: null, amount }).run()
  })
}

let initialized = false

export function initializeDatabase(): void {
  if (initialized) return
  migrate(db, { migrationsFolder: './drizzle' })
  seedMasterData()
  seedExpenses()
  seedBudgets()
  initialized = true
}
