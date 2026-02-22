import type { CatalogItem } from '../catalog-types'

/**
 * 프레젠테이션 카탈로그
 * - BookItem: { id: 'folder-name' }  or  { id: 'folder-name', label: '표시 이름' }
 * - FolderItem: { folder: '폴더명', children: [...BookItem] }
 */
export const catalog: CatalogItem[] = [
  { id: 'demo-slide', label: '최상단 슬라이드 (폴더 없음)' },
  {
    folder: '예제',
    children: [
      { id: 'demo-slide', label: 'JS Printer 슬라이드' },
      { id: 'demo-slide', label: '두 번째 항목' },
    ],
  },
  {
    folder: '마케팅',
    children: [
      { id: 'demo-slide', label: '2026 상반기 리뷰' },
      { id: 'demo-slide', label: '신제품 런칭' },
      { id: 'demo-slide', label: '고객 분석 보고' },
    ],
  },
  { id: 'demo-slide', label: '중간 단독 항목' },
  {
    folder: '기술팀',
    children: [{ id: 'demo-slide', label: '아키텍처 개요' }],
  },
  {
    folder: '빈 폴더 테스트',
    children: [],
  },
  { id: 'demo-slide', label: '마지막 단독 항목' },
]
