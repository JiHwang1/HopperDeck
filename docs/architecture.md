# HopperDeck Architecture

## Overview
HopperDeck is a modern store for Rhino Grasshopper plugins, inspired by the minimalist and efficient design of the Raycast Store.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS Modules (Core UI) + Tailwind CSS (Layout/Utilities)
- **Language**: TypeScript
- **Testing**: Playwright (E2E)
- **Infrastructure**: Codex Farm (Distributed Development System)

## Design Principles
1. **Minimalism**: Focus on content and action. High contrast, clear typography.
2. **Speed**: Instant search, fluid transitions, and fast page loads.
3. **Accessibility**: Full keyboard support and screen reader optimization.

## Component Structure
- `src/app`: Routes and Page layouts.
- `src/components`: Reusable UI components (Atomic design).
- `src/styles`: Global styles and design tokens.

## Workflow
We use a Multi-Stream development workflow:
- `feature`: Core UI and business logic.
- `tests`: Automated verification.
- `docs`: Documentation and specifications.
- 메인 레포지토리는 `integration` 단계를 거쳐 최종 결과물을 병합함.
