import type { MDXComponents } from 'mdx/types'
import { MermaidDiagram } from '../widgets/MermaidDiagram'
import { Callout } from '../widgets/Callout'
import { SlidePage, Col, useSlideContext } from './SlidePage'

function H1({ children }: { children?: React.ReactNode }) {
  const type = useSlideContext()
  if (type === 'title') {
    return (
      <h1 className="text-6xl font-black tracking-tight text-blue-900 mb-4 leading-tight">
        {children}
      </h1>
    )
  }
  return (
    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4 leading-tight">
      {children}
    </h1>
  )
}

function H2({ children }: { children?: React.ReactNode }) {
  const type = useSlideContext()
  if (type === 'title') {
    return <p className="text-2xl font-normal text-gray-500 mt-0">{children}</p>
  }
  // content / two-col: 슬라이드 제목 스타일
  return (
    <h2
      className="text-4xl font-extrabold tracking-tight text-blue-900 mb-8 pb-3"
      style={{
        backgroundImage:
          'linear-gradient(to right, #2563eb, rgba(37,99,235,0.22))',
        backgroundPosition: 'left bottom',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 2px',
      }}
    >
      {children}
    </h2>
  )
}

export const slideMDXComponents: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: ({ children }) => (
    <h3 className="text-2xl font-bold text-blue-800 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-lg leading-relaxed mb-3 text-gray-700">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-3">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 text-lg text-gray-700 mb-3">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse text-base">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold text-blue-900">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-4 py-2">{children}</td>
  ),
  'mermaid-diagram': ({ children }: { children?: React.ReactNode }) => (
    <MermaidDiagram code={String(children).trim()} />
  ),
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
  SlidePage,
  Col,
}
