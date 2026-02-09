---
id: SPEC-CALC-002
version: "1.0.0"
status: approved
created: "2026-02-09"
updated: "2026-02-09"
phase: plan
---

# SPEC-CALC-002: 구현 계획

## 목표

웹 계산기의 사용자 인터페이스 컴포넌트와 사용자 인터랙션을 구현하여 반응형, 접근 가능한 계산기 UI를 제공합니다.

## 마일스톤 (우선순위 기반)

### 우선순위 High: 핵심 UI 컴포넌트
**목표**: 기본 계산기 UI 구조와 컴포넌트 구현

**작업 항목**:
1. shadcn/ui 설치 및 설정
   - Button, Card 컴포넌트 설치
   - Tailwind CSS 4 설정 확인

2. Display 컴포넌트 구현
   - 값 표시 기능
   - 동적 글꼴 크기 조정 로직
   - 오류 메시지 표시

3. KeypadButton 컴포넌트 구현
   - shadcn/ui Button 통합
   - 버튼 변형 스타일 (default, operator, special)
   - 접근성 레이블 (aria-label)

4. Keypad 컴포넌트 구현
   - 4x5 그리드 레이아웃
   - KeypadButton 조합
   - 반응형 간격 조정

**완료 기준**:
- [x] Display 컴포넌트가 값을 표시하고 글꼴 크기를 조정함
- [x] KeypadButton이 클릭 이벤트를 처리함
- [x] Keypad가 모든 버튼을 올바른 레이아웃으로 표시함

### 우선순위 High: 상태 관리 및 인터랙션
**목표**: 계산기 엔진과 UI 연동, 사용자 입력 처리

**작업 항목**:
1. useCalculator 훅 구현
   - Zustand 스토어 연동 (SPEC-CALC-001)
   - 입력 검증 및 포맷팅
   - 오류 상태 관리

2. Calculator 컴포넌트 구현
   - Display와 Keypad 조합
   - 이벤트 핸들러 연결
   - shadcn/ui Card로 래핑

3. 사용자 입력 처리
   - 숫자 버튼 클릭 처리
   - 연산자 버튼 클릭 처리
   - AC/C 버튼 동작 구현
   - 등호 버튼 계산 실행

**완료 기준**:
- [x] 사용자가 버튼을 클릭하면 디스플레이가 업데이트됨
- [x] AC 버튼이 상태를 초기화함
- [x] C 버튼이 마지막 문자를 삭제함
- [x] 계산 결과가 정확하게 표시됨

### 우선순위 Medium: 반응형 디자인
**목표**: 모바일과 데스크톱에서 최적화된 UI 제공

**작업 항목**:
1. Layout 컴포넌트 구현
   - 반응형 컨테이너
   - 중앙 정렬
   - 브레이크포인트 기반 패딩

2. 반응형 스타일 적용
   - 모바일: 버튼 60px, 디스플레이 80px
   - 데스크톱: 버튼 80px, 디스플레이 100px
   - Tailwind 반응형 클래스 사용

3. 디스플레이 오버플로우 처리
   - 15자 초과 시 글꼴 크기 조정
   - 텍스트 줄바꿈 방지
   - 가로 스크롤 비활성화

**완료 기준**:
- [x] 모바일(< 768px)에서 UI가 적절히 표시됨
- [x] 데스크톱(>= 768px)에서 UI가 적절히 표시됨
- [x] 긴 숫자가 잘림 없이 표시됨

### 우선순위 Medium: 접근성
**목표**: WCAG AA 준수 및 키보드/스크린 리더 지원

**작업 항목**:
1. 키보드 탐색 지원
   - Tab 키로 버튼 포커스 이동
   - Enter/Space 키로 버튼 활성화
   - Escape 키로 AC 기능 실행

2. 스크린 리더 지원
   - 모든 버튼에 aria-label 추가
   - 디스플레이에 aria-live="polite" 적용
   - 오류 상태 시 role="alert" 추가

3. 색상 대비 검증
   - 텍스트/배경 대비비 4.5:1 이상
   - 포커스 인디케이터 명확히 표시

**완료 기준**:
- [x] 키보드만으로 모든 기능 사용 가능
- [x] 스크린 리더가 버튼 레이블을 읽음
- [x] axe-core 접근성 검사 통과

### 우선순위 Low: 성능 최적화
**목표**: 렌더링 성능 및 번들 크기 최적화

**작업 항목**:
1. 컴포넌트 메모이제이션
   - KeypadButton을 React.memo로 최적화
   - 이벤트 핸들러를 useCallback으로 메모이제이션

2. 번들 크기 최적화
   - 사용하지 않는 코드 제거
   - Dynamic import 적용 (필요 시)

3. 성능 측정
   - React DevTools Profiler로 렌더링 시간 측정
   - Lighthouse로 성능 점수 확인

**완료 기준**:
- [x] 버튼 클릭 응답 시간 < 16ms
- [x] 초기 렌더링 시간 < 100ms
- [x] Calculator 번들 크기 < 50KB (gzipped)

### 우선순위 Optional: 고급 기능
**목표**: 사용자 경험 향상을 위한 추가 기능

**작업 항목**:
1. 햅틱 피드백 (모바일)
   - navigator.vibrate API 사용
   - 버튼 클릭 시 짧은 진동 (10ms)

2. 애니메이션 효과
   - 버튼 클릭 시 부드러운 scale 효과
   - 디스플레이 값 변경 시 fade-in 효과

**완료 기준**:
- [ ] 모바일에서 버튼 클릭 시 햅틱 피드백 제공 (선택)
- [ ] 애니메이션이 부드럽게 실행됨 (선택)

## 기술 접근법

### 아키텍처 설계

#### 컴포넌트 계층 구조
```
App
└── Layout
    └── Calculator
        ├── Display
        └── Keypad
            └── KeypadButton (x 19개)
```

#### 상태 관리 흐름
```
User Click
    ↓
KeypadButton onClick
    ↓
Calculator handleButtonClick
    ↓
useCalculator hook
    ↓
Zustand Store (SPEC-CALC-001)
    ↓
Display value update
```

### shadcn/ui 통합

#### 설치 명령어
```bash
# shadcn/ui 초기화
npx shadcn@latest init

# Button 컴포넌트 설치
npx shadcn@latest add button

# Card 컴포넌트 설치
npx shadcn@latest add card
```

#### 설정 파일 (components.json)
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Tailwind CSS 4 설정

#### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        calculator: {
          display: "#1e1e1e",
          button: {
            default: "#f5f5f5",
            operator: "#ff9500",
            special: "#3b82f6",
          },
        },
      },
      gridTemplateColumns: {
        'calculator': 'repeat(4, 1fr)',
      },
    },
  },
  plugins: [],
};
export default config;
```

### 컴포넌트 구현 전략

#### Display.tsx 핵심 로직
```typescript
// 글꼴 크기 동적 조정
const getFontSize = (value: string) => {
  const length = value.length;
  if (length <= 15) return "text-4xl";
  if (length <= 20) return "text-3xl";
  return "text-2xl";
};
```

#### KeypadButton.tsx 스타일 변형
```typescript
const variantStyles = {
  default: "bg-gray-100 hover:bg-gray-200",
  operator: "bg-orange-500 text-white hover:bg-orange-600",
  special: "bg-blue-500 text-white hover:bg-blue-600",
};
```

#### useCalculator 훅 구조
```typescript
const useCalculator = () => {
  const { state, dispatch } = useCalculatorStore();

  const handleNumberInput = (num: string) => {
    // 숫자 입력 로직
  };

  const handleOperatorInput = (op: string) => {
    // 연산자 입력 로직
  };

  return { state, handleNumberInput, handleOperatorInput, ... };
};
```

## 위험 요소 및 대응 방안

### 기술적 위험

#### 위험 1: SPEC-CALC-001 의존성
**설명**: 계산기 엔진이 완성되지 않으면 UI 통합 불가

**영향도**: High

**대응 방안**:
- SPEC-CALC-001 구현 완료 여부 확인
- Mock 데이터로 UI 우선 개발
- 통합 테스트 시 실제 엔진 연동

#### 위험 2: 접근성 테스트 복잡도
**설명**: WCAG AA 준수 검증에 시간 소요

**영향도**: Medium

**대응 방안**:
- axe-core 자동 검사 도구 사용
- ARIA 레이블 체크리스트 작성
- 키보드 탐색 테스트 시나리오 문서화

#### 위험 3: 반응형 레이아웃 버그
**설명**: 다양한 화면 크기에서 레이아웃 깨짐 가능

**영향도**: Medium

**대응 방안**:
- 주요 브레이크포인트 테스트 (320px, 768px, 1024px)
- 브라우저 DevTools로 반응형 검증
- 실제 모바일 기기에서 테스트

### 성능 위험

#### 위험 4: 불필요한 리렌더링
**설명**: 버튼 클릭 시 전체 Keypad 리렌더링

**영향도**: Low

**대응 방안**:
- React.memo로 KeypadButton 메모이제이션
- useCallback으로 이벤트 핸들러 안정화
- React DevTools Profiler로 모니터링

## 테스트 전략

### 단위 테스트 (Vitest + React Testing Library)

#### Display.test.tsx
```typescript
describe('Display Component', () => {
  it('값을 표시한다', () => {});
  it('15자 초과 시 글꼴 크기를 줄인다', () => {});
  it('오류 상태 시 "Error"를 표시한다', () => {});
});
```

#### KeypadButton.test.tsx
```typescript
describe('KeypadButton Component', () => {
  it('클릭 시 onClick 핸들러를 호출한다', () => {});
  it('variant에 따라 스타일을 적용한다', () => {});
  it('aria-label을 제공한다', () => {});
});
```

#### useCalculator.test.ts
```typescript
describe('useCalculator Hook', () => {
  it('숫자 입력을 처리한다', () => {});
  it('연산자 입력을 처리한다', () => {});
  it('AC 버튼이 상태를 초기화한다', () => {});
  it('C 버튼이 마지막 문자를 삭제한다', () => {});
});
```

### 통합 테스트

#### Calculator.test.tsx
```typescript
describe('Calculator Integration', () => {
  it('숫자 입력 → 연산자 → 숫자 입력 → 결과', async () => {});
  it('AC 버튼이 모든 상태를 초기화한다', async () => {});
  it('연속 계산을 수행한다', async () => {});
});
```

### E2E 테스트 (Playwright)

#### calculator.spec.ts
```typescript
test.describe('Calculator E2E', () => {
  test('기본 계산 워크플로우', async ({ page }) => {});
  test('모바일 레이아웃 검증', async ({ page }) => {});
  test('키보드 탐색', async ({ page }) => {});
  test('접근성 검사 (axe-core)', async ({ page }) => {});
});
```

## 추적성 태그

모든 커밋과 PR에 다음 태그를 포함:

- `[SPEC-CALC-002]` - SPEC ID
- `[REQ-UI-XXX]` - 요구사항 ID
- `[TASK-XXX]` - 작업 항목 ID

## 다음 단계

### 구현 준비
1. SPEC-CALC-001 구현 완료 확인
2. shadcn/ui 설치 및 설정
3. 개발 환경 세팅 확인

### 구현 시작
```bash
# 브랜치 생성
git checkout -b feature/SPEC-CALC-002-ui-components

# 개발 시작
npm run dev
```

### 완료 후
1. 모든 테스트 통과 확인
2. 접근성 검사 실행 (axe-core)
3. PR 생성 및 리뷰 요청
4. `/moai:3-sync SPEC-CALC-002` 실행

---

**[SPEC-CALC-002]** 기본 UI 컴포넌트 및 사용자 인터랙션 구현 계획

🗿 MoAI <email@mo.ai.kr>
