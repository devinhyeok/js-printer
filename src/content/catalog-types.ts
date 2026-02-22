export interface BookItem {
  id: string
  label?: string
}

export interface FolderItem {
  folder: string
  children: BookItem[]
}

export type CatalogItem = BookItem | FolderItem

export function isFolder(item: CatalogItem): item is FolderItem {
  return 'folder' in item
}
