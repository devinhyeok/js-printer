import { useEffect, useRef, useState } from 'react'
import { PanelRight } from 'lucide-react'
import { collectHeadings } from '@/utils/collectHeadings'

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
  const [loading, setLoading] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const collect = (done?: () => void) => {
      const isDoc = !!document.querySelector('.doc-wrapper .doc')

      if (!isDoc) {
        const slides = Array.from(
          document.querySelectorAll('.slide-wrapper .slide'),
        )
        const entries: Heading[] = []
        slides.forEach((slideEl, idx) => {
          const h2 = slideEl.querySelector('h2')
          if (h2) {
            entries.push({
              text: h2.textContent ?? '',
              level: 2,
              page: idx + 1,
              el: slideEl,
            })
            return
          }

          const h3 = slideEl.querySelector('h3')
          if (h3) {
            entries.push({
              text: h3.textContent ?? '',
              level: 3,
              page: idx + 1,
              el: slideEl,
            })
          }
        })
        setHeadings(entries)
        done?.()
        return
      }

      const raw = collectHeadings('.doc-wrapper .doc')
      const result: Heading[] = []
      const pages = Array.from(document.querySelectorAll('.doc-wrapper .doc'))

      pages.forEach((el, idx) => {
        if (el.classList.contains('doc-cover')) {
          result.push({ text: '커버', level: 2, page: idx + 1, el })
        } else if (
          !el.querySelector('h2, h3') &&
          el.textContent?.includes('목차')
        ) {
          result.push({ text: '목차', level: 2, page: idx + 1, el })
        }
      })

      raw.forEach((h) => {
        result.push({
          text: h.text,
          level: h.tag === 'H2' ? 2 : 3,
          page: h.page,
          el: h.el,
        })
      })
      setHeadings(result)
      done?.()
    }
    collect()
    const t = setTimeout(collect, 300)

    // 콘텐츠 전환 시 이전 목차 유지 → 새 헤딩 수집 완료 후 교체
    let navTimer: ReturnType<typeof setTimeout>
    const onNav = () => {
      setActiveIdx(-1)
      setLoading(true)
      clearTimeout(navTimer)
      navTimer = setTimeout(() => collect(() => setLoading(false)), 350)
    }
    window.addEventListener('popstate', onNav)

    return () => {
      clearTimeout(t)
      clearTimeout(navTimer)
      window.removeEventListener('popstate', onNav)
    }
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const isSlide = !!document.querySelector('.slide-wrapper')
    const threshold = isSlide ? 44 : 124

    const measure = () => {
      let found = -1
      for (let i = headings.length - 1; i >= 0; i--) {
        const rect = (headings[i].el as HTMLElement).getBoundingClientRect()
        if (rect.top <= threshold) {
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
        <PanelRight size={18} />
      </button>
    )
  }

  let chapterIdx = 0

  return (
    <div className="print-button fixed top-4 right-4 z-50 w-56 xl:w-64 2xl:w-100 3xl:w-120 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              목차
            </span>
            {loading && (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 border-t-blue-400 animate-spin" />
            )}
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            <PanelRight size={14} />
          </button>
        </div>

        <div
          ref={navRef}
          className="max-h-[60vh] md:max-h-[75vh] xl:max-h-[85vh] overflow-y-auto px-2 py-2"
        >
          {headings.map((h, i) => {
            const isActive = i === activeIdx
            if (h.level === 2) {
              chapterIdx++
              return (
                <div key={i}>
                  {chapterIdx > 1 && (
                    <div className="mx-3 my-2 border-t border-gray-100" />
                  )}
                  <button
                    data-nav-idx={i}
                    className={`w-full text-left px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
                      isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() =>
                      h.el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      })
                    }
                  >
                    <span
                      className={`text-xs font-semibold truncate flex-1 ${isActive ? 'text-blue-700' : 'text-gray-800'}`}
                    >
                      {h.text}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] font-bold ml-1 ${isActive ? 'text-blue-500' : 'text-gray-300'}`}
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
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
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
          <div className="h-2" />
        </div>
      </div>
    </div>
  )
}
