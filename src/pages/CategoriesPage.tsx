import { ChevronRight, Plus, Tags } from 'lucide-react'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'
import { categories } from '../features/expenses/data'

const subcategories: Record<string, string[]> = {
  食費: ['スーパー', 'コンビニ', '外食', 'カフェ', 'お菓子'],
  住居費: ['家賃', '修繕費'],
  交通費: ['電車', 'バス', 'タクシー', 'ガソリン'],
  娯楽費: ['映画', 'ゲーム', '書籍'],
  日用品: ['生活用品', '消耗品'],
  その他: ['その他'],
}

export function CategoriesPage() {
  return (
    <>
      <PageHeader title="カテゴリ管理" description="支出カテゴリとサブカテゴリを管理します"><button type="button" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} />カテゴリを追加</button></PageHeader>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card title="支出カテゴリ"><div className="divide-y divide-slate-100">{categories.map((category, index) => <button type="button" key={category.name} className={`flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 ${index === 0 ? 'bg-brand-50/60' : ''}`}><span className="grid size-9 place-items-center rounded-lg" style={{ backgroundColor: `${category.color}1f`, color: category.color }}><Tags size={17} /></span><span className="flex-1"><span className="block text-sm font-medium text-slate-800">{category.name}</span><span className="text-xs text-slate-400">サブカテゴリ：{subcategories[category.name]?.length ?? 0}個</span></span><ChevronRight size={16} className="text-slate-400" /></button>)}</div></Card>
        <Card title="サブカテゴリ（食費）" action={<button type="button" className="flex items-center gap-1 text-xs font-medium text-brand-600"><Plus size={14} />追加</button>}><div className="grid gap-3 p-5 sm:grid-cols-2">{subcategories['食費'].map((item) => <div key={item} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"><span className="text-sm font-medium text-slate-700">{item}</span><button type="button" className="text-xs text-slate-400 hover:text-brand-600">編集</button></div>)}</div></Card>
      </div>
    </>
  )
}
