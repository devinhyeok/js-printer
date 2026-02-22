---
title: JS Printer 프로젝트
tags: [프로젝트, 개요, 문서]
---

## 프로젝트 개요

이 프로젝트는 복잡도를 최소화한 문서 출력용 웹 애플리케이션입니다. React와 Tailwind CSS를 기반으로 구축하며, 브라우저의 기본 인쇄 기능을 활용하여 A4 PDF를 생성하는 것을 목표로 합니다.

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### PDF 저장

개발 서버 실행 후 책을 선택하면 우측 하단에 "PDF 저장" 버튼이 표시됩니다. 버튼을 클릭하면 브라우저 인쇄 화면이 열리며, 대상을 "PDF로 저장"으로 선택하면 A4 PDF로 저장됩니다.

## 기술 스택

- UI 라이브러리: React를 사용합니다.
- 빌드 도구: Vite를 사용합니다.
- 패키지 매니저: pnpm을 사용합니다.
- 언어: 애플리케이션 코드는 전부 TypeScript로 작성합니다.
- 스타일링: Tailwind CSS v4를 적용합니다.
- 차트 도구: Recharts를 사용합니다.
- 콘텐츠: MDX로 작성하며 `remark-gfm`으로 표(table)를 지원합니다.

## 시스템 아키텍처

기본적인 프론트엔드 기술 스택에 출력용 CSS를 더한 단순한 구조로 설계되었습니다.

### 인쇄 전용 스타일

전역 CSS에 인쇄 규칙을 선언하여 브라우저 인쇄만으로 A4 출력이 가능하도록 구성합니다.

- 페이지 설정: `@page` 규칙으로 A4 크기와 여백을 지정합니다.
- 페이지 나눔: `.page + .page { break-before: page }` 로 각 `.page` 블록이 새 페이지에서 시작합니다.
- 보조 규칙: 필요한 최소 범위에서만 `@media print` CSS를 함께 사용합니다.

### 데이터 관리 구조

콘텐츠는 MDX 파일로 관리합니다. MDX는 Markdown 안에 React 컴포넌트를 직접 삽입할 수 있어 글과 시각 요소를 함께 작성하기에 적합합니다.

- 책 단위: `src/content/` 아래 책 이름으로 폴더를 생성합니다.
- 조립 파일: 각 책 폴더의 `index.mdx`가 하위 파일을 `import`로 조립하여 순서를 정의합니다.
- 계층 구조: 챕터 폴더 안에 섹션 파일을 두고, 챕터 `index.mdx`가 섹션을 조립합니다.
- 컴포넌트 삽입: MDX 파일 안에서 `<ChartSection />`, `<KPISection />` 등을 직접 사용합니다.
- 페이지 단위: `<div className="page">` 로 감싼 블록이 A4 한 페이지로 렌더링됩니다.

### 폴더 구조

`src/content/` 아래에 책 이름으로 폴더를 생성합니다. 폴더를 추가하면 자동으로 책 선택 목록에 표시됩니다.

```
src/content/
└── 책이름/
    ├── index.mdx          (책 전체 조립, 포함할 파일을 import로 나열)
    ├── components.tsx     (선택, 이 책만의 커스텀 컴포넌트 스타일)
    ├── intro.mdx
    ├── chapter01/
    │   ├── index.mdx      (챕터 조립)
    │   ├── section01.mdx
    │   └── section02.mdx
    └── chapter02/
        └── index.mdx
```

`components.tsx`가 없으면 `src/components/mdx/MDXComponents.tsx`의 기본 스타일이 적용됩니다. 있으면 기본 컴포넌트를 상속한 뒤 필요한 요소만 덮어씁니다.
