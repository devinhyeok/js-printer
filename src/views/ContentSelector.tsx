import { useState } from 'react'

const docPaths = import.meta.glob('../content/document/*/index.mdx')
const slidePaths = import.meta.glob('../content/presentation/*/index.mdx')

const docIds = Object.keys(docPaths)
  .map((p) => p.match(/document\/(.+)\/index\.mdx/)?.[1] ?? '')
  .filter(Boolean)
  .sort()

const slideIds = Object.keys(slidePaths)
  .map((p) => p.match(/presentation\/(.+)\/index\.mdx/)?.[1] ?? '')
  .filter(Boolean)
  .sort()

export type ContentType = 'doc' | 'slide'

interface ContentSelectorProps {
  onSelect: (id: string, type: ContentType) => void
}

function ItemList({
  ids,
  type,
  query,
  onSelect,
}: {
  ids: string[]
  type: ContentType
  query: string
  onSelect: (id: string, type: ContentType) => void
}) {
  const filtered = ids.filter((id) =>
    id.toLowerCase().includes(query.toLowerCase()),
  )

  if (filtered.length === 0) {
    return <p className="text-sm text-gray-400 py-2">검색 결과가 없습니다.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {filtered.map((id) => (
        <li key={id}>
          <button
            className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-left shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-3"
            onClick={() => onSelect(id, type)}
          >
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                type === 'doc'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {type === 'doc' ? 'DOC' : 'PPT'}
            </span>
            <span className="font-medium text-gray-800">{id}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function ContentSelector({ onSelect }: ContentSelectorProps) {
  const [query, setQuery] = useState('')
  const total = docIds.length + slideIds.length

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-800">출력할 콘텐츠 선택</h1>
      <input
        type="text"
        placeholder="이름 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-80 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        autoFocus
      />

      <div className="w-80 flex flex-col gap-6">
        {docIds.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              문서
            </h2>
            <ItemList
              ids={docIds}
              type="doc"
              query={query}
              onSelect={onSelect}
            />
          </section>
        )}

        {slideIds.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              프레젠테이션
            </h2>
            <ItemList
              ids={slideIds}
              type="slide"
              query={query}
              onSelect={onSelect}
            />
          </section>
        )}

        {docIds.length === 0 && slideIds.length === 0 && (
          <p className="text-sm text-gray-400 text-center">
            콘텐츠가 없습니다.
          </p>
        )}
      </div>

      <p className="text-xs text-gray-400">총 {total}개</p>
    </div>
  )
}
