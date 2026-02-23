import { Routes, Route } from 'react-router'
import './styles/global.css'
import { ContentSelector } from './views/ContentSelector'
import { DocViewer } from './views/DocViewer'
import { SlideViewer } from './views/SlideViewer'
import { ViewerShell } from './components/layout/ViewerShell'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ContentSelector />} />
      <Route
        path="/doc/:docId"
        element={
          <ViewerShell type="doc">
            <DocViewer />
          </ViewerShell>
        }
      />
      <Route
        path="/slide/:slideId"
        element={
          <ViewerShell type="slide">
            <SlideViewer />
          </ViewerShell>
        }
      />
    </Routes>
  )
}

export default App
