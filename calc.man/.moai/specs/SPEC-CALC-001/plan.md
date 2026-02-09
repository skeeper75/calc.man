# SPEC-CALC-001 구현 계획

**SPEC ID**: SPEC-CALC-001
**제목**: 프로젝트 스캐폴딩 및 핵심 계산 엔진
**작성일**: 2026-02-09
**작성자**: 지니
**상태**: Approved

---

## 1. 개요

### 1.1 구현 목표

웹 계산기 애플리케이션의 기반 인프라 구축 및 핵심 계산 로직 구현을 통해 Phase 2 UI 개발을 위한 견고한 토대를 마련합니다.

### 1.2 개발 방법론

- **방법론**: Hybrid (TDD for new code + DDD for legacy)
- **이 SPEC**: 100% 신규 코드이므로 **TDD (RED-GREEN-REFACTOR)** 적용
- **커버리지 목표**: 85% 이상

### 1.3 TDD 사이클

1. **RED**: 실패하는 테스트 작성 (구현 전)
2. **GREEN**: 테스트를 통과하는 최소 코드 작성
3. **REFACTOR**: 코드 품질 개선 (테스트는 계속 통과)

---

## 2. 작업 분해 (Task Decomposition)

### Phase 1: 프로젝트 초기화 및 설정

**작업 1.1 - Vite + React + TypeScript 프로젝트 생성**

```bash
npm create vite@latest . -- --template react-ts
```

- 소요 예상: 우선순위 높음 (첫 번째 작업)
- 의존성: 없음
- 산출물: 기본 Vite 프로젝트 구조

**작업 1.2 - 필수 의존성 설치**

```bash
npm install zustand
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
```

- 소요 예상: 우선순위 높음
- 의존성: 작업 1.1 완료
- 산출물: package.json, node_modules

**작업 1.3 - 설정 파일 구성**

생성/수정할 파일:
- `vite.config.ts` - Vitest 설정 추가
- `tailwind.config.js` - Tailwind CSS 설정
- `tsconfig.json` - TypeScript 경로 별칭 설정
- `vitest.config.ts` - 테스트 설정 분리

- 소요 예상: 우선순위 높음
- 의존성: 작업 1.2 완료
- 산출물: 설정 파일 5개

**작업 1.4 - 디렉토리 구조 생성**

```bash
mkdir -p src/{lib,store,tests,components}
```

- 소요 예상: 우선순위 높음
- 의존성: 작업 1.1 완료
- 산출물: 표준 디렉토리 구조

---

### Phase 2: 핵심 계산 엔진 구현 (TDD)

**작업 2.1 - TypeScript 타입 정의 (src/lib/types.ts)**

**RED**: 타입 테스트 작성
- `types.test.ts` - 타입 정의 존재 확인 테스트

**GREEN**: 타입 정의 작성
```typescript
export type Operator = '+' | '-' | '×' | '÷';
export type CalculationResult = number | { error: string };
```

**REFACTOR**: JSDoc 주석 추가

- 소요 예상: 우선순위 최고 (기반 타입)
- 의존성: 작업 1.4 완료
- 산출물: `src/lib/types.ts`, `src/tests/types.test.ts`
- 테스트 수: 3개 (타입 존재, Operator 유니온, CalculationResult 유니온)

**작업 2.2 - 기본 사칙연산 함수 (src/lib/calculator.ts)**

**RED**: 실패하는 테스트 작성
```typescript
// calculator.test.ts
describe('add', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  it('should add negative numbers', () => {
    expect(add(-5, -3)).toBe(-8);
  });
  it('should add mixed sign numbers', () => {
    expect(add(10, -4)).toBe(6);
  });
});
```

**GREEN**: 최소 구현
```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

**REFACTOR**: 부동소수점 오차 처리

동일한 TDD 사이클로 구현:
- `subtract(a, b)` - 테스트 3개
- `multiply(a, b)` - 테스트 3개
- `divide(a, b)` - 테스트 5개 (0으로 나누기 포함)

- 소요 예상: 우선순위 최고
- 의존성: 작업 2.1 완료
- 산출물: `src/lib/calculator.ts`, `src/tests/calculator.test.ts`
- 테스트 수: 최소 14개 (add 3, subtract 3, multiply 3, divide 5)

**작업 2.3 - 통합 계산 함수 (calculate)**

**RED**: 통합 테스트 작성
```typescript
describe('calculate', () => {
  it('should perform addition', () => {
    expect(calculate(5, '+', 3)).toBe(8);
  });
  it('should perform division by zero and return error', () => {
    const result = calculate(10, '÷', 0);
    expect(result).toEqual({ error: 'Error: Division by zero' });
  });
  // ... 더 많은 테스트 케이스
});
```

**GREEN**: 최소 구현
```typescript
export function calculate(
  firstOperand: number,
  operator: Operator,
  secondOperand: number
): CalculationResult {
  switch (operator) {
    case '+': return add(firstOperand, secondOperand);
    case '-': return subtract(firstOperand, secondOperand);
    case '×': return multiply(firstOperand, secondOperand);
    case '÷': return divide(firstOperand, secondOperand);
  }
}
```

**REFACTOR**: NaN/Infinity 검증 추가

- 소요 예상: 우선순위 높음
- 의존성: 작업 2.2 완료
- 산출물: calculator.ts 확장, calculator.test.ts 추가
- 테스트 수: 최소 8개 (각 연산자별 정상/에러 케이스)

---

### Phase 3: 숫자 포맷팅 유틸리티 (TDD)

**작업 3.1 - 숫자 포맷터 (src/lib/formatter.ts)**

**RED**: 포맷팅 테스트 작성
```typescript
describe('formatNumber', () => {
  it('should format integer with thousand separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
  it('should format decimal numbers', () => {
    expect(formatNumber(123.456789)).toBe('123.456789');
  });
  it('should remove trailing zeros', () => {
    expect(formatNumber(12.3000)).toBe('12.3');
  });
  it('should limit to 10 decimal places', () => {
    expect(formatNumber(1.123456789012)).toBe('1.1234567890');
  });
});
```

**GREEN**: 최소 구현
```typescript
export function formatNumber(value: number): string {
  // 소수점 10자리 반올림
  const rounded = Math.round(value * 1e10) / 1e10;
  // 천 단위 구분 기호 추가
  const parts = rounded.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
```

**REFACTOR**: 음수 처리, 엣지 케이스 처리

- 소요 예상: 우선순위 중간
- 의존성: 작업 2.3 완료
- 산출물: `src/lib/formatter.ts`, `src/tests/formatter.test.ts`
- 테스트 수: 최소 8개

**작업 3.2 - 입력 검증 함수**

**RED**: 검증 테스트 작성
```typescript
describe('validateNumberInput', () => {
  it('should accept valid integer', () => {
    expect(validateNumberInput('123')).toBe(true);
  });
  it('should accept valid decimal', () => {
    expect(validateNumberInput('123.45')).toBe(true);
  });
  it('should reject multiple decimals', () => {
    expect(validateNumberInput('12.34.56')).toBe(false);
  });
  it('should reject non-numeric characters', () => {
    expect(validateNumberInput('12a3')).toBe(false);
  });
});
```

**GREEN**: 정규식 검증 구현
```typescript
export function validateNumberInput(input: string): boolean {
  return /^-?\d*\.?\d*$/.test(input) && input.length <= 15;
}
```

**REFACTOR**: 소수점 중복 확인 강화

- 소요 예상: 우선순위 중간
- 의존성: 작업 3.1 완료
- 산출물: formatter.ts 확장, formatter.test.ts 추가
- 테스트 수: 최소 6개

---

### Phase 4: Zustand 상태 관리 스토어 (TDD)

**작업 4.1 - 스토어 인터페이스 정의 (src/store/useCalculatorStore.ts)**

**RED**: 상태 구조 테스트
```typescript
describe('useCalculatorStore initial state', () => {
  it('should have initial display as "0"', () => {
    const { display } = useCalculatorStore.getState();
    expect(display).toBe('0');
  });
  it('should have null firstOperand', () => {
    const { firstOperand } = useCalculatorStore.getState();
    expect(firstOperand).toBeNull();
  });
  // ... 더 많은 초기 상태 테스트
});
```

**GREEN**: 초기 상태 정의
```typescript
interface CalculatorState {
  display: string;
  firstOperand: number | null;
  operator: Operator | null;
  isOperatorPressed: boolean;
  isResultDisplayed: boolean;
}

const initialState: CalculatorState = {
  display: '0',
  firstOperand: null,
  operator: null,
  isOperatorPressed: false,
  isResultDisplayed: false,
};
```

**REFACTOR**: TypeScript 타입 안전성 강화

- 소요 예상: 우선순위 높음
- 의존성: 작업 3.2 완료
- 산출물: `src/store/useCalculatorStore.ts`, `src/tests/store.test.ts`
- 테스트 수: 5개 (각 초기 상태 필드)

**작업 4.2 - 숫자 입력 액션 (inputNumber)**

**RED**: 숫자 입력 테스트
```typescript
describe('inputNumber action', () => {
  beforeEach(() => {
    useCalculatorStore.getState().clear();
  });

  it('should replace initial "0" with first digit', () => {
    const { inputNumber, display } = useCalculatorStore.getState();
    inputNumber('5');
    expect(useCalculatorStore.getState().display).toBe('5');
  });

  it('should append digit to existing number', () => {
    const store = useCalculatorStore.getState();
    store.inputNumber('5');
    store.inputNumber('3');
    expect(store.display).toBe('53');
  });

  it('should limit input to 15 characters', () => {
    const store = useCalculatorStore.getState();
    const longNumber = '1'.repeat(20);
    store.inputNumber(longNumber);
    expect(store.display.length).toBeLessThanOrEqual(15);
  });
});
```

**GREEN**: 최소 구현
```typescript
inputNumber: (digit: string) => {
  set((state) => {
    if (state.display.length >= 15) return state;
    const newDisplay = state.display === '0' ? digit : state.display + digit;
    return { ...state, display: newDisplay };
  });
}
```

**REFACTOR**: 엣지 케이스 처리 (결과 표시 후 입력 등)

- 소요 예상: 우선순위 높음
- 의존성: 작업 4.1 완료
- 산출물: store 액션 추가, store.test.ts 추가
- 테스트 수: 최소 5개

**작업 4.3 - 연산자 입력 액션 (inputOperator)**

**RED**: 연산자 입력 테스트 작성

**GREEN**: 최소 구현

**REFACTOR**: 연속 연산자 입력 처리

- 소요 예상: 우선순위 높음
- 의존성: 작업 4.2 완료
- 테스트 수: 최소 4개

**작업 4.4 - 계산 실행 액션 (calculate)**

**RED**: 계산 실행 테스트 작성

**GREEN**: calculator.ts의 calculate 함수 호출

**REFACTOR**: 에러 처리 통합

- 소요 예상: 우선순위 최고
- 의존성: 작업 4.3 완료
- 테스트 수: 최소 8개

**작업 4.5 - 기타 액션 (clear, inputDecimal, toggleSign, inputPercent)**

각 액션별 TDD 사이클:
- `clear()` - 테스트 2개
- `inputDecimal()` - 테스트 3개
- `toggleSign()` - 테스트 2개
- `inputPercent()` - 테스트 2개

- 소요 예상: 우선순위 중간
- 의존성: 작업 4.4 완료
- 테스트 수: 총 9개

---

### Phase 5: 통합 및 문서화

**작업 5.1 - 전체 테스트 실행 및 커버리지 확인**

```bash
npm run test:coverage
```

확인 항목:
- 전체 커버리지 85% 이상
- calculator.ts 커버리지 100%
- formatter.ts 커버리지 100%
- store 커버리지 90% 이상

- 소요 예상: 우선순위 최고 (품질 게이트)
- 의존성: Phase 4 완료
- 산출물: 커버리지 리포트

**작업 5.2 - README.md 작성**

포함 내용:
- 프로젝트 개요
- 기술 스택
- 설치 및 실행 방법
- 테스트 실행 방법
- 프로젝트 구조
- 다음 단계 (Phase 2 UI 개발)

- 소요 예상: 우선순위 중간
- 의존성: 작업 5.1 완료
- 산출물: `README.md`

**작업 5.3 - JSDoc 주석 추가**

모든 공개 함수에 JSDoc 추가:
- 함수 설명
- 매개변수 설명
- 반환값 설명
- 예시 코드

- 소요 예상: 우선순위 낮음 (선택 사항)
- 의존성: 작업 5.1 완료
- 산출물: 주석이 추가된 소스 코드

---

## 3. 파일 생성 목록 및 목적

### 설정 파일

| 파일명 | 목적 | 우선순위 |
|--------|------|----------|
| `vite.config.ts` | Vite 및 Vitest 설정 | 최고 |
| `vitest.config.ts` | Vitest 전용 설정 분리 | 높음 |
| `tailwind.config.js` | Tailwind CSS 설정 | 중간 |
| `tsconfig.json` | TypeScript 컴파일러 설정 | 최고 |
| `package.json` | 프로젝트 메타데이터 및 의존성 | 최고 |

### 소스 파일

| 파일명 | 목적 | 라인 수 예상 | 우선순위 |
|--------|------|-------------|----------|
| `src/lib/types.ts` | 공통 TypeScript 타입 정의 | ~20 | 최고 |
| `src/lib/calculator.ts` | 핵심 계산 엔진 로직 | ~80 | 최고 |
| `src/lib/formatter.ts` | 숫자 포맷팅 및 검증 유틸리티 | ~60 | 높음 |
| `src/store/useCalculatorStore.ts` | Zustand 상태 관리 스토어 | ~150 | 최고 |

### 테스트 파일

| 파일명 | 목적 | 테스트 수 예상 | 우선순위 |
|--------|------|---------------|----------|
| `src/tests/calculator.test.ts` | 계산 엔진 단위 테스트 | ~25 | 최고 |
| `src/tests/formatter.test.ts` | 포맷터 단위 테스트 | ~15 | 높음 |
| `src/tests/store.test.ts` | 상태 관리 통합 테스트 | ~30 | 최고 |

### 문서 파일

| 파일명 | 목적 | 우선순위 |
|--------|------|----------|
| `README.md` | 프로젝트 개요 및 사용 가이드 | 중간 |
| `.moai/specs/SPEC-CALC-001/spec.md` | EARS 형식 명세서 | 완료 |
| `.moai/specs/SPEC-CALC-001/plan.md` | 구현 계획 (현재 문서) | 완료 |
| `.moai/specs/SPEC-CALC-001/acceptance.md` | 인수 테스트 기준 | 완료 |

---

## 4. 기술 선택 근거

### 4.1 빌드 도구: Vite 6

**선택 이유**:
- 개발 서버 시작 속도 극대화 (ESM 기반)
- HMR (Hot Module Replacement) 성능 우수
- 간결한 설정 및 플러그인 생태계
- Vitest와의 완벽한 통합

**대안 고려**:
- Webpack: 설정 복잡도 높음
- Parcel: 기능 제한적
- Turbopack: 아직 실험 단계

### 4.2 프론트엔드 프레임워크: React 19

**선택 이유**:
- 최신 React 기능 활용 (Server Components, use hook)
- 방대한 생태계 및 커뮤니티
- 팀 숙련도 높음
- UI 컴포넌트 라이브러리 풍부 (shadcn/ui)

**대안 고려**:
- Vue: 생태계 상대적으로 작음
- Svelte: 학습 곡선 존재
- Solid: 커뮤니티 작음

### 4.3 상태 관리: Zustand 5

**선택 이유**:
- 간결한 API 및 최소한의 보일러플레이트
- TypeScript 타입 안전성 우수
- React Context/Redux보다 성능 우수
- 번들 크기 작음 (~1KB)

**대안 고려**:
- Redux Toolkit: 보일러플레이트 많음
- Jotai: 아토믹 상태 불필요
- Recoil: 메타 유지보수 불확실성

### 4.4 테스트 프레임워크: Vitest 3

**선택 이유**:
- Vite와 완벽한 통합 (같은 설정 재사용)
- Jest 호환 API (러닝 커브 없음)
- 빠른 실행 속도
- UI 모드 제공 (`@vitest/ui`)

**대안 고려**:
- Jest: Vite와 통합 복잡
- Mocha/Chai: 단언 라이브러리 별도 필요

### 4.5 스타일링: Tailwind CSS 4

**선택 이유**:
- 유틸리티 우선 방식으로 빠른 개발
- shadcn/ui와 완벽한 호환
- 커스터마이징 용이
- 번들 크기 최적화 (PurgeCSS 내장)

**대안 고려**:
- CSS Modules: 보일러플레이트 많음
- styled-components: 런타임 오버헤드
- CSS-in-JS: 성능 이슈

---

## 5. 리스크 분석 및 완화 방안

### 5.1 기술 리스크

**리스크 1: JavaScript 부동소수점 정밀도 문제**

- **영향도**: 중간
- **발생 가능성**: 높음
- **완화 방안**:
  - 소수점 10자리 제한
  - 적절한 반올림 로직 적용
  - 테스트에서 부동소수점 비교 시 `toBeCloseTo()` 사용
- **비상 계획**: decimal.js 라이브러리 도입 (번들 크기 증가 감수)

**리스크 2: 테스트 커버리지 85% 미달**

- **영향도**: 높음 (품질 게이트 실패)
- **발생 가능성**: 중간
- **완화 방안**:
  - TDD 원칙 철저히 준수 (구현 전 테스트 작성)
  - 매일 커버리지 확인 (`npm run test:coverage`)
  - 커버리지 낮은 파일 우선 보완
- **비상 계획**: Phase 5에서 추가 테스트 집중 작성

**리스크 3: TypeScript 타입 에러 누적**

- **영향도**: 중간
- **발생 가능성**: 낮음 (TDD로 조기 발견)
- **완화 방안**:
  - 엄격한 TypeScript 설정 (`strict: true`)
  - 매 커밋 전 `tsc --noEmit` 실행
  - IDE 실시간 타입 체크 활용
- **비상 계획**: 타입 에러 발생 시 즉시 수정 우선순위 최고

### 5.2 일정 리스크

**리스크 4: TDD 사이클 준수로 인한 개발 시간 증가**

- **영향도**: 낮음 (Phase 1 전체 일정에 영향 미미)
- **발생 가능성**: 높음 (TDD 학습 곡선)
- **완화 방안**:
  - 간단한 테스트부터 시작하여 점진적 복잡도 증가
  - 테스트 작성 패턴 문서화하여 재사용
- **비상 계획**: 핵심 로직(calculator.ts)만 TDD, 나머지는 구현 후 테스트 작성

**리스크 5: 요구사항 변경 또는 추가**

- **영향도**: 높음 (재작업 발생)
- **발생 가능성**: 낮음 (SPEC 사전 승인)
- **완화 방안**:
  - SPEC 우선 개발로 명확한 범위 정의
  - 변경 시 SPEC 문서 먼저 업데이트
- **비상 계획**: Phase 2로 기능 이관

---

## 6. 의존성 관리

### 6.1 의존성 그래프

```
작업 1.1 (프로젝트 생성)
  ↓
작업 1.2 (의존성 설치)
  ↓
작업 1.3 (설정 파일) ← 작업 1.4 (디렉토리 생성)
  ↓
작업 2.1 (타입 정의)
  ↓
작업 2.2 (사칙연산)
  ↓
작업 2.3 (통합 계산)
  ↓
작업 3.1 (포맷터) ← 작업 3.2 (검증)
  ↓
작업 4.1 (스토어 인터페이스)
  ↓
작업 4.2 (숫자 입력 액션)
  ↓
작업 4.3 (연산자 액션)
  ↓
작업 4.4 (계산 액션)
  ↓
작업 4.5 (기타 액션)
  ↓
작업 5.1 (테스트 실행) → 작업 5.2 (README) → 작업 5.3 (JSDoc)
```

### 6.2 병렬 실행 가능 작업

- 작업 1.3과 작업 1.4는 병렬 실행 가능
- 작업 3.1과 작업 3.2는 병렬 실행 가능
- 작업 5.2와 작업 5.3은 병렬 실행 가능

---

## 7. 품질 보증 계획

### 7.1 테스트 전략

**단위 테스트**:
- 각 함수별 독립적 테스트
- 정상 케이스 및 에러 케이스 모두 커버
- 경계값 테스트 포함

**통합 테스트**:
- Zustand 스토어의 액션 간 상호작용 테스트
- 여러 연산을 연결한 체인 계산 테스트

**커버리지 기준**:
- 전체 코드: 85% 이상
- 핵심 로직 (calculator.ts, formatter.ts): 100%
- 상태 관리 (store): 90% 이상

### 7.2 코드 품질 기준

**TRUST 5 프레임워크 적용**:

1. **Tested (테스트됨)**:
   - 모든 공개 함수에 단위 테스트
   - 커버리지 85% 이상

2. **Readable (가독성)**:
   - 명확한 변수/함수명 (영어)
   - JSDoc 주석 추가
   - 일관된 코딩 스타일

3. **Unified (통일성)**:
   - ESLint + Prettier 적용
   - 일관된 파일/폴더 구조

4. **Secured (보안)**:
   - 입력 검증 철저히 수행
   - XSS 방지 (사용자 입력 이스케이프)

5. **Trackable (추적 가능)**:
   - 명확한 Git 커밋 메시지
   - SPEC 문서와 코드 연결

### 7.3 Git 전략

**브랜치 전략**:
- `main` 브랜치: 안정적인 코드만 머지
- `feature/SPEC-CALC-001` 브랜치: 이 SPEC 전용 개발 브랜치
- Phase 완료 시점마다 커밋

**커밋 메시지 형식**:
```
<type>(<scope>): <subject>

<body>

🗿 MoAI <email@mo.ai.kr>
```

**타입**:
- `feat`: 새 기능
- `test`: 테스트 추가/수정
- `refactor`: 리팩토링
- `docs`: 문서 수정
- `chore`: 설정 파일 수정

**예시**:
```
feat(calculator): Implement basic arithmetic operations

- Add add, subtract, multiply, divide functions
- Add calculate function for operator-based calculation
- Include division by zero error handling

Refs: SPEC-CALC-001

🗿 MoAI <email@mo.ai.kr>
```

---

## 8. 성능 목표

### 8.1 번들 크기

- **목표**: 300KB 이내
- **측정 방법**: `npm run build` 후 `dist/` 디렉토리 크기 확인
- **최적화 방법**:
  - Tree shaking 활용
  - 불필요한 의존성 제거
  - Code splitting (Phase 2 UI 개발 시)

### 8.2 실행 성능

- **계산 응답 시간**: 100ms 이내
- **측정 방법**: Vitest 벤치마크 테스트
- **최적화 방법**:
  - 순수 함수 사용 (메모이제이션 가능)
  - 불필요한 렌더링 방지 (Zustand의 선택적 구독)

### 8.3 테스트 실행 속도

- **목표**: 전체 테스트 5초 이내
- **측정 방법**: `npm run test` 실행 시간
- **최적화 방법**:
  - Vitest의 병렬 실행 활용
  - 불필요한 setup/teardown 최소화

---

## 9. 완료 기준 (Definition of Done)

### 9.1 기능 완성도

- [ ] 모든 작업 항목 완료
- [ ] 기본 사칙연산 (+, -, ×, ÷) 동작 확인
- [ ] 소수점 입력 및 계산 정상 동작
- [ ] 0으로 나누기 에러 처리 확인
- [ ] Clear/Reset 기능 동작 확인
- [ ] 부호 전환 기능 동작 확인
- [ ] 퍼센트 계산 기능 동작 확인

### 9.2 품질 기준

- [ ] 전체 테스트 커버리지 85% 이상
- [ ] 모든 단위 테스트 통과 (0 failed)
- [ ] TypeScript 타입 에러 0건 (`tsc --noEmit`)
- [ ] ESLint 경고 0건
- [ ] calculator.ts 커버리지 100%
- [ ] formatter.ts 커버리지 100%

### 9.3 문서화

- [ ] README.md 작성 완료
- [ ] 주요 함수에 JSDoc 주석 추가
- [ ] SPEC 문서와 코드 일치 확인
- [ ] acceptance.md의 모든 시나리오 확인

### 9.4 배포 준비

- [ ] 번들 크기 300KB 이내 확인
- [ ] `npm run build` 성공
- [ ] `npm run preview` 동작 확인
- [ ] Git 커밋 메시지 형식 준수

---

## 10. 다음 단계 (Phase 2 Preview)

### 10.1 Phase 2: UI 개발

- SPEC-CALC-002 작성 예정
- React 컴포넌트 구현 (Calculator, Display, Button 등)
- shadcn/ui 통합
- 반응형 디자인 적용
- 접근성 (a11y) 개선

### 10.2 Phase 3: 고급 기능

- SPEC-CALC-003 작성 예정
- 계산 이력 기능
- 키보드 입력 지원
- 테마 전환 (다크 모드)
- 과학 계산기 모드

---

## 11. 참고 자료

### 11.1 기술 문서

- [Vite 6 Documentation](https://vite.dev)
- [React 19 Documentation](https://react.dev)
- [TypeScript 5.7 Release Notes](https://devblogs.microsoft.com/typescript/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [Vitest Documentation](https://vitest.dev)

### 11.2 TDD 학습 자료

- [Test-Driven Development by Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Testing JavaScript with Vitest](https://vitest.dev/guide/)

### 11.3 코드 품질

- [TRUST 5 Framework](../../.moai/config/sections/quality.yaml)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

---

**작성자**: 지니
**승인 날짜**: 2026-02-09
**다음 단계**: `/moai:2-run SPEC-CALC-001` 실행하여 TDD 구현 시작
