import type { MDXComponents } from 'mdx/types'
import { MermaidDiagram } from '../widgets/MermaidDiagram'
import { Callout } from '../widgets/Callout'
import { SlidePage } from './SlidePage'

export const slideMDXComponents: MDXComponents = {
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
}
