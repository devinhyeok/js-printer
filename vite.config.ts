import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'

export default defineConfig({
  plugins: [
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkGfm],
      providerImportSource: '@mdx-js/react',
    }),
    react(),
  ],
})
