import { useState } from 'react'
import './styles/global.css'
import { BookSelector } from './views/BookSelector'
import { BookReport } from './views/BookReport'

function App() {
  const urlBook = new URLSearchParams(window.location.search).get('book')
  const [selectedBook, setSelectedBook] = useState<string | null>(urlBook)

  const handleSelect = (bookId: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('book', bookId)
    window.history.pushState({}, '', url)
    setSelectedBook(bookId)
  }

  if (!selectedBook) {
    return <BookSelector onSelect={handleSelect} />
  }

  return <BookReport bookId={selectedBook} />
}

export default App
