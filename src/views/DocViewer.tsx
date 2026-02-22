import { type ComponentType } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { DocLayout } from '../components/layout/DocLayout'
import { docMDXComponents as defaultComponents } from '../components/layout/DocMDXComponents'
import type { MDXComponents } from 'mdx/types'
import type { MDXProps } from 'mdx/types'

type DocModule = { default: ComponentType<MDXProps> }
type ThemeModule = { mdxComponents: MDXComponents }

const docGlob = import.meta.glob<DocModule>('../content/document/*/index.mdx', {
  eager: true,
})
const themeGlob = import.meta.glob<ThemeModule>(
  '../content/document/*/theme.tsx',
  { eager: true },
)

interface DocViewerProps {
  docId: string
}

export function DocViewer({ docId }: DocViewerProps) {
  const Doc = docGlob[`../content/document/${docId}/index.mdx`]?.default ?? null
  const themeMod = themeGlob[`../content/document/${docId}/theme.tsx`]
  const components: MDXComponents = themeMod?.mdxComponents ?? defaultComponents

  if (!Doc) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        문서를 찾을 수 없습니다: {docId}
      </div>
    )
  }

  return (
    <MDXProvider components={components}>
      <DocLayout>
        <Doc />
      </DocLayout>
    </MDXProvider>
  )
}
