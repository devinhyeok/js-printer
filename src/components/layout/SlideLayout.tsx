import type { ReactNode } from 'react'

interface SlideLayoutProps {
  children: ReactNode
}

export function SlideLayout({ children }: SlideLayoutProps) {
  return (
    <>
      <style>{`@page { size: 254mm 143mm; margin: 0; }`}</style>
      <div className="slide-wrapper">{children}</div>
    </>
  )
}
