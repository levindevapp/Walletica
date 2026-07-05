import { integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  color: text('color').notNull().default('#13915a'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex('categories_name_unique').on(table.name)])

export const subcategories = sqliteTable('subcategories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex('subcategories_category_name_unique').on(table.categoryId, table.name)])

export const paymentMethods = sqliteTable('payment_methods', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  spentOn: text('spent_on').notNull(),
  amount: real('amount').notNull(),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  subcategoryId: integer('subcategory_id').notNull().references(() => subcategories.id),
  paymentMethodId: integer('payment_method_id').notNull().references(() => paymentMethods.id),
  merchant: text('merchant'),
  memo: text('memo'),
  costType: text('cost_type', { enum: ['fixed', 'variable'] }).notNull(),
  spendingType: text('spending_type', { enum: ['necessary', 'waste', 'investment'] }).notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const budgets = sqliteTable('budgets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  yearMonth: text('year_month').notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  subcategoryId: integer('subcategory_id').references(() => subcategories.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})
