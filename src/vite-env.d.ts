/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types'
  const MDXComponent: (props: MDXProps) => JSX.Element
  export default MDXComponent
}

declare module 'pagedjs' {
  export class Previewer {
    preview(
      content: string | Node,
      stylesheets?: string[],
      renderTo?: HTMLElement,
    ): Promise<{ total: number }>
  }
}
