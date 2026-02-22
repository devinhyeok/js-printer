import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#2563eb',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#1d4ed8',
    secondaryColor: '#dbeafe',
    secondaryTextColor: '#1e3a8a',
    tertiaryColor: '#eff6ff',
    lineColor: '#2563eb',
    edgeLabelBackground: '#ffffff',
    labelTextColor: '#1d4ed8',
    background: '#ffffff',
    mainBkg: '#2563eb',
    nodeBorder: '#1d4ed8',
    clusterBkg: '#eff6ff',
    fontFamily: 'Noto Sans KR, sans-serif',
    fontSize: '14px',
  },
})

export function MermaidDiagram({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const id = `mermaid-${Math.random().toString(36).slice(2)}`
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch((err) => {
        if (ref.current)
          ref.current.innerHTML = `<pre style="color:red;font-size:12px">${err}</pre>`
      })
  }, [code])

  return <div ref={ref} className="mermaid-wrap my-6 flex justify-center" />
}
