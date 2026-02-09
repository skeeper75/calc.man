# SPEC-CALC-001 인수 기준 (Acceptance Criteria)

**SPEC ID**: SPEC-CALC-001
**제목**: 프로젝트 스캐폴딩 및 핵심 계산 엔진
**작성일**: 2026-02-09
**작성자**: 지니
**테스트 방법**: Given-When-Then 형식 시나리오

---

## 1. 개요

### 1.1 인수 테스트 목적

이 문서는 SPEC-CALC-001의 구현이 요구사항을 충족하는지 검증하기 위한 인수 기준을 정의합니다. 모든 시나리오는 Given-When-Then 형식으로 작성되었으며, 자동화된 테스트 코드로 구현되어야 합니다.

### 1.2 테스트 범위

- 기본 사칙연산 (+, -, ×, ÷)
- 소수점 입력 및 계산
- 0으로 나누기 에러 처리
- 부호 전환 기능
- 퍼센트 계산 기능
- Clear/Reset 기능
- 연속 계산 (체이닝)
- 입력 검증 및 제한

### 1.3 테스트 환경

- **테스트 프레임워크**: Vitest 3
- **테스트 유틸리티**: @testing-library/react (Phase 2)
- **커버리지 도구**: Vitest Coverage
- **최소 커버리지**: 85%

---

## 2. 기본 사칙연산 시나리오

### 시나리오 2.1: 덧셈 계산

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "5", "+", "3", "=" 순서로 입력하면
**Then**: 디스플레이에 "8"이 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-2.1: 덧셈 계산', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('5');
  store.inputOperator('+');
  store.inputNumber('3');
  store.calculate();
  expect(store.display).toBe('8');
});
```

**관련 요구사항**: REQ-005, REQ-006, REQ-007

---

### 시나리오 2.2: 뺄셈 계산

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "10", "-", "4", "=" 순서로 입력하면
**Then**: 디스플레이에 "6"이 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-2.2: 뺄셈 계산', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('1');
  store.inputNumber('0');
  store.inputOperator('-');
  store.inputNumber('4');
  store.calculate();
  expect(store.display).toBe('6');
});
```

**관련 요구사항**: REQ-005, REQ-006, REQ-007

---

### 시나리오 2.3: 곱셈 계산

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "7", "×", "6", "=" 순서로 입력하면
**Then**: 디스플레이에 "42"가 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-2.3: 곱셈 계산', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('7');
  store.inputOperator('×');
  store.inputNumber('6');
  store.calculate();
  expect(store.display).toBe('42');
});
```

**관련 요구사항**: REQ-005, REQ-006, REQ-007

---

### 시나리오 2.4: 나눗셈 계산

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "20", "÷", "4", "=" 순서로 입력하면
**Then**: 디스플레이에 "5"가 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-2.4: 나눗셈 계산', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('2');
  store.inputNumber('0');
  store.inputOperator('÷');
  store.inputNumber('4');
  store.calculate();
  expect(store.display).toBe('5');
});
```

**관련 요구사항**: REQ-005, REQ-006, REQ-007

---

## 3. 소수점 처리 시나리오

### 시나리오 3.1: 소수점 입력

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "3", ".", "1", "4" 순서로 입력하면
**Then**: 디스플레이에 "3.14"가 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-3.1: 소수점 입력', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('3');
  store.inputDecimal();
  store.inputNumber('1');
  store.inputNumber('4');
  expect(store.display).toBe('3.14');
});
```

**관련 요구사항**: REQ-009, REQ-011

---

### 시나리오 3.2: 소수점 중복 입력 방지

**Given**: 계산기 디스플레이가 "3.14"이고
**When**: 사용자가 "." 버튼을 다시 클릭하면
**Then**: 디스플레이는 여전히 "3.14"를 유지해야 한다 (소수점 추가되지 않음)

**테스트 코드 예시**:
```typescript
test('AC-3.2: 소수점 중복 입력 방지', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('3');
  store.inputDecimal();
  store.inputNumber('1');
  store.inputNumber('4');
  store.inputDecimal(); // 두 번째 소수점 시도
  expect(store.display).toBe('3.14');
});
```

**관련 요구사항**: REQ-009, REQ-011

---

### 시나리오 3.3: 빈 입력 상태에서 소수점 클릭

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "." 버튼을 먼저 클릭하면
**Then**: 디스플레이에 "0."이 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-3.3: 빈 입력 상태에서 소수점 클릭', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputDecimal();
  expect(store.display).toBe('0.');
});
```

**관련 요구사항**: REQ-009, REQ-011

---

### 시나리오 3.4: 소수점 계산 결과 포맷팅

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "1", "÷", "3", "=" 순서로 입력하면
**Then**: 디스플레이에 "0.3333333333"이 표시되어야 한다 (소수점 최대 10자리)

**테스트 코드 예시**:
```typescript
test('AC-3.4: 소수점 계산 결과 포맷팅', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('1');
  store.inputOperator('÷');
  store.inputNumber('3');
  store.calculate();
  expect(store.display).toBe('0.3333333333');
});
```

**관련 요구사항**: REQ-002

---

### 시나리오 3.5: 불필요한 끝 자리 0 제거

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "5", "÷", "2", "=" 순서로 입력하면
**Then**: 디스플레이에 "2.5"가 표시되어야 한다 ("2.50000..." 아님)

**테스트 코드 예시**:
```typescript
test('AC-3.5: 불필요한 끝 자리 0 제거', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('5');
  store.inputOperator('÷');
  store.inputNumber('2');
  store.calculate();
  expect(store.display).toBe('2.5');
});
```

**관련 요구사항**: REQ-002

---

## 4. 0으로 나누기 에러 처리

### 시나리오 4.1: 0으로 나누기 시도

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "10", "÷", "0", "=" 순서로 입력하면
**Then**: 디스플레이에 "Error: Division by zero"가 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-4.1: 0으로 나누기 시도', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('1');
  store.inputNumber('0');
  store.inputOperator('÷');
  store.inputNumber('0');
  store.calculate();
  expect(store.display).toBe('Error: Division by zero');
});
```

**관련 요구사항**: REQ-003, REQ-010

---

### 시나리오 4.2: 에러 후 Clear 버튼으로 복구

**Given**: 디스플레이가 "Error: Division by zero" 상태이고
**When**: 사용자가 "C" (Clear) 버튼을 클릭하면
**Then**: 디스플레이가 "0"으로 초기화되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-4.2: 에러 후 Clear 버튼으로 복구', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('1');
  store.inputOperator('÷');
  store.inputNumber('0');
  store.calculate();
  expect(store.display).toBe('Error: Division by zero');

  store.clear();
  expect(store.display).toBe('0');
  expect(store.firstOperand).toBeNull();
  expect(store.operator).toBeNull();
});
```

**관련 요구사항**: REQ-008, REQ-010

---

### 시나리오 4.3: NaN 결과 에러 처리

**Given**: 계산기가 초기 상태("0")이고
**When**: 계산 결과가 NaN이 되는 경우
**Then**: 디스플레이에 "Error: Invalid calculation"이 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-4.3: NaN 결과 에러 처리', () => {
  // 직접 calculate 함수 테스트
  const result = calculate(0, '÷', 0); // 0/0 = NaN
  expect(result).toEqual({ error: 'Error: Invalid calculation' });
});
```

**관련 요구사항**: REQ-004, REQ-017

---

### 시나리오 4.4: Infinity 결과 에러 처리

**Given**: 계산기가 초기 상태("0")이고
**When**: 계산 결과가 Number.MAX_VALUE를 초과하는 경우
**Then**: 디스플레이에 "Error: Invalid calculation"이 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-4.4: Infinity 결과 에러 처리', () => {
  const result = calculate(Number.MAX_VALUE, '×', 2);
  expect(result).toEqual({ error: 'Error: Invalid calculation' });
});
```

**관련 요구사항**: REQ-004, REQ-016

---

## 5. 부호 전환 기능

### 시나리오 5.1: 양수를 음수로 전환

**Given**: 계산기 디스플레이가 "42"이고
**When**: 사용자가 "+/-" 버튼을 클릭하면
**Then**: 디스플레이에 "-42"가 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-5.1: 양수를 음수로 전환', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('4');
  store.inputNumber('2');
  store.toggleSign();
  expect(store.display).toBe('-42');
});
```

**관련 요구사항**: (추가 요구사항 - 기본 기능)

---

### 시나리오 5.2: 음수를 양수로 전환

**Given**: 계산기 디스플레이가 "-42"이고
**When**: 사용자가 "+/-" 버튼을 다시 클릭하면
**Then**: 디스플레이에 "42"가 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-5.2: 음수를 양수로 전환', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('4');
  store.inputNumber('2');
  store.toggleSign();
  expect(store.display).toBe('-42');

  store.toggleSign();
  expect(store.display).toBe('42');
});
```

**관련 요구사항**: (추가 요구사항 - 기본 기능)

---

### 시나리오 5.3: 0의 부호 전환

**Given**: 계산기 디스플레이가 "0"이고
**When**: 사용자가 "+/-" 버튼을 클릭하면
**Then**: 디스플레이는 여전히 "0"을 유지해야 한다 ("-0" 아님)

**테스트 코드 예시**:
```typescript
test('AC-5.3: 0의 부호 전환', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.toggleSign();
  expect(store.display).toBe('0');
});
```

**관련 요구사항**: (추가 요구사항 - 엣지 케이스)

---

## 6. 퍼센트 계산 기능

### 시나리오 6.1: 퍼센트 변환

**Given**: 계산기 디스플레이가 "50"이고
**When**: 사용자가 "%" 버튼을 클릭하면
**Then**: 디스플레이에 "0.5"가 표시되어야 한다 (50% = 0.5)

**테스트 코드 예시**:
```typescript
test('AC-6.1: 퍼센트 변환', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('5');
  store.inputNumber('0');
  store.inputPercent();
  expect(store.display).toBe('0.5');
});
```

**관련 요구사항**: (추가 요구사항 - 기본 기능)

---

### 시나리오 6.2: 퍼센트 계산 (할인율 예시)

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "200", "-", "20", "%", "=" 순서로 입력하면
**Then**: 디스플레이에 "160"이 표시되어야 한다 (200의 20% 할인 = 200 - 40 = 160)

**테스트 코드 예시**:
```typescript
test('AC-6.2: 퍼센트 계산 (할인율 예시)', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('2');
  store.inputNumber('0');
  store.inputNumber('0');
  store.inputOperator('-');
  store.inputNumber('2');
  store.inputNumber('0');
  store.inputPercent();
  store.calculate();
  expect(store.display).toBe('160');
});
```

**관련 요구사항**: (추가 요구사항 - 고급 기능)

---

## 7. Clear/Reset 기능

### 시나리오 7.1: Clear 버튼으로 전체 초기화

**Given**: 계산기 디스플레이가 "123"이고 피연산자와 연산자가 저장된 상태이고
**When**: 사용자가 "C" (Clear) 버튼을 클릭하면
**Then**: 디스플레이가 "0"으로 초기화되고 모든 상태가 리셋되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-7.1: Clear 버튼으로 전체 초기화', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('1');
  store.inputNumber('2');
  store.inputNumber('3');
  store.inputOperator('+');
  store.inputNumber('4');

  store.clear();

  expect(store.display).toBe('0');
  expect(store.firstOperand).toBeNull();
  expect(store.operator).toBeNull();
  expect(store.isOperatorPressed).toBe(false);
  expect(store.isResultDisplayed).toBe(false);
});
```

**관련 요구사항**: REQ-008

---

### 시나리오 7.2: 에러 상태에서 Clear 복구

**Given**: 디스플레이가 에러 메시지 상태이고
**When**: 사용자가 "C" 버튼을 클릭하면
**Then**: 정상 초기 상태("0")로 복구되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-7.2: 에러 상태에서 Clear 복구', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('1');
  store.inputOperator('÷');
  store.inputNumber('0');
  store.calculate();

  expect(store.display).toContain('Error');

  store.clear();

  expect(store.display).toBe('0');
  expect(store.firstOperand).toBeNull();
});
```

**관련 요구사항**: REQ-008, REQ-010

---

## 8. 연속 계산 (체이닝)

### 시나리오 8.1: 결과를 이어서 계산

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "5", "+", "3", "=", "+", "2", "=" 순서로 입력하면
**Then**: 첫 번째 "=" 후 "8" 표시, 두 번째 "=" 후 "10" 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-8.1: 결과를 이어서 계산', () => {
  const store = useCalculatorStore.getState();
  store.clear();

  // 5 + 3 = 8
  store.inputNumber('5');
  store.inputOperator('+');
  store.inputNumber('3');
  store.calculate();
  expect(store.display).toBe('8');

  // 8 + 2 = 10
  store.inputOperator('+');
  store.inputNumber('2');
  store.calculate();
  expect(store.display).toBe('10');
});
```

**관련 요구사항**: REQ-013

---

### 시나리오 8.2: 연산자 연속 클릭 시 덮어쓰기

**Given**: 계산기 디스플레이가 "5"이고
**When**: 사용자가 "+", "-", "×" 순서로 연산자를 연속 클릭하면
**Then**: 마지막 연산자 "×"만 등록되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-8.2: 연산자 연속 클릭 시 덮어쓰기', () => {
  const store = useCalculatorStore.getState();
  store.clear();
  store.inputNumber('5');
  store.inputOperator('+');
  store.inputOperator('-');
  store.inputOperator('×');

  expect(store.operator).toBe('×');

  store.inputNumber('3');
  store.calculate();
  expect(store.display).toBe('15'); // 5 × 3 = 15
});
```

**관련 요구사항**: REQ-006

---

### 시나리오 8.3: 복잡한 체이닝 계산

**Given**: 계산기가 초기 상태("0")이고
**When**: 사용자가 "10", "+", "5", "=", "-", "3", "=", "×", "2", "=" 순서로 입력하면
**Then**: 최종 결과는 "24"가 표시되어야 한다 ((10 + 5 = 15) - 3 = 12) × 2 = 24)

**테스트 코드 예시**:
```typescript
test('AC-8.3: 복잡한 체이닝 계산', () => {
  const store = useCalculatorStore.getState();
  store.clear();

  // 10 + 5 = 15
  store.inputNumber('1');
  store.inputNumber('0');
  store.inputOperator('+');
  store.inputNumber('5');
  store.calculate();
  expect(store.display).toBe('15');

  // 15 - 3 = 12
  store.inputOperator('-');
  store.inputNumber('3');
  store.calculate();
  expect(store.display).toBe('12');

  // 12 × 2 = 24
  store.inputOperator('×');
  store.inputNumber('2');
  store.calculate();
  expect(store.display).toBe('24');
});
```

**관련 요구사항**: REQ-007, REQ-013

---

## 9. 입력 검증 및 제한

### 시나리오 9.1: 15자리 입력 제한

**Given**: 계산기 디스플레이가 "123456789012345" (15자리)이고
**When**: 사용자가 추가로 "6"을 입력하면
**Then**: 디스플레이는 여전히 "123456789012345"를 유지해야 한다 (16번째 자리 무시)

**테스트 코드 예시**:
```typescript
test('AC-9.1: 15자리 입력 제한', () => {
  const store = useCalculatorStore.getState();
  store.clear();

  // 15자리 입력
  for (let i = 0; i < 15; i++) {
    store.inputNumber('1');
  }
  expect(store.display.length).toBe(15);

  // 16번째 입력 시도
  store.inputNumber('6');
  expect(store.display.length).toBe(15); // 여전히 15자리
});
```

**관련 요구사항**: REQ-014

---

### 시나리오 9.2: 잘못된 입력 문자 필터링

**Given**: 계산기가 초기 상태("0")이고
**When**: 프로그래밍 방식으로 "12a3" 문자열을 검증하면
**Then**: validateNumberInput 함수는 false를 반환해야 한다

**테스트 코드 예시**:
```typescript
test('AC-9.2: 잘못된 입력 문자 필터링', () => {
  expect(validateNumberInput('12a3')).toBe(false);
  expect(validateNumberInput('12.34.56')).toBe(false);
  expect(validateNumberInput('--5')).toBe(false);
  expect(validateNumberInput('123')).toBe(true);
  expect(validateNumberInput('12.34')).toBe(true);
  expect(validateNumberInput('-5')).toBe(true);
});
```

**관련 요구사항**: REQ-001, REQ-015

---

### 시나리오 9.3: 숫자 포맷 검증 (정규식)

**Given**: 다양한 숫자 형식 문자열이 주어지고
**When**: validateNumberInput 함수로 검증하면
**Then**: 유효한 숫자 형식만 true를 반환해야 한다

**테스트 코드 예시**:
```typescript
test('AC-9.3: 숫자 포맷 검증 (정규식)', () => {
  // 유효한 형식
  expect(validateNumberInput('0')).toBe(true);
  expect(validateNumberInput('123')).toBe(true);
  expect(validateNumberInput('123.45')).toBe(true);
  expect(validateNumberInput('-123')).toBe(true);
  expect(validateNumberInput('-123.45')).toBe(true);
  expect(validateNumberInput('0.5')).toBe(true);

  // 잘못된 형식
  expect(validateNumberInput('1.2.3')).toBe(false);
  expect(validateNumberInput('abc')).toBe(false);
  expect(validateNumberInput('12a3')).toBe(false);
  expect(validateNumberInput('--5')).toBe(false);
  expect(validateNumberInput('1'.repeat(16))).toBe(false); // 16자리
});
```

**관련 요구사항**: REQ-001, REQ-015

---

## 10. 포맷팅 검증

### 시나리오 10.1: 천 단위 구분 기호 삽입

**Given**: 계산 결과가 큰 정수일 때
**When**: formatNumber 함수로 포맷팅하면
**Then**: 천 단위 구분 기호(,)가 올바르게 삽입되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-10.1: 천 단위 구분 기호 삽입', () => {
  expect(formatNumber(1234567)).toBe('1,234,567');
  expect(formatNumber(1000)).toBe('1,000');
  expect(formatNumber(999)).toBe('999');
  expect(formatNumber(-1234567)).toBe('-1,234,567');
});
```

**관련 요구사항**: REQ-002

---

### 시나리오 10.2: 소수점 자리수 제한

**Given**: 계산 결과가 소수점 10자리를 초과할 때
**When**: formatNumber 함수로 포맷팅하면
**Then**: 11번째 자리에서 반올림되고 최대 10자리까지만 표시되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-10.2: 소수점 자리수 제한', () => {
  expect(formatNumber(1.123456789012)).toBe('1.1234567890');
  expect(formatNumber(0.333333333333)).toBe('0.3333333333');
  expect(formatNumber(1 / 3)).toBe('0.3333333333');
});
```

**관련 요구사항**: REQ-002

---

### 시나리오 10.3: 불필요한 끝 자리 0 제거

**Given**: 계산 결과가 정수로 떨어지거나 끝에 0이 있을 때
**When**: formatNumber 함수로 포맷팅하면
**Then**: 불필요한 끝 자리 0이 제거되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-10.3: 불필요한 끝 자리 0 제거', () => {
  expect(formatNumber(12.5000)).toBe('12.5');
  expect(formatNumber(100.0000)).toBe('100');
  expect(formatNumber(0.1000)).toBe('0.1');
  expect(formatNumber(3.1400)).toBe('3.14');
});
```

**관련 요구사항**: REQ-002

---

## 11. 품질 게이트 검증

### 시나리오 11.1: 전체 테스트 커버리지 확인

**Given**: 모든 구현 코드가 완료된 상태이고
**When**: `npm run test:coverage` 명령을 실행하면
**Then**: 전체 커버리지가 85% 이상이어야 한다

**검증 방법**:
```bash
npm run test:coverage
```

**통과 기준**:
- Overall coverage: >= 85%
- calculator.ts: 100%
- formatter.ts: 100%
- useCalculatorStore.ts: >= 90%

**관련 요구사항**: TRUST 5 Framework - Tested

---

### 시나리오 11.2: TypeScript 타입 에러 0건

**Given**: 모든 구현 코드가 완료된 상태이고
**When**: `tsc --noEmit` 명령을 실행하면
**Then**: 타입 에러가 0건이어야 한다

**검증 방법**:
```bash
npx tsc --noEmit
```

**통과 기준**:
- 출력 메시지: "Found 0 errors"

**관련 요구사항**: TRUST 5 Framework - Readable

---

### 시나리오 11.3: ESLint 경고 0건

**Given**: 모든 구현 코드가 완료된 상태이고
**When**: ESLint 검사를 실행하면
**Then**: 경고 및 에러가 0건이어야 한다

**검증 방법**:
```bash
npm run lint
```

**통과 기준**:
- 출력 메시지: "0 errors, 0 warnings"

**관련 요구사항**: TRUST 5 Framework - Unified

---

## 12. 성능 검증

### 시나리오 12.1: 계산 응답 시간 100ms 이내

**Given**: 복잡한 계산 작업이 실행될 때
**When**: 계산 실행 시간을 측정하면
**Then**: 100ms 이내에 완료되어야 한다

**테스트 코드 예시**:
```typescript
test('AC-12.1: 계산 응답 시간 100ms 이내', () => {
  const startTime = performance.now();

  const result = calculate(123456, '×', 789012);

  const endTime = performance.now();
  const duration = endTime - startTime;

  expect(duration).toBeLessThan(100);
  expect(typeof result).toBe('number');
});
```

**관련 요구사항**: 성능 제약사항

---

### 시나리오 12.2: 번들 크기 300KB 이내

**Given**: 프로젝트 빌드가 완료된 상태이고
**When**: dist 디렉토리의 번들 크기를 확인하면
**Then**: 300KB 이내여야 한다

**검증 방법**:
```bash
npm run build
du -sh dist/
```

**통과 기준**:
- dist 폴더 총 크기 <= 300KB

**관련 요구사항**: 성능 제약사항

---

## 13. 완료 체크리스트

### 13.1 기능 완성도

- [ ] AC-2.1 ~ AC-2.4: 기본 사칙연산 모두 통과
- [ ] AC-3.1 ~ AC-3.5: 소수점 처리 모두 통과
- [ ] AC-4.1 ~ AC-4.4: 에러 처리 모두 통과
- [ ] AC-5.1 ~ AC-5.3: 부호 전환 모두 통과
- [ ] AC-6.1 ~ AC-6.2: 퍼센트 계산 모두 통과
- [ ] AC-7.1 ~ AC-7.2: Clear 기능 모두 통과
- [ ] AC-8.1 ~ AC-8.3: 연속 계산 모두 통과
- [ ] AC-9.1 ~ AC-9.3: 입력 검증 모두 통과
- [ ] AC-10.1 ~ AC-10.3: 포맷팅 모두 통과

### 13.2 품질 게이트

- [ ] AC-11.1: 테스트 커버리지 85% 이상
- [ ] AC-11.2: TypeScript 타입 에러 0건
- [ ] AC-11.3: ESLint 경고 0건

### 13.3 성능 기준

- [ ] AC-12.1: 계산 응답 시간 100ms 이내
- [ ] AC-12.2: 번들 크기 300KB 이내

### 13.4 문서화

- [ ] README.md 작성 완료
- [ ] 주요 함수 JSDoc 주석 추가
- [ ] SPEC 문서와 코드 일치 확인

---

## 14. 테스트 실행 가이드

### 14.1 개별 테스트 실행

```bash
# 특정 테스트 파일 실행
npm run test calculator.test.ts

# 특정 테스트 케이스 실행
npm run test -- --grep "AC-2.1"
```

### 14.2 전체 테스트 실행

```bash
# 모든 테스트 실행
npm run test

# 커버리지 포함 실행
npm run test:coverage

# UI 모드 실행
npm run test:ui
```

### 14.3 지속적 테스트 (Watch Mode)

```bash
# 파일 변경 시 자동 재실행
npm run test:watch
```

---

**작성자**: 지니
**승인 날짜**: 2026-02-09
**총 시나리오 수**: 36개 (기능 27개 + 품질 3개 + 성능 2개 + 문서 1개)
**예상 테스트 수**: 약 70개 (각 시나리오당 1-3개 테스트 케이스)
