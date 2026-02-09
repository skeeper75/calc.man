# calc.man - 기술 스택 문서

## 기술 스택 개요

| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| 언어 | TypeScript | 5.7.x | 정적 타입 언어 |
| 프론트엔드 프레임워크 | React | 19.x | UI 컴포넌트 라이브러리 |
| UI 컴포넌트 | shadcn/ui | latest | 재사용 가능한 UI 컴포넌트 |
| CSS 프레임워크 | Tailwind CSS | 4.x | 유틸리티 기반 스타일링 |
| 빌드 도구 | Vite | 6.x | 빠른 개발 서버 및 번들러 |
| 데이터베이스 | SQLite (sql.js) | latest | 클라이언트 측 데이터 영속성 |
| 상태 관리 | Zustand | 5.x | 경량 상태 관리 |
| 테스트 | Vitest | 3.x | 단위/통합 테스트 |
| E2E 테스트 | Playwright | latest | 브라우저 자동화 테스트 |
| 린터 | ESLint | 9.x | 코드 품질 검사 |
| 포맷터 | Prettier | 3.x | 코드 포맷 통일 |

---

## 기술 선택 이유

### TypeScript

- **타입 안전성**: 계산기 로직에서 숫자, 연산자 등의 타입을 명확히 정의하여 런타임 오류를 사전에 방지한다.
- **개발 생산성**: IDE 자동완성과 타입 추론으로 개발 속도를 높인다.
- **유지보수성**: 프로젝트 규모가 커져도 리팩터링이 안전하다.

### React

- **컴포넌트 기반 설계**: 계산기 UI를 Display, Keypad, HistoryPanel 등 독립적인 컴포넌트로 분리하기에 적합하다.
- **풍부한 생태계**: 상태 관리, 테스트, 접근성 등 다양한 라이브러리를 활용할 수 있다.
- **선택 이유 (Next.js 대신 순수 React)**: 계산기 앱은 서버 사이드 렌더링이나 파일 기반 라우팅이 불필요하며, Vite 기반 React가 더 가볍고 빠른 개발 환경을 제공한다.

### shadcn/ui

- **커스터마이징 자유도**: 컴포넌트 소스 코드가 프로젝트에 직접 포함되어 자유롭게 수정할 수 있다.
- **Tailwind CSS 통합**: Tailwind CSS와 자연스럽게 결합되어 일관된 스타일링이 가능하다.
- **접근성**: Radix UI Primitives를 기반으로 하여 키보드 탐색, 스크린 리더 등 접근성을 기본 지원한다.
- **번들 크기 최적화**: 필요한 컴포넌트만 선택적으로 설치하여 번들 크기를 최소화한다.

### Tailwind CSS

- **빠른 UI 개발**: 유틸리티 클래스를 조합하여 별도 CSS 파일 없이 빠르게 스타일링한다.
- **반응형 설계**: `sm:`, `md:`, `lg:` 등 반응형 프리픽스로 다양한 화면 크기에 쉽게 대응한다.
- **디자인 시스템 통합**: shadcn/ui의 기본 디자인 토큰과 완벽하게 호환된다.
- **번들 최적화**: 사용하지 않는 스타일은 빌드 시 자동으로 제거된다.

### Vite

- **빠른 개발 서버**: ESM 기반 핫 모듈 교체(HMR)로 변경 사항이 즉시 반영된다.
- **빠른 빌드**: esbuild 기반 사전 번들링과 Rollup 기반 프로덕션 빌드로 빠른 빌드 속도를 제공한다.
- **간결한 설정**: Next.js 대비 설정이 단순하여 계산기 앱 규모에 적합하다.
- **TypeScript 네이티브 지원**: 별도 설정 없이 TypeScript를 바로 사용할 수 있다.

### SQLite (sql.js)

- **별도 서버 불필요**: sql.js를 사용하면 WebAssembly 기반으로 브라우저 내에서 SQLite를 직접 구동할 수 있다.
- **SQL 지원**: IndexedDB보다 구조화된 쿼리를 작성할 수 있어 이력 검색, 정렬 등에 유리하다.
- **경량**: 계산 이력 저장 수준의 간단한 데이터 관리에 적합하다.
- **이식성**: 필요 시 서버 측 SQLite로 쉽게 전환할 수 있다.

---

## 개발 환경 요구사항

### 필수 환경

| 도구 | 최소 버전 | 권장 버전 | 비고 |
|------|-----------|-----------|------|
| Node.js | 20.x LTS | 22.x LTS | JavaScript 런타임 |
| pnpm | 9.x | 10.x | 패키지 매니저 (권장) |
| npm | 10.x | 10.x | 대체 패키지 매니저 |
| Git | 2.40+ | 최신 | 버전 관리 |

### 권장 IDE 설정

- **VS Code** 또는 **Cursor**: TypeScript 및 React 개발에 최적화
- 필수 확장:
  - ESLint: 코드 품질 검사
  - Prettier: 코드 포맷팅
  - Tailwind CSS IntelliSense: Tailwind 클래스 자동완성
  - TypeScript Importer: 자동 import

### 환경 설정 명령어

```bash
# 프로젝트 생성 (Vite + React + TypeScript)
pnpm create vite calc.man --template react-ts

# 의존성 설치
cd calc.man
pnpm install

# shadcn/ui 초기화
pnpm dlx shadcn@latest init

# 개발 서버 시작
pnpm dev
```

---

## 주요 의존성 목록

### 프로덕션 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| react | ^19.0.0 | UI 프레임워크 |
| react-dom | ^19.0.0 | DOM 렌더링 |
| tailwindcss | ^4.0.0 | CSS 프레임워크 |
| @tailwindcss/vite | ^4.0.0 | Vite용 Tailwind 플러그인 |
| class-variance-authority | ^0.7.0 | 컴포넌트 변형 관리 (shadcn/ui) |
| clsx | ^2.1.0 | 조건부 클래스명 결합 |
| tailwind-merge | ^3.0.0 | Tailwind 클래스 충돌 해결 |
| lucide-react | ^0.400.0 | 아이콘 라이브러리 (shadcn/ui) |
| zustand | ^5.0.0 | 상태 관리 |
| sql.js | ^1.11.0 | 브라우저 내 SQLite |

### 개발 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| typescript | ^5.7.0 | TypeScript 컴파일러 |
| vite | ^6.0.0 | 빌드 도구 |
| @vitejs/plugin-react | ^4.0.0 | React Vite 플러그인 |
| vitest | ^3.0.0 | 테스트 프레임워크 |
| @testing-library/react | ^16.0.0 | React 컴포넌트 테스트 |
| @testing-library/jest-dom | ^6.0.0 | DOM 매처 확장 |
| jsdom | ^25.0.0 | 테스트용 DOM 환경 |
| playwright | ^1.49.0 | E2E 테스트 |
| eslint | ^9.0.0 | 린터 |
| prettier | ^3.4.0 | 코드 포맷터 |
| @types/react | ^19.0.0 | React 타입 정의 |
| @types/react-dom | ^19.0.0 | React DOM 타입 정의 |

---

## 빌드 및 배포 설정

### 빌드 명령어

```bash
# 개발 서버 (HMR 지원)
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과물 미리보기
pnpm preview

# 타입 검사
pnpm tsc --noEmit

# 린트 검사
pnpm lint

# 테스트 실행
pnpm test

# 테스트 (커버리지 포함)
pnpm test --coverage
```

### Vite 빌드 설정

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
});
```

### 배포 대상

| 플랫폼 | 용도 | 비고 |
|--------|------|------|
| Vercel | 주요 배포 대상 | Vite 빌드 결과물 정적 호스팅 |
| GitHub Pages | 대체 배포 | 무료 정적 호스팅 |
| Cloudflare Pages | 대체 배포 | 글로벌 CDN |

### 배포 프로세스

1. `main` 브랜치에 코드 병합
2. CI/CD 파이프라인에서 자동 빌드 실행 (`pnpm build`)
3. 빌드 결과물(`dist/`)을 호스팅 플랫폼에 배포
4. 프리뷰 URL 생성 (PR 기반 프리뷰 배포)

---

## 테스트 전략

### 테스트 계층

| 계층 | 도구 | 대상 | 커버리지 목표 |
|------|------|------|-------------|
| 단위 테스트 | Vitest | 계산 엔진, 포맷터, 유틸리티 | 90% 이상 |
| 컴포넌트 테스트 | Vitest + Testing Library | React 컴포넌트 | 80% 이상 |
| 통합 테스트 | Vitest + Testing Library | 컴포넌트 간 상호작용 | 75% 이상 |
| E2E 테스트 | Playwright | 전체 사용자 흐름 | 핵심 시나리오 100% |

### 테스트 실행 설정

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 코드 품질 도구

### ESLint 설정

- TypeScript ESLint 규칙 적용
- React Hooks 규칙 적용
- Tailwind CSS 클래스 정렬 규칙

### Prettier 설정

| 옵션 | 값 | 설명 |
|------|-----|------|
| printWidth | 100 | 한 줄 최대 길이 |
| tabWidth | 2 | 들여쓰기 공백 수 |
| singleQuote | true | 작은따옴표 사용 |
| trailingComma | all | 후행 쉼표 항상 사용 |
| semi | true | 세미콜론 사용 |

---

## TRUST 5 품질 원칙 적용

| 원칙 | 적용 방안 | 상태 |
|------|-----------|------|
| Tested | Vitest 단위 테스트 + Playwright E2E, 커버리지 85% 이상 | 도입 예정 |
| Readable | TypeScript 엄격 모드, ESLint/Prettier 적용 | 도입 예정 |
| Unified | shadcn/ui 디자인 시스템, Tailwind 컨벤션 | 도입 예정 |
| Secured | 입력 검증, XSS 방지 (React 기본 제공) | 도입 예정 |
| Trackable | Conventional Commits, SPEC 기반 개발 | 도입 예정 |

---

## 기술적 제약 및 고려사항

### 제약 사항

1. **브라우저 SQLite 한계**: sql.js는 WebAssembly 기반으로 동작하므로, WASM 지원이 필요하다. 대부분의 모던 브라우저에서 지원한다.
2. **데이터 영속성**: 브라우저 측 SQLite는 IndexedDB 또는 OPFS에 데이터를 저장한다. 브라우저 데이터 초기화 시 이력이 삭제될 수 있다.
3. **부동소수점 정밀도**: JavaScript의 IEEE 754 부동소수점 특성으로 인해 특정 소수 계산에서 정밀도 이슈가 발생할 수 있다. 필요 시 decimal.js 등의 라이브러리로 보완한다.

### 향후 기술 고려사항

- **PWA 지원**: Service Worker 및 Web App Manifest 추가로 오프라인 사용 지원
- **서버 측 전환**: 데이터 동기화가 필요해질 경우, Express/Fastify 기반 API 서버 추가 고려
- **국제화(i18n)**: 다국어 지원 필요 시 react-intl 또는 i18next 도입
