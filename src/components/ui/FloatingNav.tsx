import { useEffect, useRef, useState } from 'react'
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
  const [activeIdx, setActiveIdx] = useState<number>(-1)
  const navRef = useRef<HTMLDivElement>(null)

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

  // 마지막 헤딩이 threshold를 통과할 수 있도록 doc-wrapper 하단 여백을 동적으로 계산
  useEffect(() => {
    if (headings.length === 0) return

    const THRESHOLD = 124
    const wrapper = document.querySelector<HTMLElement>('.doc-wrapper')

    const applyPadding = () => {
      if (!wrapper) return
      const lastEl = headings[headings.length - 1].el as HTMLElement
      const lastAbsTop = lastEl.getBoundingClientRect().top + window.scrollY
      const needed =
        lastAbsTop -
        THRESHOLD -
        (document.documentElement.scrollHeight - window.innerHeight)
      wrapper.style.paddingBottom =
        needed > 0 ? `${Math.ceil(needed) + 40}px` : '40px'
    }

    applyPadding()
    window.addEventListener('resize', applyPadding)
    return () => {
      window.removeEventListener('resize', applyPadding)
      if (wrapper) wrapper.style.paddingBottom = ''
    }
  }, [headings])

  useEffect(() => {
    if (headings.length === 0) return

    // scroll-margin-top(120px)에 약간의 여유를 더한 기준선
    const THRESHOLD = 124

    const measure = () => {
      let found = -1
      for (let i = headings.length - 1; i >= 0; i--) {
        const rect = (headings[i].el as HTMLElement).getBoundingClientRect()
        if (rect.top <= THRESHOLD) {
          found = i
          break
        }
      }
      setActiveIdx(found)
    }

    // smooth scroll 애니메이션이 끝난 뒤 최종 위치를 재측정
    let endTimer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      measure()
      clearTimeout(endTimer)
      endTimer = setTimeout(measure, 120)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    measure()
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(endTimer)
    }
  }, [headings])

  // 활성 항목이 목차 패널 안에서 보이도록 스크롤
  useEffect(() => {
    if (activeIdx < 0 || !navRef.current) return
    const activeBtn = navRef.current.querySelector<HTMLElement>(
      `[data-nav-idx="${activeIdx}"]`,
    )
    if (activeBtn) {
      activeBtn.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  if (headings.length === 0) return null

  if (!open) {
    return (
      <button
        className="print-button fixed top-4 right-4 z-50 rounded-full bg-white p-2.5 shadow-md border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 active:scale-95 transition-all"
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
    <div className="print-button fixed top-4 right-4 z-50 w-56">
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

        <div ref={navRef} className="max-h-[75vh] overflow-y-auto pt-3">
          {headings.map((h, i) => {
            const isActive = i === activeIdx
            if (h.level === 2) {
              chapterIdx++
              const n = String(chapterIdx).padStart(2, '0')
              return (
                <div key={i}>
                  {chapterIdx > 1 && (
                    <div className="mx-4 mt-4 mb-4 border-t border-gray-100" />
                  )}
                  <button
                    data-nav-idx={i}
                    className={`w-full text-left px-4 py-2 transition-colors flex items-center gap-2 ${
                      isActive ? 'bg-blue-50' : 'hover:text-blue-800'
                    }`}
                    onClick={() =>
                      h.el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      })
                    }
                  >
                    <span
                      className={`shrink-0 text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-blue-600'}`}
                    >
                      {n}.
                    </span>
                    <span
                      className={`text-sm font-semibold truncate flex-1 ${isActive ? 'text-blue-700' : 'text-blue-600'}`}
                    >
                      {h.text}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] font-bold ml-1 ${isActive ? 'text-blue-500' : 'text-blue-300'}`}
                    >
                      {String(h.page).padStart(3, '0')}
                    </span>
                  </button>
                </div>
              )
            }
            return (
              <button
                key={i}
                data-nav-idx={i}
                className={`w-full text-left px-4 py-1 text-xs transition-colors flex items-center ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                onClick={() =>
                  h.el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                <span className="truncate flex-1">{h.text}</span>
                <span
                  className={`shrink-0 text-[10px] ml-1 ${isActive ? 'text-blue-400' : 'text-gray-300'}`}
                >
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
