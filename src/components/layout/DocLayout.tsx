import { useEffect, useRef, useState, type ReactNode } from 'react'

interface DocLayoutProps {
  children: ReactNode
}

export function DocLayout({ children }: DocLayoutProps) {
  const sourceRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const [paginated, setPaginated] = useState(false)

  useEffect(() => {
    const source = sourceRef.current
    const target = targetRef.current
    if (!source || !target) return

    let cancelled = false

    const paginate = async () => {
      await new Promise((r) => setTimeout(r, 800))
      if (cancelled) return

      const { Previewer } = await import('pagedjs')
      const previewer = new Previewer()

      const content = source.innerHTML
      target.innerHTML = ''

      const cssPath = `${import.meta.env.BASE_URL}pagedjs-doc.css`
      await previewer.preview(content, [cssPath], target)
      if (!cancelled) setPaginated(true)
    }

    paginate()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <div
        ref={sourceRef}
        className={`doc-wrapper ${paginated ? 'doc-source-hidden' : ''}`}
      >
        {children}
      </div>
      <div
        ref={targetRef}
        className="doc-preview"
        style={paginated ? undefined : { display: 'none' }}
      />
    </>
  )
}
