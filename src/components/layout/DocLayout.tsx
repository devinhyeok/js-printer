import type { ReactNode } from 'react'
import { House } from 'lucide-react'
import { FloatingNav } from '../ui/FloatingNav'

interface DocLayoutProps {
  children: ReactNode
}

export function DocLayout({ children }: DocLayoutProps) {
  return (
    <>
      <style>{`@page { size: A4; margin: 20mm; }`}</style>
      <button
        className="print-button fixed top-4 left-4 z-50 rounded-full bg-white p-2.5 shadow-md border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 active:scale-95 transition-all"
        onClick={() => window.history.back()}
        title="홈으로"
      >
        <House size={18} />
      </button>
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
