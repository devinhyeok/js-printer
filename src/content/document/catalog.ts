import type { CatalogItem } from '../catalog-types'

/**
 * 문서 카탈로그
 * - BookItem: { id: 'folder-name' }  or  { id: 'folder-name', label: '표시 이름' }
 * - FolderItem: { folder: '폴더명', children: [...BookItem] }
 */
export const catalog: CatalogItem[] = [
  {
    folder: '예제',
    children: [{ id: 'demo-doc', label: 'JS Printer 설명서' }],
  },
]
