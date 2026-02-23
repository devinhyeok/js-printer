## 프로젝트 구조

```
src/
├── main.tsx                          # 엔트리포인트 (BrowserRouter 래핑)
├── App.tsx                           # React Router 라우트 정의
├── styles/
│   └── global.css                    # 전역 스타일 (화면/인쇄/슬라이드 타이포)
├── stores/
│   └── useAppStore.ts                # Zustand + Immer 전역 스토어
├── lib/
│   └── schemas.ts                    # Zod 스키마 유틸리티
├── components/
│   ├── layout/
│   │   ├── ViewerShell.tsx           # 공통 뷰어 (react-to-print, 홈·줌·PDF 버튼)
│   │   ├── DocLayout.tsx             # 문서 레이아웃 (paged.js 웹 미리보기)
│   │   ├── DocPage.tsx               # A4 페이지 단위 (cover/toc/content)
│   │   ├── DocMDXComponents.tsx      # 문서용 MDX 컴포넌트 맵핑
│   │   ├── SlideLayout.tsx           # 슬라이드 레이아웃 (래퍼)
│   │   ├── SlidePage.tsx             # 슬라이드 캔버스 (bg/layout/padding)
│   │   └── SlideMDXComponents.tsx    # 슬라이드용 MDX 컴포넌트 맵핑
│   ├── widgets/
│   │   ├── Callout.tsx               # :::note, :::warning 등 콜아웃
│   │   ├── ChartSection.tsx          # 꺾은선 차트 (Recharts)
│   │   ├── FolderTree.tsx            # 폴더 구조 트리
│   │   ├── KPISection.tsx            # KPI 카드
│   │   ├── MermaidDiagram.tsx        # Mermaid 다이어그램
│   │   └── QRCode.tsx                # QR 코드
│   └── ui/
│       ├── BookSwitcher.tsx          # 콘텐츠 선택 사이드바 (useNavigate + 스토어)
│       └── FloatingNav.tsx           # 플로팅 목차 (useLocation 기반 갱신)
├── views/
│   ├── ContentSelector.tsx           # 콘텐츠 선택 화면
│   ├── DocViewer.tsx                 # 문서 뷰어 (useParams로 docId 취득)
│   └── SlideViewer.tsx               # 슬라이드 뷰어 (useParams로 slideId 취득)
└── content/
    ├── catalog-types.ts              # 카탈로그 타입 정의
    ├── document/
    │   ├── catalog.ts                # 문서 카탈로그
    │   └── demo-doc/                 # 예제 문서
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
            ├── index.mdx             # 슬라이드 조립 (엔트리)
            ├── cover.mdx             # 표지 (type="cover")
            ├── slide01.mdx           # 기능 소개 (type="content")
            ├── slide02.mdx           # DOC vs Slide (type="comparison")
            ├── slide03.mdx           # 폴더 구조 (type="two-content")
            ├── slide04.mdx           # 타입 시스템 (type="caption")
            └── slide05.mdx           # 마무리 (type="section")
```

## 기술 스택

| 카테고리    | 라이브러리                        | 역할                                    |
| ----------- | --------------------------------- | --------------------------------------- |
| 전역 상태   | Zustand + Immer 미들웨어          | showPageNum, sidebarOpen 등 공유 상태   |
| 라우팅      | React Router v7 (라이브러리 모드) | 경로 기반 내비게이션, Next.js 전환 대비 |
| 폼          | React Hook Form + Zod             | 향후 설정/입력 폼 유효성 검증용         |
| 스타일      | Tailwind CSS v4                   | 유틸리티 기반 스타일링                  |
| 차트        | Recharts                          | 꺾은선/막대 차트                        |
| PDF 출력    | react-to-print                    | 브라우저 인쇄 엔진 기반 PDF 생성        |
| 웹 미리보기 | paged.js                          | DOC 전용 A4 페이지 분할                 |
| 다이어그램  | Mermaid                           | 플로차트, 시퀀스 다이어그램 등          |

## 라우팅

React Router v7 라이브러리 모드를 사용합니다.

| 경로              | 컴포넌트                      | 설명             |
| ----------------- | ----------------------------- | ---------------- |
| `/`               | `ContentSelector`             | 콘텐츠 선택 화면 |
| `/doc/:docId`     | `ViewerShell` → `DocViewer`   | 문서 뷰어        |
| `/slide/:slideId` | `ViewerShell` → `SlideViewer` | 슬라이드 뷰어    |

`main.tsx`에서 `BrowserRouter`로 래핑하고, `App.tsx`에서 `Routes`/`Route`로 선언합니다.

## 전역 상태 (Zustand)

`src/stores/useAppStore.ts`에서 Immer 미들웨어와 함께 관리합니다.

| 상태                 | 사용 위치    | 설명                      |
| -------------------- | ------------ | ------------------------- |
| `viewer.showPageNum` | ViewerShell  | DOC 페이지 번호 토글      |
| `ui.sidebarOpen`     | BookSwitcher | 콘텐츠 사이드바 열림/닫힘 |

## DOC vs Slide

### 입력 포맷

DOC과 Slide 모두 **MDX**로 콘텐츠를 작성합니다. 동일한 렌더링 파이프라인을 공유하며, 스타일만 다릅니다.

|        | DOC (문서)       | Slide (프레젠테이션) |
| ------ | ---------------- | -------------------- |
| 입력   | **MDX**          | **MDX**              |
| 스타일 | DocMDXComponents | CSS `data-type` 자동 |
| 크기   | A4 (210×297mm)   | 16:9 (254×143mm)     |

- DOC: MDX 컴포넌트 맵핑으로 타이포그래피 적용
- Slide: `SlidePage type`이 CSS를 통해 자동 스타일링 (인라인 스타일 불필요)

### 페이지네이션 모델

DOC와 Slide는 사이즈만 다른 것이 아니라 페이지네이션 모델 자체가 다릅니다.

#### DOC — 콘텐츠 흐름 기반

- 하나의 긴 콘텐츠가 A4 여러 장으로 자동 분할되어야 합니다.
- 테이블이 페이지 경계에서 잘리면 안 되고, 제목 바로 뒤에 페이지가 끊기면 안 됩니다.
- 이 문제를 해결하는 것이 `pagedjs`입니다. 콘텐츠 흐름을 페이지 단위로 나눠주는 CSS Paged Media 엔진입니다.
- `pagedjs`는 웹 미리보기 전용이고, 실제 PDF 출력은 `react-to-print`이 담당합니다.

#### Slide — 고정 페이지 기반

- `SlidePage` 컴포넌트 1개가 슬라이드 1장입니다. 이미 나뉘어져 있습니다.
- 콘텐츠 흐름이 없으므로 `pagedjs`가 필요 없습니다.
- PDF 출력만 `react-to-print`으로 처리합니다.

> `pagedjs`는 DOC 전용입니다. 이 차이는 페이지네이션 모델 자체가 다르기 때문입니다.

### 슬라이드 타입 시스템

`SlidePage type`이 레이아웃 · 배경 · 타이포그래피를 자동으로 결정합니다.
콘텐츠 작성자는 `type`만 지정하면 되고, 인라인 스타일이 필요 없습니다.

```mdx
<SlidePage type="cover">
  # JS Printer ## 문서 · 프레젠테이션 PDF 제작 도구
</SlidePage>

<SlidePage type="comparison">
  ## 문서 vs 프레젠테이션 ### Document - 입력: MDX - 크기: A4 --- ###
  Presentation - 입력: MDX - 크기: 16:9
</SlidePage>
```

구조형 타입(`two-content`, `comparison`, `caption`)에서 `---`(구분선)이 자동 컬럼 분리를 합니다. 별도 컴포넌트 없이 `type`과 `---`만으로 레이아웃이 완성됩니다.

PowerPoint 표준 8종을 기반으로 한 타입 시스템:

| 타입             | PPT 대응             | 배경              | 레이아웃                  | 용도          |
| ---------------- | -------------------- | ----------------- | ------------------------- | ------------- |
| `cover`          | Title Slide          | 다크 그라데이션   | 중앙 정렬                 | 표지          |
| `content` (기본) | Title and Content    | 흰색              | 좌상단 흐름               | 일반 콘텐츠   |
| `section`        | Section Header       | 인디고 그라데이션 | 중앙 정렬                 | 섹션 구분     |
| `two-content`    | Two Content          | 흰색              | `---`로 50:50 자동 분할   | 좌우 2단      |
| `comparison`     | Comparison           | 흰색              | `---`로 50:50 + h3 악센트 | 좌우 비교     |
| `title-only`     | Title Only           | 흰색              | 큰 제목 + 자유            | 제목만        |
| `blank`          | Blank                | 흰색              | 자유 배치                 | 빈 캔버스     |
| `caption`        | Content with Caption | 흰색              | `---`로 35:65 자동 분할   | 캡션 + 콘텐츠 |

슬라이드 컴포넌트는 `SlidePage` 하나뿐입니다.

타이포그래피(`h1`~`h3`, `ul`, `table` 등)는 `global.css`의 `.slide[data-type]` CSS로 자동 처리됩니다.
MDX에서 `# 제목`, `- 항목` 같이 마크다운만 쓰면 타입에 맞는 스타일이 자동 적용됩니다.

### 컴포넌트 구조

```
BrowserRouter
└── App (Routes)
    ├── / → ContentSelector
    ├── /doc/:docId → ViewerShell (type="doc")
    │   ├── BookSwitcher (useNavigate + useAppStore)
    │   ├── FloatingNav (useLocation 기반 헤딩 갱신)
    │   ├── 홈 버튼 → navigate('/')
    │   ├── 줌 컨트롤 (확대/축소/초기화/맞춤)
    │   ├── 페이지 번호 토글 (useAppStore)
    │   ├── PDF 저장 (react-to-print)
    │   └── DocViewer (useParams) → DocLayout (pagedjs 웹 미리보기)
    │       ├── sourceRef ← 원본 콘텐츠 (화면에서 숨김, 인쇄 시 사용)
    │       └── targetRef ← pagedjs가 렌더링한 미리보기 (화면 표시용)
    └── /slide/:slideId → ViewerShell (type="slide")
        ├── BookSwitcher, FloatingNav, 홈, 줌, PDF (위와 동일)
        └── SlideViewer (useParams) → SlideLayout (단순 래퍼)
            └── slide-wrapper ← MDX 슬라이드 목록
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
