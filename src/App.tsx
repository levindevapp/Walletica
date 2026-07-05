import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { CategoriesPage } from './pages/CategoriesPage'
import { DashboardPage } from './pages/DashboardPage'
import { ExpenseFormPage } from './pages/ExpenseFormPage'
import { ExpensesPage } from './pages/ExpensesPage'
import { MonthlyAnalysisPage } from './pages/MonthlyAnalysisPage'
import { SettingsPage } from './pages/SettingsPage'
import { YearlyAnalysisPage } from './pages/YearlyAnalysisPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="expenses/new" element={<ExpenseFormPage />} />
          <Route path="expenses/:id/edit" element={<ExpenseFormPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="analysis/monthly" element={<MonthlyAnalysisPage />} />
          <Route path="analysis/yearly" element={<YearlyAnalysisPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
