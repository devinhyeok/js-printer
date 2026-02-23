## 프로젝트 구조

```
src/
├── main.tsx                          # 엔트리포인트
├── App.tsx                           # 라우팅 (문서/슬라이드 선택)
├── styles/
│   └── global.css                    # 전역 스타일 (화면/인쇄/A4 가이드)
├── components/
│   ├── layout/
│   │   ├── ViewerShell.tsx           # 공통 뷰어 (react-to-print, 목차, PDF버튼)
│   │   ├── DocLayout.tsx             # 문서 레이아웃 (paged.js 웹 미리보기)
│   │   ├── DocPage.tsx               # A4 페이지 단위 (cover/toc/content)
│   │   ├── DocMDXComponents.tsx      # 문서용 MDX 컴포넌트 맵핑
│   │   ├── SlideLayout.tsx           # 슬라이드 레이아웃 (래퍼)
│   │   ├── SlidePage.tsx             # 슬라이드 페이지 단위
│   │   └── SlideMDXComponents.tsx    # 슬라이드용 MDX 컴포넌트 맵핑
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

## DOC vs Slide

### 페이지네이션 모델

DOC와 Slide는 사이즈만 다른 것이 아니라 페이지네이션 모델 자체가 다릅니다.

#### DOC — 콘텐츠 흐름 기반

- 하나의 긴 콘텐츠가 A4 여러 장으로 자동 분할되어야 합니다.
- 테이블이 페이지 경계에서 잘리면 안 되고, 제목 바로 뒤에 페이지가 끊기면 안 됩니다.
- 이 문제를 해결하는 것이 `pagedjs`입니다. 콘텐츠 흐름을 페이지 단위로 나눠주는 CSS Paged Media 엔진입니다.
- `pagedjs`는 웹 미리보기 전용이고, 실제 PDF 출력은 `react-to-print`이 담당합니다.

#### Slide — 고정 페이지 기반

- MDX 컴포넌트 1개가 슬라이드 1장입니다. 이미 나뉘어져 있습니다.
- 콘텐츠 흐름이 없으므로 `pagedjs`가 필요 없습니다.
- PDF 출력만 `react-to-print`으로 처리합니다.

> `pagedjs`는 DOC 전용입니다. 이 차이는 페이지네이션 모델 자체가 다르기 때문입니다.

### 컴포넌트 구조

```
App
├── ViewerShell (type="doc" | "slide")
│   ├── react-to-print ← DOC/Slide 공통 인쇄 로직
│   ├── pageStyle 분기 ← A4 vs 254×143mm
│   ├── 페이지 번호 토글 ← DOC에서만 표시
│   │
│   ├── DocViewer → DocLayout (pagedjs 웹 미리보기)
│   │   ├── sourceRef ← 원본 콘텐츠 (화면에서 숨김, 인쇄 시 사용)
│   │   └── targetRef ← pagedjs가 렌더링한 미리보기 (화면 표시용)
│   │
│   └── SlideViewer → SlideLayout (단순 래퍼)
│       └── slide-wrapper ← 슬라이드 목록
```

### 인쇄 흐름

`ViewerShell`이 `react-to-print`을 공통으로 관리합니다.

|                  | DOC                       | Slide            |
| ---------------- | ------------------------- | ---------------- |
| `@page` 크기     | A4 (210×297mm)            | 254×143mm (16:9) |
| 페이지 번호      | 있음 (토글 가능)          | 없음             |
| 인쇄 대상        | `sourceRef` (원본 콘텐츠) | `slide-wrapper`  |
| pagedjs 미리보기 | `.doc-preview`로 숨김     | 해당 없음        |

### 웹 미리보기

- DOC: `pagedjs Previewer`가 원본 콘텐츠를 읽어 `@page` 규칙에 따라 페이지를 나눠 `targetRef`에 렌더링합니다. 원본(`sourceRef`)은 화면에서 숨기고, 인쇄 시에만 사용합니다.
- Slide: 별도 미리보기 없이 MDX 컴포넌트가 바로 슬라이드로 렌더링됩니다.

### 인쇄 스타일 구조

| 경로                         | 용도                                                  |
| ---------------------------- | ----------------------------------------------------- |
| `ViewerShell` 내 `pageStyle` | `react-to-print` iframe 안에서 적용 (`PDF 저장` 버튼) |
| `global.css` `@media print`  | 브라우저 `Ctrl+P` 직접 인쇄 시 fallback               |

두 경로가 공존하며, `react-to-print`의 `pageStyle`이 iframe 내에서 우선 적용됩니다.

## PDF 출력 아키텍처

```
┌─────────────────────┐     ┌──────────────────────┐
│    웹 미리보기       │     │     PDF 인쇄          │
│                     │     │                      │
│  Paged.js가 콘텐츠를 │     │  react-to-print이     │
│  A4 카드로 자동 분할  │     │  원본 콘텐츠를 별도    │
│  + 페이지 번호 렌더링 │     │  iframe에서 인쇄      │
└─────────────────────┘     └──────────────────────┘
```

- 웹 미리보기: `Paged.js`가 `public/pagedjs-doc.css`의 `@page` 규칙을 읽고 콘텐츠를 A4 카드로 자동 분할합니다. 하단에 페이지 번호도 표시됩니다.
- PDF 인쇄: `react-to-print`이 원본 콘텐츠를 격리된 iframe에 복사하고, 인쇄 전용 CSS(`@page`, `break-inside: avoid` 등)를 주입하여 브라우저 인쇄 엔진으로 출력합니다.
