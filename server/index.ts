import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { expensesApi } from './api/expenses.js'

const app = new Hono()
app.use('/api/*', cors({ origin: 'http://localhost:5173' }))
app.get('/api/health', (c) => c.json({ status: 'ok' }))
app.route('/api/expenses', expensesApi)

serve({ fetch: app.fetch, port: 3000 })
