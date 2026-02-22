import { mdxComponents as defaultComponents } from '../../components/mdx/MDXComponents'
import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  ...defaultComponents,
  h2: ({ children }) => (
    <h2
      className="mt-0 mb-5 pb-3 text-3xl font-extrabold tracking-tight text-blue-900"
      style={{
        backgroundImage:
          'linear-gradient(to right, #2563eb, rgba(37,99,235,0.22))',
        backgroundPosition: 'left bottom',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 1px',
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold mt-8 mb-3 text-blue-800">{children}</h3>
  ),
}
