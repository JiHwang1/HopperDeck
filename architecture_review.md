# HopperDeck Architecture Review

## Current Implementation Overview
HopperDeck은 Rhino Grasshopper 플러그인을 위한 모던 스토어 웹 애플리케이션으로, Next.js 15 (App Router)를 기반으로 구축되었습니다. 디자인은 Raycast Store에서 영감을 받아 미니멀하고 프리미엄한 감성을 지향합니다.

## Layout & Directory Structure
- `src/app/`: Next.js App Router 기반의 경로 정의
  - `layout.tsx`: 전역 레이아웃, 메타데이터 및 글로벌 스타일 적용
  - `page.tsx`: 랜딩 페이지. Tailwind CSS를 사용하여 레이아웃 배치 및 반응형 그리드 구현
  - `globals.css`: HSL 기반 디자인 토큰 및 전역 스타일 정의
- `src/components/`: 재사용 가능한 UI 컴포넌트
  - `UserCard.tsx`: 플러그인 정보를 표시하는 핵심 카드 컴포넌트. CSS Modules 사용
  - `UserCard.module.css`: 카드 전용 스타일링 (Raycast 스타일 호버 및 레이아웃)
- `docs/`: 프로젝트 명세 및 아키텍처 문서
- `wt/`: Multi-Stream 개발을 위한 브랜치별 워크트리 (`feature`, `tests`, `docs`, `integration`)

## Component Design
### UserCard (Atomic Component)
- **Props**: `name`, `author`, `description`, `downloads`, `version`
- **Styling**: 복잡한 인터랙션과 레이아웃 보존을 위해 CSS Modules를 채택하여 Tailwind의 클래스 비대화를 방지하고 스타일 격리(Isolation)를 강화함.
- **Interactions**: Raycast 스타일의 부드러운 호버 효과 및 미니멀한 그림자 적용.

## Design System (v2.6 Specs)
- **Color Palette**: 
  - `--primary`: `#00d084` (Raycast Green)
  - `--background`: `#ffffff`
  - `--foreground`: `#171717`
- **Typography**: Apple System Fonts 기반의 깔끔한 타이포그래피 활용.
- **Spacing**: Tailwind의 유틸리티 클래스를 사용하여 일관된 간격 유지.

## Current Bottlenecks & Recommendations
1. **Consistency**: `globals.css`에 정의된 일부 클래스(`.btn-primary`)가 컴포넌트 내 개별 스타일과 중복되거나 미사용 중인 경우가 있음. 이를 디자인 토큰으로 통합 권장.
2. **Data Fetching**: 현재 목업 데이터를 `page.tsx` 내부에 하드코딩 중. 향후 `lib/api.ts` 등으로 분리하여 비동기 데이터 처리를 준비해야 함.
3. **Agent Integration**: `wt/` 구조를 통한 멀티 스트림 작업이 윈도우 환경에서 안정화되었으므로, 에이전트가 각 브랜치에서 독립적으로 작업을 수행하기 위한 명확한 규칙이 필요함.
