---
id: SPEC-CALC-001
version: "1.0.0"
status: approved
created: "2026-02-09"
updated: "2026-02-09"
author: "지니"
priority: high
---

# SPEC-CALC-001: 프로젝트 스캐폴딩 및 핵심 계산 엔진

## HISTORY

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 2026-02-09 | 1.0.0 | 초기 SPEC 작성 | 지니 |

---

## 1. 개요

### 1.1 목적

웹 기반 계산기 애플리케이션(calc.man)의 프로젝트 초기 설정 및 핵심 계산 엔진 구현을 위한 명세서입니다.

### 1.2 범위

- Vite 6 + React 19 + TypeScript 5.7 프로젝트 초기화
- 디렉토리 구조 및 설정 파일 생성
- 계산 엔진 로직 구현 (calculator.ts)
- 숫자 포맷팅 유틸리티 구현 (formatter.ts)
- Zustand 5 상태 관리 스토어 구현
- TypeScript 타입 정의 파일 작성
- Vitest 3 테스트 환경 설정
- 단위 테스트 작성 (TDD 방식)

### 1.3 기술 스택

- **빌드 도구**: Vite 6
- **프론트엔드 프레임워크**: React 19
- **언어**: TypeScript 5.7
- **스타일링**: Tailwind CSS 4
- **UI 컴포넌트**: shadcn/ui
- **상태 관리**: Zustand 5
- **테스트 프레임워크**: Vitest 3
- **개발 방법론**: Hybrid (신규 코드는 TDD)
- **커버리지 목표**: 85%

---

## 2. Environment (환경)

### 2.1 개발 환경

- Node.js 20.x 이상
- npm 10.x 이상
- 최신 브라우저 (Chrome, Firefox, Safari, Edge)

### 2.2 프로젝트 환경

- 새 프로젝트 생성 (기존 코드 없음)
- Git 버전 관리 사용
- ESM 모듈 시스템 사용

---

## 3. Assumptions (가정)

### 3.1 기술적 가정

- 사용자는 최신 브라우저를 사용합니다
- JavaScript가 활성화된 환경입니다
- 숫자 입력은 표준 십진수 형식을 따릅니다
- 계산 정밀도는 JavaScript Number 타입의 한계를 따릅니다

### 3.2 비즈니스 가정

- 기본 사칙연산(+, -, ×, ÷)이 주요 기능입니다
- 과학 계산기 기능은 추후 확장 예정입니다
- 오프라인 기능은 필요하지 않습니다

### 3.3 사용자 행동 가정

- 사용자는 계산 순서를 이해합니다
- 연산자 우선순위는 왼쪽에서 오른쪽 순서입니다
- 오류 발생 시 Clear 버튼을 사용합니다

---

## 4. Requirements (요구사항)

### 4.1 Ubiquitous Requirements (항상 활성 요구사항)

**REQ-001**: 시스템은 **항상** 숫자 입력을 유효성 검증해야 한다.
- **검증 규칙**: 0-9, 소수점(.), 음수 부호(-)만 허용
- **검증 시점**: 사용자 입력 시 실시간 검증
- **실패 처리**: 잘못된 입력 무시

**REQ-002**: 시스템은 **항상** 계산 결과를 소수점 최대 10자리까지 표현해야 한다.
- **포맷팅**: 불필요한 끝 자리 0 제거
- **반올림**: 11번째 자리에서 반올림
- **표시**: 천 단위 구분 기호(,) 자동 삽입

**REQ-003**: 시스템은 **항상** 0으로 나누기 시도 시 에러를 반환해야 한다.
- **에러 메시지**: "Error: Division by zero"
- **상태 초기화**: 에러 발생 시 계산 상태 리셋
- **사용자 안내**: 에러 메시지 화면 표시

**REQ-004**: 시스템은 **항상** NaN 또는 Infinity 결과를 에러로 처리해야 한다.
- **검증 시점**: 모든 계산 결과 반환 전
- **에러 메시지**: "Error: Invalid calculation"
- **상태 초기화**: 안전한 초기 상태로 복원

### 4.2 Event-Driven Requirements (이벤트 기반 요구사항)

**REQ-005**: **WHEN** 사용자가 숫자 버튼을 클릭하면 **THEN** 현재 입력값에 해당 숫자를 추가해야 한다.
- **조건**: 입력 길이 15자리 이내
- **동작**: display 값 업데이트
- **초과 시**: 추가 입력 무시

**REQ-006**: **WHEN** 사용자가 연산자 버튼(+, -, ×, ÷)을 클릭하면 **THEN** 현재 값을 저장하고 연산자를 등록해야 한다.
- **저장 항목**: 현재 display 값, 선택된 연산자
- **동작**: 새로운 숫자 입력 대기 상태로 전환
- **연속 클릭**: 마지막 연산자로 덮어쓰기

**REQ-007**: **WHEN** 사용자가 등호(=) 버튼을 클릭하면 **THEN** 저장된 피연산자와 현재 값으로 계산을 실행해야 한다.
- **계산 순서**: 첫 번째 피연산자, 연산자, 두 번째 피연산자
- **결과 표시**: display에 계산 결과 표시
- **상태 초기화**: 다음 입력을 위한 상태 준비

**REQ-008**: **WHEN** 사용자가 Clear(C) 버튼을 클릭하면 **THEN** 모든 상태를 초기화해야 한다.
- **초기화 항목**: display, 저장된 피연산자, 연산자
- **초기 값**: "0"
- **즉시 적용**: 버튼 클릭 즉시 초기화

**REQ-009**: **WHEN** 사용자가 소수점(.) 버튼을 클릭하면 **THEN** 현재 입력값에 소수점을 추가해야 한다.
- **조건**: 현재 입력값에 소수점이 없을 때만
- **중복 방지**: 이미 소수점이 있으면 무시
- **빈 입력**: 빈 입력 상태에서는 "0." 추가

**REQ-010**: **WHEN** 계산 중 에러가 발생하면 **THEN** 에러 메시지를 반환하고 상태를 리셋해야 한다.
- **에러 타입**: Division by zero, Invalid calculation, Overflow
- **메시지 표시**: display에 에러 메시지 표시
- **복구 방법**: Clear 버튼 클릭으로 복구

### 4.3 State-Driven Requirements (상태 기반 요구사항)

**REQ-011**: **IF** 현재 입력값이 존재하면 **THEN** 소수점 버튼 클릭 시 소수점을 추가한다.
- **상태 확인**: display 값이 빈 문자열이 아님
- **소수점 확인**: 현재 값에 "."가 없음
- **동작**: 현재 값 뒤에 "." 추가

**REQ-012**: **IF** 연산자가 등록된 상태이면 **THEN** 새로운 숫자 입력은 새로운 피연산자를 시작한다.
- **상태 플래그**: isOperatorPressed = true
- **동작**: display 값 초기화 후 새 숫자 입력
- **플래그 리셋**: 첫 숫자 입력 후 false로 변경

**REQ-013**: **IF** 계산 결과가 표시된 상태이면 **THEN** 숫자 입력 시 새로운 계산을 시작한다.
- **상태 플래그**: isResultDisplayed = true
- **동작**: 이전 결과 클리어 후 새 입력 시작
- **연산자 입력**: 결과를 첫 번째 피연산자로 사용

**REQ-014**: **IF** 입력값이 15자리를 초과하면 **THEN** 추가 입력을 무시한다.
- **제한 이유**: 화면 표시 한계 및 정밀도 보장
- **동작**: 15자리 초과 입력 시 무시
- **사용자 피드백**: 입력 무시 (시각적 피드백 없음)

### 4.4 Unwanted Requirements (금지 요구사항)

**REQ-015**: 시스템은 잘못된 숫자 형식을 **허용하지 않아야** 한다.
- **예시**: "1.2.3", "--5", "12a3"
- **검증**: 입력 시 정규식 검증
- **처리**: 잘못된 문자 자동 제거

**REQ-016**: 시스템은 Infinity를 결과로 **반환하지 않아야** 한다.
- **대신**: "Error: Overflow" 메시지 반환
- **검증**: 계산 결과가 Number.MAX_VALUE 초과 시
- **상태**: 에러 상태로 전환

**REQ-017**: 시스템은 NaN을 결과로 **반환하지 않아야** 한다.
- **대신**: "Error: Invalid calculation" 메시지 반환
- **검증**: 모든 계산 결과에 isNaN() 체크
- **상태**: 에러 상태로 전환

### 4.5 Optional Requirements (선택적 요구사항)

**REQ-018**: **가능하면** 과학적 표기법 변환 기능을 제공한다.
- **조건**: 결과가 1e+10 이상 또는 1e-10 이하
- **형식**: "1.23e+10"
- **우선순위**: 낮음 (Phase 2)

**REQ-019**: **가능하면** 계산 이력 저장 기능을 제공한다.
- **저장 항목**: 수식 및 결과
- **저장 위치**: 로컬 스토리지
- **우선순위**: 낮음 (Phase 2)

---

## 5. Specifications (상세 사양)

### 5.1 핵심 계산 엔진 (calculator.ts)

**함수 시그니처**:

```typescript
export function add(a: number, b: number): number;
export function subtract(a: number, b: number): number;
export function multiply(a: number, b: number): number;
export function divide(a: number, b: number): number | { error: string };
export function calculate(
  firstOperand: number,
  operator: Operator,
  secondOperand: number
): number | { error: string };
```

**타입 정의**:

```typescript
export type Operator = '+' | '-' | '×' | '÷';
```

**계산 로직**:
- 덧셈: a + b
- 뺄셈: a - b
- 곱셈: a × b
- 나눗셈: b가 0이면 에러, 아니면 a ÷ b

**에러 처리**:
- Division by zero: `{ error: "Error: Division by zero" }`
- Invalid result (NaN/Infinity): `{ error: "Error: Invalid calculation" }`

### 5.2 숫자 포맷터 (formatter.ts)

**함수 시그니처**:

```typescript
export function formatNumber(value: number): string;
export function parseFormattedNumber(formatted: string): number;
export function validateNumberInput(input: string): boolean;
```

**포맷팅 규칙**:
- 소수점 최대 10자리
- 불필요한 끝 자리 0 제거
- 천 단위 구분 기호(,) 삽입
- 음수는 앞에 - 부호

**검증 규칙**:
- 정규식: `/^-?\d*\.?\d*$/`
- 길이 제한: 15자리 이내
- 소수점 중복 방지

### 5.3 Zustand 상태 관리 스토어 (useCalculatorStore.ts)

**상태 구조**:

```typescript
interface CalculatorState {
  display: string;
  firstOperand: number | null;
  operator: Operator | null;
  isOperatorPressed: boolean;
  isResultDisplayed: boolean;
}
```

**액션**:

```typescript
interface CalculatorActions {
  inputNumber: (digit: string) => void;
  inputOperator: (operator: Operator) => void;
  inputDecimal: () => void;
  calculate: () => void;
  clear: () => void;
  toggleSign: () => void;
  inputPercent: () => void;
}
```

**초기 상태**:

```typescript
{
  display: "0",
  firstOperand: null,
  operator: null,
  isOperatorPressed: false,
  isResultDisplayed: false
}
```

### 5.4 디렉토리 구조

```
calc.man/
├── src/
│   ├── components/      # UI 컴포넌트 (Phase 2)
│   ├── lib/
│   │   ├── calculator.ts     # 계산 엔진
│   │   ├── formatter.ts      # 숫자 포맷터
│   │   └── types.ts          # TypeScript 타입 정의
│   ├── store/
│   │   └── useCalculatorStore.ts  # Zustand 스토어
│   ├── tests/
│   │   ├── calculator.test.ts    # 계산 엔진 테스트
│   │   ├── formatter.test.ts     # 포맷터 테스트
│   │   └── store.test.ts         # 스토어 테스트
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .moai/
│   └── specs/
│       └── SPEC-CALC-001/
│           ├── spec.md
│           ├── plan.md
│           └── acceptance.md
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── README.md
```

### 5.5 테스트 커버리지 목표

- **전체 목표**: 85% 이상
- **핵심 로직**: calculator.ts, formatter.ts - 100%
- **상태 관리**: useCalculatorStore.ts - 90% 이상
- **UI 컴포넌트**: Phase 2에서 추가

---

## 6. Constraints (제약사항)

### 6.1 기술적 제약사항

- JavaScript Number 타입의 정밀도 한계 (IEEE 754)
- 최대 안전 정수: ±9,007,199,254,740,991 (2^53 - 1)
- 브라우저 호환성: 최신 브라우저만 지원

### 6.2 성능 제약사항

- 계산 응답 시간: 100ms 이내
- 초기 로딩 시간: 3초 이내
- 번들 크기: 300KB 이내

### 6.3 보안 제약사항

- XSS 방지: 사용자 입력 검증
- 입력 길이 제한: 15자리
- eval() 함수 사용 금지

---

## 7. Dependencies (의존성)

### 7.1 외부 라이브러리

- react: ^19.0.0
- react-dom: ^19.0.0
- zustand: ^5.0.0
- tailwindcss: ^4.0.0
- vite: ^6.0.0
- vitest: ^3.0.0
- typescript: ^5.7.0

### 7.2 개발 의존성

- @vitejs/plugin-react: 최신 버전
- @types/react: ^19.0.0
- @types/react-dom: ^19.0.0
- @vitest/ui: ^3.0.0

---

## 8. Risks (리스크)

### 8.1 기술 리스크

| 리스크 | 영향도 | 완화 방안 |
|--------|--------|----------|
| JavaScript 부동소수점 오차 | 중간 | 적절한 반올림 및 정밀도 제한 |
| 브라우저 호환성 문제 | 낮음 | 최신 브라우저만 지원 명시 |
| 테스트 커버리지 미달 | 중간 | TDD 방식 엄격히 준수 |

### 8.2 일정 리스크

| 리스크 | 영향도 | 완화 방안 |
|--------|--------|----------|
| 요구사항 변경 | 낮음 | SPEC 우선 개발로 명확한 범위 정의 |
| 테스트 작성 지연 | 중간 | 구현 전 테스트 작성 원칙 |

---

## 9. Success Criteria (성공 기준)

### 9.1 기능 완성도

- ✅ 모든 기본 사칙연산 동작
- ✅ 소수점 입력 및 계산 정상 동작
- ✅ 에러 처리 정상 동작
- ✅ Clear/Reset 기능 정상 동작

### 9.2 품질 기준

- ✅ 테스트 커버리지 85% 이상 달성
- ✅ 모든 단위 테스트 통과
- ✅ TypeScript 타입 에러 0건
- ✅ ESLint 경고 0건

### 9.3 성능 기준

- ✅ 계산 응답 시간 100ms 이내
- ✅ 번들 크기 300KB 이내
- ✅ Lighthouse Performance 점수 90+ (Phase 2)

---

## 10. Traceability (추적성)

### 10.1 관련 문서

- 없음 (첫 SPEC)

### 10.2 태그

- `#calculator`
- `#typescript`
- `#react`
- `#tdd`
- `#phase-1`

---

## 11. Appendix (부록)

### 11.1 용어 정의

- **피연산자 (Operand)**: 계산의 입력값 (예: 5 + 3에서 5와 3)
- **연산자 (Operator)**: 계산 동작 정의 (+, -, ×, ÷)
- **Display**: 사용자에게 표시되는 현재 값
- **TDD**: Test-Driven Development (테스트 주도 개발)

### 11.2 참고 자료

- [EARS 방법론](https://www.researchgate.net/publication/224079650_EARS_The_Easy_Approach_to_Requirements_Syntax)
- [TypeScript 5.7 Release Notes](https://devblogs.microsoft.com/typescript/)
- [React 19 Documentation](https://react.dev)
- [Vitest Documentation](https://vitest.dev)

---

**문서 승인**: 지니 (2026-02-09)
**다음 단계**: `/moai:2-run SPEC-CALC-001` 실행하여 TDD 구현 시작
