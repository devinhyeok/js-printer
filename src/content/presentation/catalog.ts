import type { CatalogItem } from '../catalog-types'

/**
 * 프레젠테이션 카탈로그
 * - BookItem: { id: 'folder-name' }  or  { id: 'folder-name', label: '표시 이름' }
 * - FolderItem: { folder: '폴더명', children: [...BookItem] }
 */
export const catalog: CatalogItem[] = [
  {
    folder: '예제',
    children: [{ id: 'demo-slide', label: 'JS Printer 슬라이드' }],
  },
]
