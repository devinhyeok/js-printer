import { useState, useEffect, type ComponentType } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { ReportLayout } from '../components/layout/ReportLayout'
import { mdxComponents as defaultComponents } from '../components/mdx/MDXComponents'
import type { MDXComponents } from 'mdx/types'
import type { MDXProps } from 'mdx/types'

type BookModule = { default: ComponentType<MDXProps> }
type ComponentsModule = { mdxComponents: MDXComponents }

const bookGlob = import.meta.glob<BookModule>('../content/*/index.mdx')
const componentsGlob = import.meta.glob<ComponentsModule>(
  '../content/*/components.tsx',
)

interface BookReportProps {
  bookId: string
}

export function BookReport({ bookId }: BookReportProps) {
  const [Book, setBook] = useState<ComponentType<MDXProps> | null>(null)
  const [components, setComponents] = useState<MDXComponents>(defaultComponents)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setBook(null)

    const bookLoader = bookGlob[`../content/${bookId}/index.mdx`]
    const componentsLoader =
      componentsGlob[`../content/${bookId}/components.tsx`]

    if (!bookLoader) {
      setLoading(false)
      return
    }

    Promise.all([
      bookLoader(),
      componentsLoader?.() ?? Promise.resolve(null),
    ]).then(([bookMod, componentsMod]) => {
      setBook(() => bookMod.default)
      setComponents(componentsMod?.mdxComponents ?? defaultComponents)
      setLoading(false)
    })
  }, [bookId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400 text-sm">
        불러오는 중...
      </div>
    )
  }

  if (!Book) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        책을 찾을 수 없습니다: {bookId}
      </div>
    )
  }

  return (
    <MDXProvider components={components}>
      <ReportLayout>
        <Book />
      </ReportLayout>
    </MDXProvider>
  )
}
