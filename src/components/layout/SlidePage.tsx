import { Children, isValidElement, useRef } from 'react'
import type { ReactNode } from 'react'
import { useOverflowDetect } from '@/utils/useOverflowDetect'

export type SlideType =
  | 'cover'
  | 'content'
  | 'section'
  | 'two-content'
  | 'comparison'
  | 'title-only'
  | 'blank'
  | 'caption'

interface SlidePageProps {
  type?: SlideType
  bg?: string
  children?: ReactNode
}

const columnRatios: Partial<Record<SlideType, string>> = {
  'two-content': '1fr 1fr',
  comparison: '1fr 1fr',
  caption: '35fr 65fr',
}

const typeConfig: Record<SlideType, { layout: string; padding: string }> = {
  cover: {
    layout: 'flex flex-col items-center justify-center text-center',
    padding: 'px-20 py-16',
  },
  section: {
    layout: 'flex flex-col items-center justify-center text-center',
    padding: 'px-20 py-16',
  },
  content: {
    layout: 'flex flex-col',
    padding: 'px-16 py-12',
  },
  'two-content': {
    layout: 'flex flex-col',
    padding: 'px-16 py-12',
  },
  comparison: {
    layout: 'flex flex-col',
    padding: 'px-16 py-12',
  },
  'title-only': {
    layout: 'flex flex-col',
    padding: 'px-16 py-12',
  },
  blank: {
    layout: 'flex flex-col',
    padding: '',
  },
  caption: {
    layout: 'flex flex-col',
    padding: 'px-16 py-12',
  },
}

function splitAtHr(children: ReactNode): ReactNode[][] {
  const sections: ReactNode[][] = [[]]
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === 'hr') {
      sections.push([])
    } else {
      sections[sections.length - 1].push(child)
    }
  })
  return sections
}

function extractTitle(nodes: ReactNode[]): {
  title: ReactNode | null
  rest: ReactNode[]
} {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (isValidElement(node) && (node.type === 'h2' || node.type === 'h3')) {
      return {
        title: node,
        rest: [...nodes.slice(0, i), ...nodes.slice(i + 1)],
      }
    }
  }
  return { title: null, rest: nodes }
}

export function SlidePage({ type = 'content', bg, children }: SlidePageProps) {
  const ref = useRef<HTMLDivElement>(null)
  useOverflowDetect(ref)
  const config = typeConfig[type]
  const gridTemplate = columnRatios[type]

  let content: ReactNode = children

  if (gridTemplate) {
    const sections = splitAtHr(children)
    if (sections.length >= 2) {
      const { title, rest: firstCol } = extractTitle(sections[0])
      const columns = [firstCol, ...sections.slice(1)]

      content = (
        <>
          {title}
          <div
            className="flex-1"
            style={{
              display: 'grid',
              gridTemplateColumns: gridTemplate,
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            {columns.map((col, i) => (
              <div key={i} className="min-w-0 overflow-hidden">
                {col}
              </div>
            ))}
          </div>
        </>
      )
    }
  }

  return (
    <div
      ref={ref}
      className={`slide ${config.layout} ${config.padding}`}
      data-type={type}
      style={bg ? { background: bg } : undefined}
    >
      {content}
    </div>
  )
}
