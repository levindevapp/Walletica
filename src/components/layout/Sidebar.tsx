import { BarChart3, CalendarRange, LayoutDashboard, List, PlusCircle, Settings, Tags, WalletCards, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'ダッシュボード', icon: LayoutDashboard, end: true },
  { to: '/expenses/new', label: '支出入力', icon: PlusCircle },
  { to: '/expenses', label: '支出一覧', icon: List },
  { to: '/analysis/monthly', label: '月次分析', icon: BarChart3 },
  { to: '/analysis/yearly', label: '年次分析', icon: CalendarRange },
  { to: '/categories', label: 'カテゴリ管理', icon: Tags },
  { to: '/settings', label: '設定', icon: Settings },
]

type SidebarProps = { open: boolean; onClose: () => void }

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && <button type="button" aria-label="メニューを閉じる" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-gradient-to-b from-brand-700 to-brand-900 text-white shadow-xl transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2 text-lg font-bold"><WalletCards size={23} /> Walletica</div>
          <button type="button" onClick={onClose} className="p-1 lg:hidden" aria-label="メニューを閉じる"><X size={20} /></button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? 'bg-white/16 font-semibold text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 px-5 py-4 text-xs text-white/55">Personal expense analytics</div>
      </aside>
    </>
  )
}
