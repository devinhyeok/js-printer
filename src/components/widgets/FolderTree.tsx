import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  FileIcon,
  FolderIcon,
  DefaultFolderOpenedIcon,
} from '@react-symbols/icons/utils'

interface TreeNode {
  name: string
  type: 'file' | 'folder'
  note?: string
  children?: TreeNode[]
}

interface FolderTreeProps {
  items: TreeNode[]
}

function TreeItem({ node }: { node: TreeNode }) {
  const isFolder = node.type === 'folder'
  const hasChildren = isFolder && node.children && node.children.length > 0

  return (
    <div>
      <div className="flex items-center py-[3px]">
        {isFolder ? (
          <>
            {hasChildren ? (
              <ChevronDown size={14} className="shrink-0 mr-1 text-gray-500" />
            ) : (
              <ChevronRight size={14} className="shrink-0 mr-1 text-gray-400" />
            )}
            {hasChildren ? (
              <DefaultFolderOpenedIcon
                width={15}
                height={15}
                className="shrink-0 mr-1.5"
              />
            ) : (
              <FolderIcon
                folderName={node.name}
                width={15}
                height={15}
                className="shrink-0 mr-1.5"
              />
            )}
          </>
        ) : (
          <>
            <span className="shrink-0 mr-1" style={{ width: 14 }} />
            <FileIcon
              fileName={node.name}
              autoAssign={true}
              width={15}
              height={15}
              className="shrink-0 mr-1.5"
            />
          </>
        )}

        <span
          className="text-sm text-gray-700"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          {node.name}
        </span>

        {node.note && (
          <span
            className="ml-3 text-xs text-gray-400"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            {node.note}
          </span>
        )}
      </div>

      {hasChildren && (
        <div
          style={{
            marginLeft: 7,
            paddingLeft: 14,
            borderLeft: '1px solid #e5e7eb',
          }}
        >
          {node.children!.map((child, i) => (
            <TreeItem key={i} node={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderTree({ items }: FolderTreeProps) {
  return (
    <div className="no-break my-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
      {items.map((item, i) => (
        <TreeItem key={i} node={item} />
      ))}
    </div>
  )
}
