import { Hono } from 'hono'
import { expensesApi } from './api/expenses.js'
import { masterDataApi } from './api/master-data.js'
import { analysisApi } from './api/analysis.js'
import { dashboardApi } from './api/dashboard.js'

export const app = new Hono()
app.get('/api/health', (c) => c.json({ status: 'ok' }))
app.route('/api/expenses', expensesApi)
app.route('/api/master-data', masterDataApi)
app.route('/api/analysis', analysisApi)
app.route('/api/dashboard', dashboardApi)
app.notFound((c) => c.req.path.startsWith('/api/')
  ? c.json({ message: 'APIが見つかりません。' }, 404)
  : c.text('Not Found', 404))
