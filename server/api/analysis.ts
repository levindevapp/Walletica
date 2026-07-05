import { Hono } from 'hono'
import { getMonthlyAnalysis, getYearlyAnalysis } from '../services/analysis-service.js'

const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/
const yearPattern = /^\d{4}$/

export const analysisApi = new Hono()
  .get('/monthly', (c) => {
    const month = c.req.query('month')
    if (!month || !monthPattern.test(month)) return c.json({ message: '対象月が正しくありません。' }, 400)
    return c.json(getMonthlyAnalysis(month))
  })
  .get('/yearly', (c) => {
    const year = c.req.query('year')
    if (!year || !yearPattern.test(year)) return c.json({ message: '対象年が正しくありません。' }, 400)
    return c.json(getYearlyAnalysis(year))
  })
