import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-0 mb-5 pb-3 border-b-2 border-gray-200">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold text-gray-800 mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="leading-relaxed mb-4 text-gray-700">{children}</p>
  ),
  table: ({ children }) => (
    <div className="no-break overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-3 py-2">{children}</td>
  ),
}
