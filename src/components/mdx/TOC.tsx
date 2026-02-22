import { useMDXComponents } from '@mdx-js/react'
import type { ComponentType } from 'react'

interface TOCItem {
  title: string
  page?: number
  children?: TOCItem[]
}

interface TOCProps {
  items: TOCItem[]
}

export function TOC({ items }: TOCProps) {
  const { h2: H2 = 'h2' } = useMDXComponents() as { h2?: ComponentType<{ children: string }> }

  return (
    <div className="page">
      <H2>목차</H2>
      <nav className="mt-6">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex items-end gap-2 py-2">
              <span className="font-medium">{item.title}</span>
              <span className="mb-1 flex-1 border-b border-dotted border-gray-400" />
              {item.page !== undefined && (
                <span className="shrink-0 text-sm text-gray-600">
                  {item.page}
                </span>
              )}
            </div>
            {item.children?.map((child, j) => (
              <div key={j} className="flex items-end gap-2 py-1 pl-6">
                <span className="text-sm text-gray-700">{child.title}</span>
                <span className="mb-1 flex-1 border-b border-dotted border-gray-300" />
                {child.page !== undefined && (
                  <span className="shrink-0 text-sm text-gray-500">
                    {child.page}
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
