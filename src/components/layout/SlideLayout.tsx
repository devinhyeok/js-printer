import type { ReactNode } from 'react'
import { House } from 'lucide-react'

interface SlideLayoutProps {
  children: ReactNode
}

export function SlideLayout({ children }: SlideLayoutProps) {
  return (
    <>
      <style>{`@page { size: 254mm 143mm; margin: 0; }`}</style>
      <button
        className="print-button fixed top-4 right-4 z-50 rounded-full bg-white p-2.5 shadow-md border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 active:scale-95 transition-all"
        onClick={() => window.history.back()}
        title="홈으로"
      >
        <House size={18} />
      </button>
      <button
        className="print-button fixed bottom-6 right-6 z-50 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        onClick={() => window.print()}
      >
        PDF 저장
      </button>
      <div className="slide-wrapper">{children}</div>
    </>
  )
}
