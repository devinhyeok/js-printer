import { type ComponentType } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { SlideLayout } from '../components/layout/SlideLayout'
import { slideMDXComponents as defaultComponents } from '../components/layout/SlideMDXComponents'
import type { MDXComponents } from 'mdx/types'
import type { MDXProps } from 'mdx/types'

type SlideModule = { default: ComponentType<MDXProps> }
type ThemeModule = { mdxComponents: MDXComponents }

const slideGlob = import.meta.glob<SlideModule>(
  '../content/presentation/*/index.{mdx,tsx}',
  { eager: true },
)
const themeGlob = import.meta.glob<ThemeModule>(
  '../content/presentation/*/theme.tsx',
  { eager: true },
)

interface SlideViewerProps {
  slideId: string
}

export function SlideViewer({ slideId }: SlideViewerProps) {
  const Slide =
    slideGlob[`../content/presentation/${slideId}/index.mdx`]?.default ??
    slideGlob[`../content/presentation/${slideId}/index.tsx`]?.default ??
    null
  const themeMod = themeGlob[`../content/presentation/${slideId}/theme.tsx`]
  const components: MDXComponents = themeMod?.mdxComponents ?? defaultComponents

  if (!Slide) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        프레젠테이션을 찾을 수 없습니다: {slideId}
      </div>
    )
  }

  return (
    <MDXProvider components={components}>
      <SlideLayout>
        <Slide />
      </SlideLayout>
    </MDXProvider>
  )
}
