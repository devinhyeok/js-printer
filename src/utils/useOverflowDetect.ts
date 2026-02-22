import { useEffect, type RefObject } from 'react'

/**
 * min-height 기준으로 콘텐츠 오버플로우를 감지하여
 * data-overflow 속성을 토글한다. (doc / slide 공용)
 */
export function useOverflowDetect(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => {
      const minH = parseFloat(getComputedStyle(el).minHeight)
      if (Number.isNaN(minH) || minH === 0) return
      if (el.scrollHeight > minH + 2) {
        el.setAttribute('data-overflow', '')
      } else {
        el.removeAttribute('data-overflow')
      }
    }

    const timer = setTimeout(check, 200)
    const observer = new ResizeObserver(check)
    observer.observe(el)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [ref])
}
