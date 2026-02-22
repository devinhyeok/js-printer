import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import { useReactToPrint } from 'react-to-print'

interface DocLayoutProps {
  children: ReactNode
}

const PRINT_PAGE_STYLE = `
@page {
  size: A4;
  margin: 0;
}

@media print {
  body {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 11pt;
    color: #1a1a1a;
    background: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .doc-source-hidden {
    display: block !important;
    position: static !important;
    left: auto !important;
    visibility: visible !important;
  }

  .doc-wrapper {
    display: block !important;
    padding: 0 !important;
  }

  .doc {
    width: auto !important;
    min-height: auto !important;
    box-shadow: none !important;
    padding: 20mm !important;
    box-sizing: border-box !important;
    background: transparent !important;
  }

  .doc::before,
  .doc::after {
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

  .print-button {
    display: none !important;
  }
}
`

export function DocLayout({ children }: DocLayoutProps) {
  const sourceRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const [paginated, setPaginated] = useState(false)

  const handlePrint = useReactToPrint({
    contentRef: sourceRef,
    pageStyle: PRINT_PAGE_STYLE,
    documentTitle: 'JS Printer',
  })

  const printHandler = useCallback(() => {
    handlePrint()
  }, [handlePrint])

  useEffect(() => {
    window.addEventListener('doc:print', printHandler)
    return () => window.removeEventListener('doc:print', printHandler)
  }, [printHandler])

  useEffect(() => {
    const source = sourceRef.current
    const target = targetRef.current
    if (!source || !target) return

    let cancelled = false

    const paginate = async () => {
      await new Promise((r) => setTimeout(r, 800))
      if (cancelled) return

      const { Previewer } = await import('pagedjs')
      const previewer = new Previewer()

      const content = source.innerHTML
      target.innerHTML = ''

      const cssPath = `${import.meta.env.BASE_URL}pagedjs-doc.css`
      await previewer.preview(content, [cssPath], target)
      if (!cancelled) setPaginated(true)
    }

    paginate()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      {/* 원본 콘텐츠: 화면에서는 CSS로 숨기고, react-to-print가 인쇄 시 사용 */}
      <div
        ref={sourceRef}
        className={`doc-wrapper ${paginated ? 'doc-source-hidden' : ''}`}
      >
        {children}
      </div>
      {/* paged.js 웹 미리보기 출력 */}
      <div
        ref={targetRef}
        style={paginated ? undefined : { display: 'none' }}
      />
    </>
  )
}
