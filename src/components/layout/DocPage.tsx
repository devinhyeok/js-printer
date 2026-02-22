import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export type DocPageType = 'content' | 'cover' | 'toc'

export interface TOCItem {
  title: string
  page?: number
  children?: TOCItem[]
}

interface DocPageContent {
  type?: 'content'
  children?: ReactNode
}

interface DocPageCover {
  type: 'cover'
  children?: ReactNode
}

interface DocPageTOC {
  type: 'toc'
}

type DocPageProps = DocPageContent | DocPageCover | DocPageTOC

const pad = (n: number) => String(n).padStart(3, '0')

export const DocCoverContext = createContext(false)

function TOCContent({ items }: { items: TOCItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">목차를 불러오는 중...</p>
  }
  return (
    <nav className="flex flex-col gap-8">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-xs font-bold tracking-widest text-blue-500 shrink-0 uppercase">
              Chapter {i + 1}.
            </span>
            <div className="flex-1 h-px bg-blue-200" />
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-lg font-extrabold text-blue-600">
              {item.title}
            </span>
            {item.page !== undefined && (
              <span className="text-sm font-bold text-blue-700 shrink-0 ml-4">
                {pad(item.page)}
              </span>
            )}
          </div>
          {item.children?.map((child, j) => (
            <div key={j} className="flex items-baseline justify-between py-1.5">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-600 text-xs shrink-0">•</span>
                <span className="text-sm text-gray-700">{child.title}</span>
              </div>
              {child.page !== undefined && (
                <span className="text-sm text-gray-600 shrink-0 ml-4">
                  {pad(child.page)}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </nav>
  )
}

function AutoTOC() {
  const selfRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<TOCItem[]>([])

  useEffect(() => {
    const allDocs = Array.from(document.querySelectorAll('.doc-wrapper .doc'))
    const selfDoc = selfRef.current
    const result: TOCItem[] = []

    allDocs.forEach((docEl, docIdx) => {
      if (docEl === selfDoc) return

      const pageNum = docIdx + 1
      const headings = Array.from(docEl.querySelectorAll('h2, h3'))
      let currentH2: TOCItem | null = null

      headings.forEach((el) => {
        if (el.tagName === 'H2') {
          currentH2 = { title: el.textContent ?? '', page: pageNum }
          result.push(currentH2)
        } else if (el.tagName === 'H3' && currentH2) {
          if (!currentH2.children) currentH2.children = []
          currentH2.children.push({ title: el.textContent ?? '', page: pageNum })
        }
      })
    })

    setItems(result)
  }, [])

  return (
    <div className="doc" ref={selfRef}>
      <div className="mb-14 inline-block">
        <span className="text-base font-bold tracking-wide text-gray-900">
          목차
        </span>
        <div className="mt-1 h-px w-full bg-gray-700" />
      </div>
      <TOCContent items={items} />
    </div>
  )
}

export function DocPage(props: DocPageProps) {
  if (props.type === 'cover') {
    return (
      <DocCoverContext.Provider value={true}>
        <div
          className="doc flex flex-col items-center justify-center text-center"
          style={{ minHeight: '257mm' }}
        >
          {props.children}
        </div>
      </DocCoverContext.Provider>
    )
  }

  if (props.type === 'toc') {
    return <AutoTOC />
  }

  return <div className="doc">{props.children}</div>
}

/** DocMDXComponents에서 cover 안에서 h1/h2/p를 다르게 렌더링할 때 사용 */
export function useCoverContext() {
  return useContext(DocCoverContext)
}
