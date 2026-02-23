## 개요

MDX 기반 문서 · 프레젠테이션 PDF 제작 도구입니다.

React 컴포넌트를 문서 안에 직접 삽입할 수 있어 차트, 표, 수식, 다이어그램 같은 시각 요소를 자유롭게 배치하고, 브라우저 인쇄 기능으로 PDF를 생성합니다.

## 시작하기

```bash
# 설치
pnpm install

# 개발 서버
pnpm dev
```

`http://localhost:5173`에서 확인합니다.

## 기술 스택

| 역할                     | 기술                                              |
| ------------------------ | ------------------------------------------------- |
| UI                       | React 19 + TypeScript                             |
| 빌드                     | Vite 6                                            |
| 스타일                   | Tailwind CSS v4                                   |
| 콘텐츠                   | MDX + remark-gfm + remark-math + remark-directive |
| 코드 하이라이팅          | Shiki (rehype-pretty-code)                        |
| 차트                     | Recharts                                          |
| 다이어그램               | Mermaid                                           |
| 수식                     | MathJax (rehype-mathjax)                          |
| QR 코드                  | qrcode.react                                      |
| 웹 미리보기 페이지네이션 | Paged.js                                          |
| PDF 인쇄                 | react-to-print                                    |

## 콘텐츠 작성

### 새 콘텐츠 만들기

`src/content/document/` 아래에 폴더를 생성합니다.

```
src/content/document/my-book/
├── index.mdx          # 콘텐츠 전체 조립 (import 순서 = 페이지 순서)
├── cover.mdx          # 표지
├── theme.tsx          # (선택) 이 콘텐츠만의 커스텀 스타일
├── intro.mdx
└── chapter01/
    ├── index.mdx      # 챕터 조립
    └── section01.mdx
```

### 카탈로그 등록

카탈로그에 등록해야 선택 목록에 나타납니다.

```ts
// src/content/document/catalog.ts
import type { CatalogItem } from '../catalog-types'

export const catalog: CatalogItem[] = [
  // 폴더 없이 등록 → 최상단에 바로 표시
  { id: 'my-book', label: '내 문서' },

  // 폴더로 그룹핑 → 접을 수 있는 트리 구조
  {
    folder: '예제',
    children: [{ id: 'demo-doc', label: 'JS Printer 설명서' }],
  },
]
```

프레젠테이션도 동일하게 `src/content/presentation/catalog.ts`에 등록합니다.

- `id`는 콘텐츠 폴더명과 일치해야 합니다.
- `label`은 선택 목록에 표시될 이름입니다. 생략 시 `id`가 표시됩니다.
- 배열 순서가 표시 순서입니다. 순서를 바꾸려면 배열 안에서 위치를 옮깁니다.

```ts
// catalog-types.ts 타입 참고
interface BookItem {
  id: string
  label?: string
} // 폴더 없이 단독 등록
interface FolderItem {
  folder: string
  children: BookItem[]
} // 그룹핑
type CatalogItem = BookItem | FolderItem
```

### 페이지 작성

`<DocPage>` 블록 하나가 A4 한 페이지로 렌더링됩니다.

```mdx
<DocPage>

## 제목

본문 내용을 작성합니다.

</DocPage>
```

> h2 제목에 순서 번호를 붙이지 않습니다. 목차(`<DocPage type="toc">`)가 h2를 자동 수집하면서 챕터 인덱스를 자동으로 부여합니다.

### 스타일 커스터마이징

`theme.tsx`가 있으면 해당 콘텐츠에만 커스텀 MDX 컴포넌트가 적용됩니다. 없으면 기본 스타일이 사용됩니다.

```tsx
// theme.tsx
import { docMDXComponents } from '../../../components/layout/DocMDXComponents'

export const mdxComponents = {
  ...docMDXComponents,
  h2: ({ children }) => <h2 style={{ color: '#7c3aed' }}>{children}</h2>,
}
```

### 사용 가능한 컴포넌트

| 컴포넌트                 | 설명           | 사용법                                                   |
| ------------------------ | -------------- | -------------------------------------------------------- |
| `<DocPage>`              | A4 페이지 단위 | `<DocPage>내용</DocPage>`                                |
| `<DocPage type="cover">` | 표지 페이지    | `<DocPage type="cover">`                                 |
| `<DocPage type="toc">`   | 목차 페이지    | `<DocPage type="toc"><TOC items={[...]} />`              |
| `<KPISection>`           | KPI 카드       | `<KPISection items={[{ label, value, unit }]} />`        |
| `<ChartSection>`         | 꺾은선 차트    | `<ChartSection title="제목" data={[{ name, value }]} />` |
| `<QRCode>`               | QR 코드        | `<QRCode value="https://..." caption="설명" />`          |
| `:::note`                | 참고 콜아웃    | `:::note\n내용\n:::`                                     |
| `:::warning`             | 경고 콜아웃    | `:::warning\n내용\n:::`                                  |
| `:::tip`                 | 팁 콜아웃      | `:::tip\n내용\n:::`                                      |
| `:::important`           | 중요 콜아웃    | `:::important\n내용\n:::`                                |

## PDF 저장

### 저장 방법

1. 개발 서버를 실행하고 문서를 선택합니다.
2. 우측 하단의 `PDF 저장` 버튼을 클릭합니다.
3. 인쇄 대화상자에서 다음을 설정합니다:
   - `대상`: PDF로 저장
   - `여백`: 없음
   - `배경 그래픽`: 체크

### 페이지 브레이크

웹 미리보기에서 각 DocPage에 빨간 점선이 297mm(A4 높이) 간격으로 표시됩니다.

1. 웹 미리보기에서 콘텐츠가 점선을 넘어가는 곳을 확인합니다.
2. 해당 위치의 MDX에 페이지 브레이크를 삽입합니다:

```mdx
<div className="page-break-before" />
```

3. 각 `<DocPage>`는 인쇄 시 자동으로 새 페이지에서 시작하므로, `page-break-before`는 같은 DocPage 안에서 수동으로 끊고 싶을 때만 사용합니다.

> 브라우저 인쇄 엔진의 한계로 오버플로 콘텐츠가 다음 페이지에 넘어갈 때 상단 여백이 없을 수 있습니다. 점선 가이드를 보면서 콘텐츠가 넘치기 전에 페이지 브레이크를 삽입하는 것을 권장합니다.

### 자동 분할 제어

인쇄 시 다음 요소들은 자동으로 페이지 경계에서 잘리지 않습니다:

- `pre` (코드 블록)
- `table` (표)
- `img`, `svg` (이미지)
- `figure` (피겨)
- `mjx-container` (수식)
- `[data-rehype-pretty-code-figure]` (코드 블록)
- `.no-break` 클래스가 적용된 요소

제목(`h1`~`h6`)은 페이지 하단에 단독으로 남지 않도록 `break-after: avoid`가 적용됩니다.

## 스크립트

```bash
pnpm dev       # 개발 서버 (http://localhost:5173)
pnpm build     # TypeScript 컴파일 + Vite 빌드
pnpm preview   # 빌드 결과 미리보기
```
