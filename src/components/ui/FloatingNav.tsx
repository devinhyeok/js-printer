import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

interface Heading {
  text: string
  level: 2 | 3
  page: number
  el: Element
}

export function FloatingNav() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const collect = () => {
      const allDocs = Array.from(document.querySelectorAll('.doc-wrapper .doc'))
      const result: Heading[] = []
      allDocs.forEach((docEl, docIdx) => {
        const pageNum = docIdx + 1
        docEl.querySelectorAll('h2, h3').forEach((el) => {
          result.push({
            text: el.textContent ?? '',
            level: el.tagName === 'H2' ? 2 : 3,
            page: pageNum,
            el,
          })
        })
      })
      setHeadings(result)
    }
    collect()
    const t = setTimeout(collect, 300)
    return () => clearTimeout(t)
  }, [])

  if (headings.length === 0) return null

  if (!open) {
    return (
      <button
        className="print-button fixed top-4 left-4 z-50 rounded-full bg-white p-2.5 shadow-md border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 active:scale-95 transition-all"
        onClick={() => setOpen(true)}
        title="목차"
      >
        <Menu size={18} />
      </button>
    )
  }

  // h2 항목에 순서 번호 부여
  let chapterIdx = 0

  return (
    <div className="print-button fixed top-4 left-4 z-50 w-56">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            목차
          </span>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Menu size={14} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto pt-3">
          {headings.map((h, i) => {
            if (h.level === 2) {
              chapterIdx++
              const n = String(chapterIdx).padStart(2, '0')
              return (
                <div key={i}>
                  {chapterIdx > 1 && (
                    <div className="mx-4 mt-4 mb-4 border-t border-gray-100" />
                  )}
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-2"
                    onClick={() =>
                      h.el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      })
                    }
                  >
                    <span className="shrink-0 text-sm font-semibold text-blue-600">
                      {n}.
                    </span>
                    <span className="text-sm font-semibold text-blue-600 truncate flex-1">
                      {h.text}
                    </span>
                    <span className="shrink-0 text-[10px] font-bold text-blue-300 ml-1">
                      {String(h.page).padStart(3, '0')}
                    </span>
                  </button>
                </div>
              )
            }
            return (
              <button
                key={i}
                className="w-full text-left px-4 py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center"
                onClick={() =>
                  h.el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                <span className="truncate flex-1">{h.text}</span>
                <span className="shrink-0 text-[10px] text-gray-300 ml-1">
                  {String(h.page).padStart(3, '0')}
                </span>
              </button>
            )
          })}
          <div className="h-3" />
        </div>
      </div>
    </div>
  )
}
