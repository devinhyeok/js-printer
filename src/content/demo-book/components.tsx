import { mdxComponents as defaultComponents } from '../../components/mdx/MDXComponents'
import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  ...defaultComponents,
  h2: ({ children }) => (
    <h2 className="text-3xl font-extrabold tracking-tight text-blue-900 mt-0 mb-5 pb-3 border-b-2 border-blue-200">
      {children}
    </h2>
  ),
}
