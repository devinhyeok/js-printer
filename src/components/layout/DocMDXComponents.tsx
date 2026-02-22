import type { MDXComponents } from 'mdx/types'
import { MermaidDiagram } from '../widgets/MermaidDiagram'
import { Callout } from '../widgets/Callout'
import { DocPage, useCoverContext } from './DocPage'

function H1({ children }: { children?: React.ReactNode }) {
  const isCover = useCoverContext()
  if (isCover) {
    return (
      <h1
        className="font-black tracking-tight leading-none mb-6"
        style={{
          fontSize: '5rem',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {children}
      </h1>
    )
  }
  return <h1 className="text-4xl font-black mb-6 text-gray-900">{children}</h1>
}

function H2({ children }: { children?: React.ReactNode }) {
  const isCover = useCoverContext()
  if (isCover) {
    return (
      <p className="text-xl font-normal text-gray-600 mb-10 tracking-wide">
        {children}
      </p>
    )
  }
  return (
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
  )
}

function P({ children }: { children?: React.ReactNode }) {
  const isCover = useCoverContext()
  if (isCover) {
    return <p className="text-sm text-gray-400">{children}</p>
  }
  return <p className="leading-relaxed mb-4 text-gray-700">{children}</p>
}

export const docMDXComponents: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: ({ children }) => (
    <h3 className="text-lg font-bold mt-8 mb-3 text-blue-800">{children}</h3>
  ),
  p: P,
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
  DocPage,
}
