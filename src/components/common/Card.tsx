import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}

export function Card({ children, className = '', title, action }: CardProps) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          {title && <h2 className="text-sm font-semibold text-slate-800">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}
