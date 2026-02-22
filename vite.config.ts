import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkDirective from 'remark-directive'
import rehypeMathjax from 'rehype-mathjax'
import rehypePrettyCode from 'rehype-pretty-code'
import { visit } from 'unist-util-visit'

// mermaid 코드블록을 rehype-pretty-code 처리 전에 별도 요소로 분리
function rehypeMermaid() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: any, parent: any) => {
      if (!parent || index === null || node.tagName !== 'pre') return
      const code = node.children?.[0]
      if (!code || code.tagName !== 'code') return
      const classes: string[] = code.properties?.className ?? []
      if (!classes.includes('language-mermaid')) return
      const text: string = (code.children ?? [])
        .filter((n: any) => n.type === 'text')
        .map((n: any) => n.value as string)
        .join('')
      parent.children[index] = {
        type: 'element',
        tagName: 'mermaid-diagram',
        properties: {},
        children: [{ type: 'text', value: text }],
      }
    })
  }
}

// :::note, :::warning 등 directive를 callout 요소로 변환
function remarkCallout() {
  return (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      const data = node.data ?? (node.data = {})
      data.hName = 'callout'
      data.hProperties = { type: node.name }
    })
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkGfm, remarkMath, remarkDirective, remarkCallout],
      rehypePlugins: [
        rehypeMathjax,
        rehypeMermaid,
        [rehypePrettyCode, { theme: 'github-light' }],
      ],
      providerImportSource: '@mdx-js/react',
    }),
    react(),
  ],
})
