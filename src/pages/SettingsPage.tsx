import { Bell, ChevronRight, CircleHelp, Database, Palette, WalletCards } from 'lucide-react'
import { Card } from '../components/common/Card'
import { PageHeader } from '../components/common/PageHeader'

const sections = [
  { icon: WalletCards, title: '基本設定', description: '通貨・月の開始日を設定します' },
  { icon: Bell, title: '通知設定', description: '予算超過などの通知を設定します' },
  { icon: Database, title: 'データ管理', description: 'バックアップ・インポート・エクスポート' },
  { icon: Palette, title: '表示設定', description: 'テーマや表示形式を変更します' },
  { icon: CircleHelp, title: 'アプリについて', description: 'バージョン・利用規約・プライバシー' },
]

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="設定" description="アプリの基本設定とデータを管理します" />
      <Card><div className="divide-y divide-slate-100">{sections.map(({ icon: Icon, title, description }) => <button type="button" key={title} className="flex w-full items-center gap-4 px-5 py-5 text-left hover:bg-slate-50"><span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon size={19} /></span><span className="flex-1"><span className="block text-sm font-semibold text-slate-800">{title}</span><span className="mt-0.5 block text-xs text-slate-500">{description}</span></span><ChevronRight size={17} className="text-slate-400" /></button>)}</div></Card>
    </div>
  )
}
