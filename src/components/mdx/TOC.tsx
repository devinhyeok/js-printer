interface TOCItem {
  title: string
  page?: number
  children?: TOCItem[]
}

interface TOCProps {
  items: TOCItem[]
}

const p = (n: number) => String(n).padStart(3, '0')

export function TOC({ items }: TOCProps) {
  return (
    <div
      className="page"
      style={{ backgroundColor: '#eef2f7', padding: '20mm' }}
    >
      <div className="mb-14 inline-block">
        <span className="text-base font-bold tracking-wide text-gray-900">
          목차
        </span>
        <div className="mt-1 h-px w-full bg-gray-700" />
      </div>
      <nav className="flex flex-col gap-12">
        {items.map((item, i) => (
          <div key={i}>
            {/* CHAPTER N. + 오른쪽으로 사라지는 라인 */}
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-xs font-bold tracking-widest text-blue-500 shrink-0 uppercase">
                Chapter {i + 1}.
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    'linear-gradient(to right, #3b82f6, rgba(59,130,246,0.22))',
                }}
              />
            </div>

            {/* 챕터 제목 + 페이지 */}
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-lg font-extrabold text-blue-600">
                {item.title}
              </span>
              {item.page !== undefined && (
                <span className="text-sm font-bold text-blue-700 shrink-0 ml-4">
                  {p(item.page)}
                </span>
              )}
            </div>

            {/* 섹션 항목 */}
            {item.children?.map((child, j) => (
              <div
                key={j}
                className="flex items-baseline justify-between py-1.5"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-600 text-xs shrink-0">•</span>
                  <span className="text-sm text-gray-700">{child.title}</span>
                </div>
                {child.page !== undefined && (
                  <span className="text-sm text-gray-600 shrink-0 ml-4">
                    {p(child.page)}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </div>
  )
}
