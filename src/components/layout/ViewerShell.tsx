import { useState, useCallback, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useNavigate } from 'react-router'
import { Minus, Plus, Maximize, Home } from 'lucide-react'
import { BookSwitcher } from '../ui/BookSwitcher'
import { FloatingNav } from '../ui/FloatingNav'
import { useAppStore } from '../../stores/useAppStore'

interface ViewerShellProps {
  children: ReactNode
  type: 'doc' | 'slide'
}

const ZOOM_STEP = 0.1
const MIN_ZOOM = 0.25
const MAX_ZOOM = 2.0
const CONTENT_WIDTH: Record<string, number> = { slide: 960, doc: 794 }

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

const ZOOM_PRINT_RESET = `
  .viewer-zoom-container {
    transform: none !important;
  }
  .viewer-zoom-height {
    height: auto !important;
  }
`

const DOC_PRINT_STYLE = `
@page {
  size: A4;
  margin: 0;
}

@media print {
  ${BASE_PRINT_CSS}
  ${ZOOM_PRINT_RESET}

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
  ${ZOOM_PRINT_RESET}

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
  const navigate = useNavigate()
  const isSlide = type === 'slide'
  const contentRef = useRef<HTMLDivElement>(null)
  const zoomContentRef = useRef<HTMLDivElement>(null)
  const showPageNum = useAppStore((s) => s.viewer.showPageNum)
  const togglePageNum = useAppStore((s) => s.togglePageNum)
  const [zoom, setZoom] = useState(1)
  const [contentHeight, setContentHeight] = useState(0)

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: isSlide ? SLIDE_PRINT_STYLE : DOC_PRINT_STYLE,
    documentTitle: 'JS Printer',
  })

  useEffect(() => {
    const el = zoomContentRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setContentHeight(entries[0].contentRect.height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const maxDefaultZoom = isSlide
    ? +(CONTENT_WIDTH.doc / CONTENT_WIDTH.slide).toFixed(2)
    : 1

  const calcFitZoom = useCallback(() => {
    const vw = window.innerWidth - 80
    const cw = CONTENT_WIDTH[type]
    return Math.min(
      Math.max(Math.round((vw / cw) * 100) / 100, MIN_ZOOM),
      maxDefaultZoom,
    )
  }, [type, maxDefaultZoom])

  useEffect(() => {
    document.documentElement.style.setProperty('--viewer-zoom', String(zoom))
    window.dispatchEvent(new Event('viewer-zoom-change'))
    return () => {
      document.documentElement.style.removeProperty('--viewer-zoom')
    }
  }, [zoom])

  useEffect(() => {
    setZoom(calcFitZoom())
    const handler = () => setZoom(calcFitZoom())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [calcFitZoom])

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(+(z + ZOOM_STEP).toFixed(2), MAX_ZOOM)),
    [],
  )
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(+(z - ZOOM_STEP).toFixed(2), MIN_ZOOM)),
    [],
  )
  const zoomReset = useCallback(() => setZoom(1), [])
  const fitToWidth = useCallback(() => setZoom(calcFitZoom()), [calcFitZoom])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      if (e.key === '=' || e.key === '+') {
        e.preventDefault()
        zoomIn()
      } else if (e.key === '-') {
        e.preventDefault()
        zoomOut()
      } else if (e.key === '0') {
        e.preventDefault()
        zoomReset()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomIn, zoomOut, zoomReset])

  const handleTogglePageNum = useCallback(() => {
    togglePageNum()
  }, [togglePageNum])

  useEffect(() => {
    const targets = [document.body, document.querySelector('.doc-wrapper')]
    targets.forEach((el) => {
      if (!el) return
      if (showPageNum) {
        el.removeAttribute('data-hide-page-num')
      } else {
        el.setAttribute('data-hide-page-num', '')
      }
    })
  }, [showPageNum])

  const zoomPct = Math.round(zoom * 100)

  return (
    <>
      <BookSwitcher />
      <FloatingNav />

      <div className="print-button fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <button
          className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 active:scale-95 transition-all"
          onClick={() => navigate('/')}
          title="Home"
        >
          <Home size={16} />
        </button>
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-full shadow-lg border border-gray-200 px-2 py-1.5">
          <button
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-30"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            title="Zoom out (Ctrl+-)"
          >
            <Minus size={16} />
          </button>
          <button
            className="min-w-[3.5rem] text-center text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            onClick={zoomReset}
            title="Reset zoom (Ctrl+0)"
          >
            {zoomPct}%
          </button>
          <button
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-30"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            title="Zoom in (Ctrl+=)"
          >
            <Plus size={16} />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={fitToWidth}
            title="Fit to width"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>

      <div className="print-button fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isSlide && (
          <button
            className={`rounded-full px-6 py-3 text-sm font-semibold shadow-lg active:scale-95 transition-all ${
              showPageNum
                ? 'bg-gray-400 text-white hover:bg-gray-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={handleTogglePageNum}
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

      <div ref={contentRef}>
        <div
          className="viewer-zoom-height"
          style={{
            height: contentHeight ? contentHeight * zoom : undefined,
            overflow: 'visible',
          }}
        >
          <div
            ref={zoomContentRef}
            className="viewer-zoom-container"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
            }}
          >
            {children}
          </div>
        </div>
        <div className="nav-scroll-spacer" />
      </div>
    </>
  )
}
