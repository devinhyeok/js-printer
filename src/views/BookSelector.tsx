import { useState } from 'react'

const bookPaths = import.meta.glob('../content/*/index.mdx')

const bookIds = Object.keys(bookPaths)
  .map((path) => path.match(/\.\.\/content\/(.+)\/index\.mdx/)?.[1] ?? '')
  .filter(Boolean)
  .sort()

interface BookSelectorProps {
  onSelect: (bookId: string) => void
}

export function BookSelector({ onSelect }: BookSelectorProps) {
  const [query, setQuery] = useState('')

  const filtered = bookIds.filter((id) =>
    id.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-4">
      <h1 className="text-2xl font-bold text-gray-800">출력할 책 선택</h1>
      <input
        type="text"
        placeholder="책 이름 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-72 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        autoFocus
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">검색 결과가 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2 w-72">
          {filtered.map((id) => (
            <li key={id}>
              <button
                className="w-full rounded-lg border border-gray-200 bg-white px-6 py-4 text-left shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => onSelect(id)}
              >
                <span className="font-medium text-gray-800">{id}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-400">
        {filtered.length} / {bookIds.length}권
      </p>
    </div>
  )
}
