import type { ReactNode } from 'react'

type CalloutType = 'note' | 'warning' | 'tip' | 'important'

interface CalloutProps {
  type: CalloutType
  children: ReactNode
}

const styles: Record<
  CalloutType,
  { border: string; bg: string; label: string; labelColor: string }
> = {
  note: {
    border: 'border-blue-400',
    bg: 'bg-blue-50',
    label: '참고',
    labelColor: 'text-blue-700',
  },
  tip: {
    border: 'border-green-400',
    bg: 'bg-green-50',
    label: '팁',
    labelColor: 'text-green-700',
  },
  warning: {
    border: 'border-yellow-400',
    bg: 'bg-yellow-50',
    label: '주의',
    labelColor: 'text-yellow-700',
  },
  important: {
    border: 'border-red-400',
    bg: 'bg-red-50',
    label: '중요',
    labelColor: 'text-red-700',
  },
}

export function Callout({ type, children }: CalloutProps) {
  const s = styles[type] ?? styles.note
  return (
    <div
      className={`no-break my-4 rounded-r border-l-4 ${s.border} ${s.bg} px-4 py-3`}
    >
      <div className={`mb-1 text-sm font-bold ${s.labelColor}`}>{s.label}</div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}
