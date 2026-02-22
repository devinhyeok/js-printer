import { type ComponentType } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { ReportLayout } from '../components/layout/ReportLayout'
import { mdxComponents as defaultComponents } from '../components/mdx/MDXComponents'
import type { MDXComponents } from 'mdx/types'
import type { MDXProps } from 'mdx/types'

type BookModule = { default: ComponentType<MDXProps> }
type ComponentsModule = { mdxComponents: MDXComponents }

const bookGlob = import.meta.glob<BookModule>('../content/*/index.mdx', {
  eager: true,
})
const componentsGlob = import.meta.glob<ComponentsModule>(
  '../content/*/components.tsx',
  { eager: true },
)

interface BookReportProps {
  bookId: string
}

export function BookReport({ bookId }: BookReportProps) {
  const Book = bookGlob[`../content/${bookId}/index.mdx`]?.default ?? null
  const componentsMod = componentsGlob[`../content/${bookId}/components.tsx`]
  const components: MDXComponents =
    componentsMod?.mdxComponents ?? defaultComponents

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
