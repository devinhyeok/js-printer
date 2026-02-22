import type { ReactNode } from 'react'
import { FloatingNav } from '../ui/FloatingNav'
import { BookSwitcher } from '../ui/BookSwitcher'

interface DocLayoutProps {
  children: ReactNode
}

export function DocLayout({ children }: DocLayoutProps) {
  return (
    <>
      <style>{`@page { size: A4; margin: 20mm; }`}</style>
      <BookSwitcher />
      <button
        className="print-button fixed bottom-6 right-6 z-50 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        onClick={() => window.print()}
      >
        PDF 저장
      </button>
      <FloatingNav />
      <div className="doc-wrapper">{children}</div>
    </>
  )
}
