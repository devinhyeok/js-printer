import { useState, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import { useReactToPrint } from 'react-to-print'
import { BookSwitcher } from '../ui/BookSwitcher'
import { FloatingNav } from '../ui/FloatingNav'

interface ViewerShellProps {
  children: ReactNode
  type: 'doc' | 'slide'
}

const BASE_PRINT_CSS = `
  body {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 11pt;
    color: #1a1a1a;
    background: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .print-button {
    display: none !important;
  }
`

const DOC_PRINT_STYLE = `
@page {
  size: A4;
  margin: 0;
}

@media print {
  ${BASE_PRINT_CSS}

  .doc-source-hidden {
    display: block !important;
    position: static !important;
    left: auto !important;
    visibility: visible !important;
  }

  .doc-preview {
    display: none !important;
  }

  .doc-wrapper {
    display: block !important;
    padding: 0 !important;
    counter-reset: doc-page !important;
  }

  .doc {
    width: auto !important;
    min-height: auto !important;
    box-shadow: none !important;
    padding: 20mm !important;
    box-sizing: border-box !important;
    background: transparent !important;
    position: relative !important;
    counter-increment: doc-page !important;
  }

  .doc::before,
  .doc::after {
    display: none !important;
  }

  .doc-page-num {
    position: absolute !important;
    top: calc(297mm - 13mm) !important;
    left: 0 !important;
    right: 0 !important;
    text-align: center !important;
    font-size: 10pt !important;
    color: #6b7280 !important;
    pointer-events: none !important;
    z-index: 5 !important;
  }

  .doc-page-num::after {
    content: counter(doc-page) !important;
  }

  [data-hide-page-num] .doc-page-num {
    display: none !important;
  }

  .doc.doc-cover {
    min-height: calc(297mm - 40mm) !important;
  }

  .cover-title {
    clip-path: inset(2px);
  }

  .doc + .doc {
    break-before: page;
    page-break-before: always;
  }

  .no-break,
  pre,
  table,
  img,
  svg,
  figure,
  [data-rehype-pretty-code-figure],
  mjx-container {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  h1, h2, h3, h4, h5, h6 {
    break-after: avoid;
    page-break-after: avoid;
  }

  .page-break-before {
    break-before: page;
    page-break-before: always;
  }
}
`

const SLIDE_PRINT_STYLE = `
@page {
  size: 254mm 143mm;
  margin: 0;
}

@media print {
  ${BASE_PRINT_CSS}

  .slide-wrapper {
    display: block;
    padding: 0 !important;
  }

  .slide {
    width: 254mm;
    height: 143mm;
    padding: 12mm 16mm;
    box-shadow: none;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 14pt;
  }

  .slide + .slide {
    break-before: page;
  }
}
`

export function ViewerShell({ children, type }: ViewerShellProps) {
  const isSlide = type === 'slide'
  const contentRef = useRef<HTMLDivElement>(null)
  const [showPageNum, setShowPageNum] = useState(true)

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: isSlide ? SLIDE_PRINT_STYLE : DOC_PRINT_STYLE,
    documentTitle: 'JS Printer',
  })

  const togglePageNum = useCallback(() => {
    setShowPageNum((prev) => {
      const next = !prev
      const targets = [document.body, document.querySelector('.doc-wrapper')]
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
        {!isSlide && (
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
        )}
        <button
          className={`rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg active:scale-95 transition-all ${
            isSlide
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={() => handlePrint()}
        >
          PDF 저장
        </button>
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  )
}
