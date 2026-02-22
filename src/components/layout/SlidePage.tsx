import { createContext, useContext, useRef } from 'react'
import type { ReactNode } from 'react'
import { useOverflowDetect } from '@/utils/useOverflowDetect'

export type SlidePageType = 'content' | 'title' | 'two-col' | 'blank'

export const SlideContext = createContext<SlidePageType>('content')

export function useSlideContext() {
  return useContext(SlideContext)
}

interface SlidePageContent {
  type?: 'content'
  children?: ReactNode
}

interface SlidePageTitle {
  type: 'title'
  children?: ReactNode
}

interface SlidePageTwoCol {
  type: 'two-col'
  children?: ReactNode
}

interface SlidePageBlank {
  type: 'blank'
  children?: ReactNode
}

type SlidePageProps =
  | SlidePageContent
  | SlidePageTitle
  | SlidePageTwoCol
  | SlidePageBlank

/** two-col 슬라이드에서 각 열을 감싸는 컴포넌트 */
export function Col({ children }: { children?: ReactNode }) {
  return (
    <div className="flex-1 overflow-hidden text-xl text-gray-700 leading-relaxed">
      {children}
    </div>
  )
}

export function SlidePage(props: SlidePageProps) {
  const ref = useRef<HTMLDivElement>(null)
  useOverflowDetect(ref)

  const type = props.type ?? 'content'

  switch (type) {
    case 'title':
      return (
        <SlideContext.Provider value="title">
          <div
            ref={ref}
            className="slide flex flex-col items-center justify-center text-center px-20"
          >
            {props.children}
          </div>
        </SlideContext.Provider>
      )

    case 'two-col':
      return (
        <SlideContext.Provider value="two-col">
          <div ref={ref} className="slide flex flex-col px-16 py-12">
            {props.children}
          </div>
        </SlideContext.Provider>
      )

    case 'blank':
      return (
        <SlideContext.Provider value="blank">
          <div ref={ref} className="slide">
            {props.children}
          </div>
        </SlideContext.Provider>
      )

    default: // content
      return (
        <SlideContext.Provider value="content">
          <div ref={ref} className="slide flex flex-col px-16 py-12">
            {props.children}
          </div>
        </SlideContext.Provider>
      )
  }
}
