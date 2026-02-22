import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, PanelLeft } from 'lucide-react'
import { catalog as docCatalog } from '../../content/document/catalog'
import { catalog as slideCatalog } from '../../content/presentation/catalog'
import { isFolder } from '../../content/catalog-types'
import type { BookItem, CatalogItem } from '../../content/catalog-types'

type ContentType = 'doc' | 'slide'

interface FlatBook {
  id: string
  label: string
  type: ContentType
}

function flattenBooks(items: CatalogItem[], type: ContentType): FlatBook[] {
  const result: FlatBook[] = []
  for (const item of items) {
    if (isFolder(item)) {
      for (const child of item.children) {
        result.push({ id: child.id, label: child.label ?? child.id, type })
      }
    } else {
      result.push({ id: item.id, label: item.label ?? item.id, type })
    }
  }
  return result
}

function navigate(id: string, type: ContentType) {
  const url = new URL(window.location.href)
  url.searchParams.set('id', id)
  url.searchParams.set('type', type)
  window.history.pushState({}, '', url)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function getCurrentId(): string {
  return new URLSearchParams(window.location.search).get('id') ?? ''
}

// 검색어와 매칭되는 책 목록을 평탄화해서 반환
function getSearchResults(query: string): FlatBook[] {
  const q = query.toLowerCase()
  const all = [
    ...flattenBooks(docCatalog, 'doc'),
    ...flattenBooks(slideCatalog, 'slide'),
  ]
  return all.filter(
    (b) => b.label.toLowerCase().includes(q) || b.id.toLowerCase().includes(q),
  )
}

interface BookRowProps {
  book: BookItem
  type: ContentType
  currentId: string
  indent?: boolean
}

function BookRow({ book, type, currentId, indent }: BookRowProps) {
  const isActive = book.id === currentId
  const label = book.label ?? book.id
  return (
    <button
      className={`w-full text-left flex items-center gap-2 py-1.5 pr-3 rounded-md transition-colors ${
        indent ? 'pl-3' : 'pl-3'
      } ${
        isActive
          ? type === 'doc'
            ? 'bg-blue-50'
            : 'bg-indigo-50'
          : 'hover:bg-gray-50'
      }`}
      onClick={() => navigate(book.id, type)}
    >
      <span
        className={`text-xs truncate flex-1 ${
          isActive
            ? type === 'doc'
              ? 'font-semibold text-blue-700'
              : 'font-semibold text-indigo-700'
            : 'text-gray-700'
        }`}
      >
        {label}
      </span>
      <span
        className={`shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
          type === 'doc'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-indigo-100 text-indigo-700'
        }`}
      >
        {type === 'doc' ? 'DOC' : 'PPT'}
      </span>
    </button>
  )
}

interface SectionTreeProps {
  items: CatalogItem[]
  type: ContentType
  currentId: string
}

function SectionTree({ items, type, currentId }: SectionTreeProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item, i) => {
        if (isFolder(item)) {
          const key = `${type}-${item.folder}-${i}`
          const isCollapsed = collapsed[key]
          return (
            <div key={key}>
              <button
                className="w-full text-left flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => toggle(key)}
              >
                {isCollapsed ? (
                  <ChevronRight size={12} className="shrink-0" />
                ) : (
                  <ChevronDown size={12} className="shrink-0" />
                )}
                <span className="truncate">{item.folder}</span>
              </button>
              {!isCollapsed && (
                <div
                  className="flex flex-col gap-0.5"
                  style={{
                    marginLeft: 15,
                    paddingLeft: 8,
                    borderLeft: '1px solid #e5e7eb',
                  }}
                >
                  {item.children.map((child) => (
                    <BookRow
                      key={child.id}
                      book={child}
                      type={type}
                      currentId={currentId}
                      indent
                    />
                  ))}
                </div>
              )}
            </div>
          )
        }
        return (
          <BookRow
            key={item.id}
            book={item}
            type={type}
            currentId={currentId}
          />
        )
      })}
    </div>
  )
}

export function BookSwitcher() {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [currentId, setCurrentId] = useState(getCurrentId)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onPopState = () => setCurrentId(getCurrentId())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  if (!open) {
    return (
      <button
        className="print-button fixed top-4 left-4 z-50 rounded-full bg-white p-2.5 shadow-md border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 active:scale-95 transition-all"
        onClick={() => {
          setOpen(true)
          setTimeout(() => inputRef.current?.focus(), 50)
        }}
        title="콘텐츠 목록"
      >
        <PanelLeft size={18} />
      </button>
    )
  }

  const isSearching = query.trim().length > 0
  const searchResults = isSearching ? getSearchResults(query) : []

  return (
    <div className="print-button fixed top-4 left-4 z-50 w-56">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            콘텐츠
          </span>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            <PanelLeft size={14} />
          </button>
        </div>

        {/* 검색창 */}
        <div className="px-3 py-2 border-b border-gray-100">
          <input
            ref={inputRef}
            type="text"
            placeholder="검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-100 transition-colors"
          />
        </div>

        {/* 트리 / 검색 결과 */}
        <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
          {isSearching ? (
            searchResults.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {searchResults.map((b) => (
                  <BookRow
                    key={`${b.type}-${b.id}`}
                    book={{ id: b.id, label: b.label }}
                    type={b.type}
                    currentId={currentId}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">
                검색 결과 없음
              </p>
            )
          ) : (
            <div className="flex flex-col gap-3">
              {docCatalog.length > 0 && (
                <div>
                  <p className="px-3 pb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    문서
                  </p>
                  <SectionTree
                    items={docCatalog}
                    type="doc"
                    currentId={currentId}
                  />
                </div>
              )}
              {slideCatalog.length > 0 && (
                <div>
                  <p className="px-3 pb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    프레젠테이션
                  </p>
                  <SectionTree
                    items={slideCatalog}
                    type="slide"
                    currentId={currentId}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-1" />
      </div>
    </div>
  )
}
