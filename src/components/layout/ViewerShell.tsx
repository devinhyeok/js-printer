import type { ReactNode } from 'react'
import { BookSwitcher } from '../ui/BookSwitcher'
import { FloatingNav } from '../ui/FloatingNav'

interface ViewerShellProps {
  children: ReactNode
  type: 'doc' | 'slide'
}

export function ViewerShell({ children, type }: ViewerShellProps) {
  const isSlide = type === 'slide'

  return (
    <>
      <BookSwitcher />
      <FloatingNav />
      <button
        className={`print-button fixed bottom-6 right-6 z-50 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg active:scale-95 transition-all ${
          isSlide
            ? 'bg-indigo-600 hover:bg-indigo-700'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={() =>
          isSlide
            ? window.print()
            : window.dispatchEvent(new Event('doc:print'))
        }
      >
        PDF 저장
      </button>
      {children}
    </>
  )
}
