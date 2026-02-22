import type { MDXComponents } from 'mdx/types'
import { MermaidDiagram } from './MermaidDiagram'
import { Callout } from './Callout'
import { TOC } from './TOC'

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2
      className="mt-0 mb-5 pb-3 text-3xl font-extrabold tracking-tight text-blue-900"
      style={{
        backgroundImage: 'linear-gradient(to right, #2563eb, rgba(37,99,235,0.22))',
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
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),
  // mermaid 코드블록 → rehypeMermaid 플러그인이 변환한 요소 렌더링
  'mermaid-diagram': ({ children }: { children?: React.ReactNode }) => (
    <MermaidDiagram code={String(children).trim()} />
  ),
  // :::note / :::warning / :::tip / :::important → Callout 렌더링
  callout: ({
    type,
    children,
  }: {
    type?: string
    children?: React.ReactNode
  }) => (
    <Callout
      type={(type ?? 'note') as 'note' | 'warning' | 'tip' | 'important'}
    >
      {children}
    </Callout>
  ),
  // 목차 컴포넌트 (MDX에서 <TOC items={[...]} /> 형태로 사용)
  TOC,
}
