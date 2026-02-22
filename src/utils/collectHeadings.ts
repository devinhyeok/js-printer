export interface RawHeading {
  text: string
  tag: 'H2' | 'H3'
  page: number
  el: Element
}

/**
 * .doc-wrapper .doc 또는 .slide-wrapper .slide 내부의 h2/h3 헤딩을
 * 페이지 순서대로 수집한다. selfEl을 넘기면 해당 요소(TOC 페이지)는 건너뛴다.
 */
export function collectHeadings(
  selector: string,
  selfEl?: Element | null,
): RawHeading[] {
  const pages = Array.from(document.querySelectorAll(selector))
  const result: RawHeading[] = []

  pages.forEach((pageEl, pageIdx) => {
    if (selfEl && pageEl === selfEl) return
    const pageNum = pageIdx + 1
    pageEl.querySelectorAll('h2, h3').forEach((el) => {
      result.push({
        text: el.textContent ?? '',
        tag: el.tagName as 'H2' | 'H3',
        page: pageNum,
        el,
      })
    })
  })

  return result
}
