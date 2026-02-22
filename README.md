# JS Printer

MDX 기반 문서 · 프레젠테이션 PDF 제작 도구

React 컴포넌트를 문서 안에 직접 삽입할 수 있어 차트, 표, 수식, 다이어그램 같은 시각 요소를 자유롭게 배치하고, 브라우저 인쇄 기능으로 A4 PDF를 생성합니다.

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

## 프로젝트 구조

```
src/
├── main.tsx                          # 엔트리포인트
├── App.tsx                           # 라우팅 (문서/슬라이드 선택)
├── styles/
│   └── global.css                    # 전역 스타일 (화면/인쇄/A4 가이드)
├── components/
│   ├── layout/
│   │   ├── DocLayout.tsx             # 문서 레이아웃 (paged.js + react-to-print)
│   │   ├── DocPage.tsx               # A4 페이지 단위 (cover/toc/content)
│   │   ├── DocMDXComponents.tsx      # 문서용 MDX 컴포넌트 맵핑
│   │   ├── SlideLayout.tsx           # 슬라이드 레이아웃
│   │   ├── SlidePage.tsx             # 슬라이드 페이지 단위
│   │   ├── SlideMDXComponents.tsx    # 슬라이드용 MDX 컴포넌트 맵핑
│   │   └── ViewerShell.tsx           # 공통 뷰어 (목차, 콘텐츠선택, PDF버튼)
│   ├── widgets/
│   │   ├── Callout.tsx               # :::note, :::warning 등 콜아웃
│   │   ├── ChartSection.tsx          # 꺾은선 차트 (Recharts)
│   │   ├── FolderTree.tsx            # 폴더 구조 트리
│   │   ├── KPISection.tsx            # KPI 카드
│   │   ├── MermaidDiagram.tsx        # Mermaid 다이어그램
│   │   └── QRCode.tsx                # QR 코드
│   └── ui/
│       ├── BookSwitcher.tsx          # 콘텐츠 선택 UI
│       └── FloatingNav.tsx           # 플로팅 목차
├── views/
│   ├── ContentSelector.tsx           # 콘텐츠 선택 화면
│   ├── DocViewer.tsx                 # 문서 뷰어
│   └── SlideViewer.tsx               # 슬라이드 뷰어
└── content/
    ├── catalog-types.ts              # 카탈로그 타입 정의
    ├── document/
    │   ├── catalog.ts                # 문서 카탈로그
    │   └── demo-book/                # 예제 문서
    │       ├── index.mdx             # 콘텐츠 전체 조립
    │       ├── cover.mdx             # 표지
    │       ├── intro.mdx             # 소개
    │       ├── theme.tsx             # 콘텐츠별 커스텀 스타일
    │       ├── chapter01/
    │       │   ├── index.mdx
    │       │   ├── section01.mdx
    │       │   └── section02.mdx
    │       └── chapter02/
    │           ├── index.mdx
    │           ├── section01.mdx
    │           └── section02.mdx
    └── presentation/
        ├── catalog.ts                # 프레젠테이션 카탈로그
        └── demo-slide/               # 예제 슬라이드
            ├── index.mdx
            ├── cover.tsx
            ├── slide01.mdx
            ├── slide02.mdx
            └── slide03.mdx
```

## 콘텐츠 작성

### 새 콘텐츠 만들기

1. `src/content/document/` 아래에 폴더를 생성합니다.

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

2. **카탈로그에 등록**해야 선택 목록에 나타납니다.

```ts
// src/content/document/catalog.ts
import type { CatalogItem } from '../catalog-types'

export const catalog: CatalogItem[] = [
  // 폴더 없이 등록 → 최상단에 바로 표시
  { id: 'my-book', label: '내 문서' },

  // 폴더로 그룹핑 → 접을 수 있는 트리 구조
  {
    folder: '예제',
    children: [{ id: 'demo-book', label: 'JS Printer 설명서' }],
  },
]
```

프레젠테이션도 동일하게 `src/content/presentation/catalog.ts`에 등록합니다.

- `id`는 콘텐츠 폴더명과 일치해야 합니다.
- `label`은 선택 목록에 표시될 이름입니다 (생략 시 `id`가 표시됨).
- **배열 순서 = 표시 순서**입니다. 순서를 바꾸려면 배열 안에서 위치를 옮기면 됩니다.

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

### 페이지 단위 작성

`<DocPage>` 블록 하나가 A4 한 페이지로 렌더링됩니다.

```mdx
<DocPage>

## 제목

본문 내용을 작성합니다.

</DocPage>
```

> h2 제목에 순서 번호를 붙이지 않습니다. 목차(`<DocPage type="toc">`)가 h2를 자동 수집하면서 `01.`, `02.` 챕터 인덱스를 자동으로 부여합니다.

### 콘텐츠별 스타일 커스터마이징

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

## PDF 출력 워크플로우

### 아키텍처

```
┌─────────────────────┐     ┌──────────────────────┐
│    웹 미리보기       │     │     PDF 인쇄          │
│                     │     │                      │
│  Paged.js가 콘텐츠를 │     │  react-to-print이     │
│  A4 카드로 자동 분할  │     │  원본 콘텐츠를 별도    │
│  + 페이지 번호 렌더링 │     │  iframe에서 인쇄      │
└─────────────────────┘     └──────────────────────┘
```

- **웹 미리보기**: Paged.js가 `public/pagedjs-doc.css`의 `@page` 규칙을 읽고 콘텐츠를 A4 카드로 자동 분할합니다. 하단에 페이지 번호도 표시됩니다.
- **PDF 인쇄**: `react-to-print`이 원본 콘텐츠를 격리된 iframe에 복사하고, 인쇄 전용 CSS(`@page`, `break-inside: avoid` 등)를 주입하여 브라우저 인쇄 엔진으로 깔끔하게 출력합니다.

### 인쇄(PDF 저장) 방법

1. 개발 서버를 실행하고 문서를 선택합니다.
2. 우측 하단의 **PDF 저장** 버튼을 클릭합니다.
3. 인쇄 대화상자에서 다음을 설정합니다:
   - **대상**: PDF로 저장
   - **여백**: `없음`
   - **배경 그래픽**: 체크

### 수동 페이지 브레이크

웹 미리보기에서 각 DocPage에 **빨간 점선**이 297mm(A4 높이) 간격으로 표시됩니다.

1. 웹 미리보기에서 콘텐츠가 점선을 넘어가는 곳을 확인합니다.
2. 해당 위치의 MDX에 페이지 브레이크를 삽입합니다:

```mdx
<div className="page-break-before" />
```

3. 각 `<DocPage>`는 인쇄 시 자동으로 새 페이지에서 시작하므로, `page-break-before`는 **같은 DocPage 안에서** 수동으로 끊고 싶을 때만 사용합니다.

> **참고**: 브라우저 인쇄 엔진의 한계로 오버플로 콘텐츠가 다음 페이지에 넘어갈 때 상단 여백이 없을 수 있습니다. 점선 가이드를 보면서 콘텐츠가 넘치기 전에 페이지 브레이크를 삽입하는 것을 권장합니다.

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

## 라이선스

MIT
