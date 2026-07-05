import { asc } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db/client.js'
import { categories, paymentMethods, subcategories } from '../db/schema.js'

export const masterDataApi = new Hono().get('/', (c) => {
  const categoryRows = db.select().from(categories).orderBy(asc(categories.sortOrder)).all()
  const subcategoryRows = db.select().from(subcategories).orderBy(asc(subcategories.sortOrder)).all()
  const paymentMethodRows = db.select().from(paymentMethods).orderBy(asc(paymentMethods.sortOrder)).all()

  return c.json({
    categories: categoryRows.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      subcategories: subcategoryRows
        .filter((subcategory) => subcategory.categoryId === category.id)
        .map((subcategory) => ({ id: subcategory.id, name: subcategory.name })),
    })),
    paymentMethods: paymentMethodRows.map((paymentMethod) => ({ id: paymentMethod.id, name: paymentMethod.name })),
  })
})
