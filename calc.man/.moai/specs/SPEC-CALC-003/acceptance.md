---
spec_id: SPEC-CALC-003
version: "1.0.0"
created: "2026-02-09"
updated: "2026-02-09"
test_framework: "Playwright + Vitest"
---

# SPEC-CALC-003 인수 기준

## 개요

계산 이력, 키보드 입력, 클립보드 기능에 대한 상세 인수 기준을 Given-When-Then 형식으로 정의합니다.

---

## 시나리오 1: 계산 결과를 이력에 저장

**기능**: 계산 완료 시 자동으로 SQLite에 저장

**우선순위**: 높음

**Given**: 계산기가 초기화되어 있고 데이터베이스가 준비되어 있다

**When**: 사용자가 "2 + 3 =" 계산을 완료한다

**Then**:
- 계산 결과 "5"가 디스플레이에 표시된다
- 데이터베이스에 새로운 레코드가 삽입된다
- 레코드 필드:
  - `expression`: "2 + 3"
  - `result`: "5"
  - `timestamp`: 현재 Unix epoch
  - `created_at`: ISO 8601 형식 타임스탬프
- 저장 작업이 100ms 이내에 완료된다

**테스트 구현**:

```typescript
test('계산 결과가 이력에 자동 저장된다', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.waitForSelector('[data-testid="calculator-display"]');

  // When
  await page.click('[data-testid="btn-2"]');
  await page.click('[data-testid="btn-add"]');
  await page.click('[data-testid="btn-3"]');
  await page.click('[data-testid="btn-equals"]');

  // Then
  const display = page.locator('[data-testid="calculator-display"]');
  await expect(display).toHaveText('5');

  // 데이터베이스 확인
  const historyCount = await page.evaluate(() => {
    return window.__testDB.exec('SELECT COUNT(*) FROM calculations')[0].values[0][0];
  });
  expect(historyCount).toBe(1);

  // 레코드 내용 확인
  const record = await page.evaluate(() => {
    return window.__testDB.exec('SELECT * FROM calculations')[0].values[0];
  });
  expect(record[1]).toBe('2 + 3'); // expression
  expect(record[2]).toBe('5'); // result
});
```

---

## 시나리오 2: 이력 패널 조회

**기능**: 최근 20개의 계산 이력을 패널에 표시

**우선순위**: 높음

**Given**:
- 데이터베이스에 5개의 계산 이력이 저장되어 있다
- 이력 항목: "1+1=2", "3+4=7", "10-5=5", "6*7=42", "20/4=5"

**When**: 사용자가 이력 패널을 연다

**Then**:
- 5개의 이력 항목이 역순(최신 순)으로 표시된다
- 각 항목은 다음 형식으로 표시된다: "expression = result"
- 첫 번째 항목은 "20/4=5"이다
- 마지막 항목은 "1+1=2"이다
- 패널 로드가 200ms 이내에 완료된다

**테스트 구현**:

```typescript
test('이력 패널에 최근 계산 내역이 표시된다', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.evaluate(() => {
    const db = window.__testDB;
    const testData = [
      ['1+1', '2'],
      ['3+4', '7'],
      ['10-5', '5'],
      ['6*7', '42'],
      ['20/4', '5']
    ];
    testData.forEach(([expr, result]) => {
      db.run('INSERT INTO calculations (expression, result, timestamp) VALUES (?, ?, ?)',
        [expr, result, Date.now()]);
    });
  });

  // When
  await page.click('[data-testid="history-toggle"]');

  // Then
  await expect(page.locator('[data-testid="history-panel"]')).toBeVisible();

  const items = page.locator('[data-testid="history-item"]');
  await expect(items).toHaveCount(5);

  // 최신 항목이 첫 번째
  await expect(items.first()).toContainText('20/4=5');

  // 가장 오래된 항목이 마지막
  await expect(items.last()).toContainText('1+1=2');
});
```

---

## 시나리오 3: 이력 항목에서 계산 복원

**기능**: 이력 항목 클릭 시 해당 계산을 디스플레이에 복원

**우선순위**: 높음

**Given**:
- 이력 패널이 열려 있다
- 이력에 "8 * 9 = 72" 항목이 있다

**When**: 사용자가 "8 * 9 = 72" 이력 항목을 클릭한다

**Then**:
- 디스플레이에 "72"가 표시된다
- 계산 상태가 "8 * 9"로 복원된다
- 이력 패널이 자동으로 닫힌다

**테스트 구현**:

```typescript
test('이력 항목 클릭 시 계산이 복원된다', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.evaluate(() => {
    window.__testDB.run(
      'INSERT INTO calculations (expression, result, timestamp) VALUES (?, ?, ?)',
      ['8 * 9', '72', Date.now()]
    );
  });
  await page.click('[data-testid="history-toggle"]');

  // When
  await page.click('[data-testid="history-item"]:has-text("8 * 9")');

  // Then
  const display = page.locator('[data-testid="calculator-display"]');
  await expect(display).toHaveText('72');

  // 이력 패널 닫힘 확인
  await expect(page.locator('[data-testid="history-panel"]')).not.toBeVisible();
});
```

---

## 시나리오 4: 숫자 키보드 입력

**기능**: 키보드 0-9 키로 숫자 입력

**우선순위**: 높음

**Given**: 계산기가 초기 상태(디스플레이 "0")이다

**When**: 사용자가 키보드로 "4", "2"를 순서대로 입력한다

**Then**:
- 디스플레이에 "42"가 표시된다
- 키보드 입력이 버튼 클릭과 동일하게 동작한다

**테스트 구현**:

```typescript
test('키보드 숫자 키로 입력할 수 있다', async ({ page }) => {
  // Given
  await page.goto('/');

  // When
  await page.keyboard.press('4');
  await page.keyboard.press('2');

  // Then
  const display = page.locator('[data-testid="calculator-display"]');
  await expect(display).toHaveText('42');
});
```

---

## 시나리오 5: 연산자 키보드 입력

**기능**: 키보드 +, -, *, / 키로 연산자 입력

**우선순위**: 높음

**Given**: 디스플레이에 "10"이 입력되어 있다

**When**: 사용자가 키보드로 "+", "5"를 순서대로 입력한다

**Then**:
- 디스플레이에 "5"가 표시된다 (연산자 입력 후 다음 숫자)
- "+" 연산자가 적용된 상태이다

**테스트 구현**:

```typescript
test('키보드 연산자 키로 입력할 수 있다', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.keyboard.press('1');
  await page.keyboard.press('0');

  // When
  await page.keyboard.press('+');
  await page.keyboard.press('5');

  // Then
  const display = page.locator('[data-testid="calculator-display"]');
  await expect(display).toHaveText('5');

  // 계산 실행 시 결과 확인
  await page.keyboard.press('Enter');
  await expect(display).toHaveText('15');
});
```

---

## 시나리오 6: Enter와 Escape 키 동작

**기능**: Enter로 계산 실행, Escape로 초기화

**우선순위**: 높음

**Given**: 디스플레이에 "7 + 8"이 입력되어 있다

**When**: 사용자가 Enter 키를 누른다

**Then**:
- 디스플레이에 "15"가 표시된다 (계산 결과)
- 이력에 "7 + 8 = 15"가 저장된다

**And When**: 사용자가 Escape 키를 누른다

**Then**:
- 디스플레이가 "0"으로 초기화된다
- 모든 계산 상태가 리셋된다

**테스트 구현**:

```typescript
test('Enter로 계산, Escape로 초기화', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.keyboard.press('7');
  await page.keyboard.press('+');
  await page.keyboard.press('8');

  // When: Enter로 계산
  await page.keyboard.press('Enter');

  // Then: 결과 표시
  const display = page.locator('[data-testid="calculator-display"]');
  await expect(display).toHaveText('15');

  // And When: Escape로 초기화
  await page.keyboard.press('Escape');

  // Then: 초기 상태
  await expect(display).toHaveText('0');
});
```

---

## 시나리오 7: 클립보드에 복사

**기능**: Ctrl+C / Cmd+C로 디스플레이 값 복사

**우선순위**: 중간

**Given**: 디스플레이에 "123.45"가 표시되어 있다

**When**: 사용자가 Ctrl+C (Windows) 또는 Cmd+C (macOS)를 누른다

**Then**:
- 클립보드에 "123.45"가 복사된다
- 시각적 피드백이 표시된다 (예: 토스트 메시지)

**테스트 구현**:

```typescript
test('Ctrl+C로 디스플레이 값을 클립보드에 복사', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.keyboard.press('1');
  await page.keyboard.press('2');
  await page.keyboard.press('3');
  await page.keyboard.press('.');
  await page.keyboard.press('4');
  await page.keyboard.press('5');

  // When
  const isMac = process.platform === 'darwin';
  await page.keyboard.press(isMac ? 'Meta+c' : 'Control+c');

  // Then
  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText()
  );
  expect(clipboardText).toBe('123.45');

  // 피드백 확인
  await expect(page.locator('[data-testid="toast"]')).toContainText('복사됨');
});
```

---

## 시나리오 8: 클립보드에서 붙여넣기

**기능**: Ctrl+V / Cmd+V로 숫자 붙여넣기

**우선순위**: 중간

**Given**:
- 클립보드에 "999"가 복사되어 있다
- 디스플레이가 초기 상태 "0"이다

**When**: 사용자가 Ctrl+V (Windows) 또는 Cmd+V (macOS)를 누른다

**Then**:
- 디스플레이에 "999"가 입력된다
- 후속 연산이 가능하다

**And Given**: 클립보드에 "abc" (유효하지 않은 값)가 있다

**When**: 사용자가 붙여넣기를 시도한다

**Then**:
- 붙여넣기가 무시된다
- 디스플레이 값이 변경되지 않는다
- 에러 메시지가 표시된다 (선택사항)

**테스트 구현**:

```typescript
test('Ctrl+V로 유효한 숫자를 붙여넣기', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.evaluate(() => navigator.clipboard.writeText('999'));

  // When
  const isMac = process.platform === 'darwin';
  await page.keyboard.press(isMac ? 'Meta+v' : 'Control+v');

  // Then
  const display = page.locator('[data-testid="calculator-display"]');
  await expect(display).toHaveText('999');

  // 후속 연산 가능
  await page.keyboard.press('+');
  await page.keyboard.press('1');
  await page.keyboard.press('Enter');
  await expect(display).toHaveText('1000');
});

test('유효하지 않은 값은 붙여넣기 무시', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.evaluate(() => navigator.clipboard.writeText('abc'));

  // When
  const isMac = process.platform === 'darwin';
  await page.keyboard.press(isMac ? 'Meta+v' : 'Control+v');

  // Then
  const display = page.locator('[data-testid="calculator-display"]');
  await expect(display).toHaveText('0'); // 변경 없음
});
```

---

## 시나리오 9: 브라우저 세션 간 이력 유지

**기능**: 페이지 새로고침 후에도 이력 유지

**우선순위**: 높음

**Given**:
- 사용자가 "5 + 5 = 10" 계산을 완료했다
- 이력이 데이터베이스에 저장되었다

**When**: 사용자가 페이지를 새로고침한다

**Then**:
- 이력 패널을 열면 "5 + 5 = 10" 항목이 표시된다
- 저장된 모든 이력이 유지된다

**테스트 구현**:

```typescript
test('페이지 새로고침 후에도 이력이 유지된다', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.keyboard.press('5');
  await page.keyboard.press('+');
  await page.keyboard.press('5');
  await page.keyboard.press('Enter');

  // 저장 확인
  await page.waitForTimeout(100); // 저장 대기

  // When
  await page.reload();

  // Then
  await page.click('[data-testid="history-toggle"]');
  const items = page.locator('[data-testid="history-item"]');
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText('5 + 5');
  await expect(items.first()).toContainText('10');
});
```

---

## 시나리오 10: 20개 이력 제한

**기능**: UI에 최근 20개 항목만 표시

**우선순위**: 중간

**Given**: 데이터베이스에 25개의 계산 이력이 저장되어 있다

**When**: 사용자가 이력 패널을 연다

**Then**:
- 최근 20개 항목만 표시된다
- 가장 오래된 5개 항목은 표시되지 않는다
- 데이터베이스에는 여전히 25개가 존재한다 (삭제 안 됨)

**테스트 구현**:

```typescript
test('이력 패널에 최대 20개 항목만 표시', async ({ page }) => {
  // Given
  await page.goto('/');
  await page.evaluate(() => {
    const db = window.__testDB;
    for (let i = 1; i <= 25; i++) {
      db.run(
        'INSERT INTO calculations (expression, result, timestamp) VALUES (?, ?, ?)',
        [`${i}+${i}`, `${i*2}`, Date.now() + i]
      );
    }
  });

  // When
  await page.click('[data-testid="history-toggle"]');

  // Then
  const items = page.locator('[data-testid="history-item"]');
  await expect(items).toHaveCount(20);

  // 최신 항목 (25+25) 표시
  await expect(items.first()).toContainText('25+25');

  // 가장 오래된 표시 항목 (6+6)
  await expect(items.last()).toContainText('6+6');

  // DB에는 여전히 25개 존재
  const dbCount = await page.evaluate(() => {
    return window.__testDB.exec('SELECT COUNT(*) FROM calculations')[0].values[0][0];
  });
  expect(dbCount).toBe(25);
});
```

---

## 성능 인수 기준

### 데이터베이스 초기화

**기준**: 3초 이내

**측정 방법**:

```typescript
test('데이터베이스 초기화가 3초 이내에 완료', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('/');
  await page.waitForSelector('[data-testid="calculator-display"]');

  const initTime = Date.now() - startTime;
  expect(initTime).toBeLessThan(3000);
});
```

---

### 이력 저장 속도

**기준**: 100ms 이내

**측정 방법**:

```typescript
test('계산 저장이 100ms 이내에 완료', async ({ page }) => {
  await page.goto('/');

  const startTime = Date.now();

  await page.keyboard.press('1');
  await page.keyboard.press('+');
  await page.keyboard.press('1');
  await page.keyboard.press('Enter');

  // 저장 완료 대기
  await page.waitForFunction(() => {
    return window.__testDB.exec('SELECT COUNT(*) FROM calculations')[0].values[0][0] > 0;
  });

  const saveTime = Date.now() - startTime;
  expect(saveTime).toBeLessThan(100);
});
```

---

### 키보드 반응 속도

**기준**: 50ms 이내

**측정 방법**:

```typescript
test('키보드 입력 반응이 50ms 이내', async ({ page }) => {
  await page.goto('/');

  const startTime = Date.now();
  await page.keyboard.press('9');

  // 디스플레이 업데이트 대기
  await page.waitForFunction(() => {
    return document.querySelector('[data-testid="calculator-display"]')?.textContent === '9';
  });

  const responseTime = Date.now() - startTime;
  expect(responseTime).toBeLessThan(50);
});
```

---

## 접근성 인수 기준

### 키보드 전용 내비게이션

**기준**: 모든 기능을 키보드만으로 사용 가능

**테스트**:

```typescript
test('키보드만으로 전체 계산 흐름 완료', async ({ page }) => {
  await page.goto('/');

  // 계산 수행
  await page.keyboard.press('2');
  await page.keyboard.press('*');
  await page.keyboard.press('3');
  await page.keyboard.press('Enter');

  // 결과 확인
  const display = page.locator('[data-testid="calculator-display"]');
  await expect(display).toHaveText('6');

  // 복사
  await page.keyboard.press('Control+c');

  // 초기화
  await page.keyboard.press('Escape');
  await expect(display).toHaveText('0');

  // 붙여넣기
  await page.keyboard.press('Control+v');
  await expect(display).toHaveText('6');
});
```

---

## 보안 인수 기준

### SQL Injection 방어

**기준**: 모든 쿼리는 Prepared Statements 사용

**테스트**:

```typescript
test('SQL Injection 시도가 차단된다', async ({ page }) => {
  await page.goto('/');

  // 악의적 입력 시도
  await page.evaluate(() => {
    return window.__testStore.getState().historyStore.saveCalculation(
      "'; DROP TABLE calculations; --",
      "0"
    );
  });

  // 테이블 존재 확인
  const tableExists = await page.evaluate(() => {
    try {
      window.__testDB.exec('SELECT COUNT(*) FROM calculations');
      return true;
    } catch {
      return false;
    }
  });

  expect(tableExists).toBe(true);
});
```

---

## Definition of Done

다음 조건을 모두 충족해야 SPEC-CALC-003이 완료된 것으로 간주됩니다:

### 기능 완성도

- ✅ 모든 9개 Given/When/Then 시나리오 통과
- ✅ 키보드 입력 (숫자, 연산자, Enter, Escape) 정상 동작
- ✅ 클립보드 복사/붙여넣기 정상 동작
- ✅ 이력 저장 및 조회 정상 동작
- ✅ 브라우저 세션 간 데이터 영구 보존

### 품질 지표

- ✅ 테스트 커버리지 85% 이상
- ✅ TypeScript 타입 에러 0건
- ✅ ESLint 경고 0건
- ✅ 보안 취약점 0건 (SQL Injection 방어)

### 성능 지표

- ✅ 데이터베이스 초기화 3초 이내
- ✅ 이력 저장 100ms 이내
- ✅ 키보드 반응 50ms 이내
- ✅ 이력 조회 200ms 이내

### 문서화

- ✅ API 문서 업데이트
- ✅ 사용자 가이드 업데이트 (키보드 단축키)
- ✅ CHANGELOG 항목 추가

---

**작성일**: 2026-02-09
**버전**: 1.0.0
**총 시나리오 수**: 10개 (필수 9개 + 성능/보안 1개)
