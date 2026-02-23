# TODO

## 완료

### 슬라이드 타입 시스템 + MDX 표준화

DOC과 동일한 아키텍처: 콘텐츠만 쓰면 `type`이 디자인을 결정.

- [x] `SlidePage type` — PowerPoint 표준 8종 구현
  - cover, content, section, two-content, comparison, title-only, blank, caption
- [x] `global.css` — `.slide[data-type]` 기반 타입별 CSS
- [x] `SlideMDXComponents` — 단순화 (인라인 스타일 제거, CSS 위임)
- [x] `demo-slide` — 전체 MDX 전환, 5종 타입 데모
- [x] `SlideViewer` — MDX 우선 로딩

### 컴포넌트 단순화

- [x] `Columns` / `Column` / `SlideHeader` / `SlideFooter` 삭제
- [x] `SlidePage`에 `---` 구분선 기반 자동 컬럼 내장
  - `two-content` / `comparison` → 50:50
  - `caption` → 35:65
- [x] 슬라이드 컴포넌트를 `SlidePage` 하나로 통합

## 미정

- [ ] 슬라이드 위젯 확장 (Grid, Stack 등 필요 시 추가)
