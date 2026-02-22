import { useState, useEffect } from 'react'
import './styles/global.css'
import { ContentSelector, type ContentType } from './views/ContentSelector'
import { DocViewer } from './views/DocViewer'
import { SlideViewer } from './views/SlideViewer'
import { ViewerShell } from './components/layout/ViewerShell'

interface Selection {
  id: string
  type: ContentType
}

function parseUrlSelection(): Selection | null {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  const type = params.get('type') as ContentType | null
  if (id && (type === 'doc' || type === 'slide')) return { id, type }
  return null
}

function App() {
  const [selected, setSelected] = useState<Selection | null>(parseUrlSelection)

  useEffect(() => {
    const onPopState = () => setSelected(parseUrlSelection())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handleSelect = (id: string, type: ContentType) => {
    const url = new URL(window.location.href)
    url.searchParams.set('id', id)
    url.searchParams.set('type', type)
    window.history.pushState({}, '', url)
    setSelected({ id, type })
  }

  if (!selected) {
    return <ContentSelector onSelect={handleSelect} />
  }

  if (selected.type === 'slide') {
    return (
      <ViewerShell type="slide">
        <SlideViewer slideId={selected.id} />
      </ViewerShell>
    )
  }

  return (
    <ViewerShell type="doc">
      <DocViewer docId={selected.id} />
    </ViewerShell>
  )
}

export default App
