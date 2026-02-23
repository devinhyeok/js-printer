import { useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { BookSwitcher } from '../ui/BookSwitcher'
import { FloatingNav } from '../ui/FloatingNav'

interface ViewerShellProps {
  children: ReactNode
  type: 'doc' | 'slide'
}

export function ViewerShell({ children, type }: ViewerShellProps) {
  const isSlide = type === 'slide'
  const [showPageNum, setShowPageNum] = useState(true)

  const togglePageNum = useCallback(() => {
    setShowPageNum((prev) => {
      const next = !prev
      const targets = [
        document.body,
        document.querySelector('.doc-wrapper'),
      ]
      targets.forEach((el) => {
        if (!el) return
        if (next) {
          el.removeAttribute('data-hide-page-num')
        } else {
          el.setAttribute('data-hide-page-num', '')
        }
      })
      return next
    })
  }, [])

  return (
    <>
      <BookSwitcher />
      <FloatingNav />
      <div className="print-button fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          className={`rounded-full px-6 py-3 text-sm font-semibold shadow-lg active:scale-95 transition-all ${
            showPageNum
              ? 'bg-gray-400 text-white hover:bg-gray-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={togglePageNum}
        >
          {showPageNum ? '페이지 미표시' : '페이지 표시'}
        </button>
        <button
          className={`rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg active:scale-95 transition-all ${
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
      </div>
      {children}
    </>
  )
}
