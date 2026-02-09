---
id: SPEC-CALC-003
version: "1.0.0"
status: approved
created: "2026-02-09"
updated: "2026-02-09"
author: "지니"
priority: medium
dependencies:
  - SPEC-CALC-001
  - SPEC-CALC-002
tags:
  - history
  - keyboard
  - clipboard
  - persistence
---

# SPEC-CALC-003: 계산 이력, 키보드 입력 및 클립보드 기능

## 환경 (Environment)

### 기술 스택

- **프론트엔드**: React 19, TypeScript 5.9+
- **상태 관리**: Zustand 5
- **데이터베이스**: sql.js (SQLite WebAssembly)
- **테스팅**: Vitest, Playwright
- **브라우저 API**: Clipboard API, IndexedDB/OPFS

### 프로젝트 컨텍스트

- **프로젝트명**: calc.man (웹 계산기)
- **개발 모드**: Hybrid (신규 코드는 TDD, 레거시는 DDD)
- **커버리지 목표**: 85%
- **의존성**: SPEC-CALC-001 (계산 엔진), SPEC-CALC-002 (UI 컴포넌트)

## 가정 (Assumptions)

### 기술적 가정

1. **sql.js WebAssembly 지원**: 모든 타겟 브라우저가 WebAssembly를 지원한다
2. **Clipboard API 가용성**: 현대 브라우저에서 Clipboard API가 동작한다
3. **저장소 용량**: IndexedDB/OPFS가 최소 10MB 이상의 저장 공간을 제공한다
4. **키보드 이벤트**: 표준 키보드 이벤트가 모든 플랫폼에서 일관되게 동작한다

### 비즈니스 가정

1. **사용자 행동**: 사용자는 최근 20개의 계산 이력을 조회하는 것으로 충분하다
2. **데이터 보존**: 계산 이력은 브라우저 세션 간에 영구 보존되어야 한다
3. **오류 처리**: 에러 상태의 계산은 이력에 저장되지 않는다
4. **접근성**: 키보드만으로 모든 계산 기능을 수행할 수 있어야 한다

### 위험도 평가

| 가정 | 신뢰도 | 근거 | 오류 시 영향 | 검증 방법 |
|------|--------|------|-------------|-----------|
| sql.js 브라우저 호환성 | 높음 | WebAssembly 지원율 96%+ | 데이터베이스 초기화 실패 | Playwright 크로스 브라우저 테스트 |
| Clipboard API 가용성 | 중간 | HTTPS 환경에서만 동작 | 복사/붙여넣기 불가 | HTTPS 환경 테스트 |
| 저장소 용량 충분성 | 높음 | 20개 이력 = 약 2KB | 저장 실패 | 용량 제한 시뮬레이션 |
| 키보드 이벤트 일관성 | 중간 | OS별 키 매핑 차이 | 일부 키 동작 안 함 | 멀티 플랫폼 E2E 테스트 |

## 요구사항 (Requirements)

### Ubiquitous Requirements (항상 활성)

시스템은 **항상** 다음 동작을 수행해야 한다:

- **REQ-001**: 시스템은 계산 완료 시 결과를 SQLite에 자동 저장해야 한다
- **REQ-002**: 시스템은 키보드 입력을 감지하고 처리해야 한다
- **REQ-003**: 시스템은 계산 이력을 브라우저 세션 간에 영구 보존해야 한다
- **REQ-004**: 시스템은 애플리케이션 로드 시 데이터베이스를 초기화해야 한다

### Event-Driven Requirements (이벤트 기반)

**WHEN** [이벤트 발생] **THEN** [동작 실행]:

- **REQ-101**: **WHEN** 사용자가 Enter 키를 누르면 **THEN** 현재 계산을 실행해야 한다
- **REQ-102**: **WHEN** 사용자가 Escape 키를 누르면 **THEN** AC 버튼과 동일하게 초기화해야 한다
- **REQ-103**: **WHEN** 사용자가 Ctrl+C/Cmd+C를 누르면 **THEN** 디스플레이 값을 클립보드에 복사해야 한다
- **REQ-104**: **WHEN** 사용자가 Ctrl+V/Cmd+V를 누르면 **THEN** 클립보드의 숫자를 붙여넣어야 한다
- **REQ-105**: **WHEN** 사용자가 숫자 키(0-9)를 누르면 **THEN** 해당 숫자를 입력해야 한다
- **REQ-106**: **WHEN** 사용자가 연산자 키(+, -, *, /)를 누르면 **THEN** 해당 연산자를 적용해야 한다
- **REQ-107**: **WHEN** 사용자가 이력 항목을 클릭하면 **THEN** 해당 계산을 디스플레이에 복원해야 한다

### State-Driven Requirements (상태 기반)

**IF** [조건] **THEN** [동작]:

- **REQ-201**: **IF** 이력 패널이 열려 있으면 **THEN** 최근 20개 항목을 표시해야 한다
- **REQ-202**: **IF** 데이터베이스가 초기화되지 않았으면 **THEN** 앱 로드 시 스키마를 생성해야 한다
- **REQ-203**: **IF** 클립보드 값이 유효한 숫자가 아니면 **THEN** 붙여넣기를 무시해야 한다
- **REQ-204**: **IF** 계산 결과가 에러 상태이면 **THEN** 이력에 저장하지 않아야 한다

### Unwanted Requirements (금지 동작)

시스템은 다음 동작을 **하지 않아야 한다**:

- **REQ-301**: 시스템은 중간 계산 상태(입력 중인 숫자)를 저장하지 않아야 한다
- **REQ-302**: 시스템은 에러 상태의 계산을 이력에 저장하지 않아야 한다
- **REQ-303**: 시스템은 잘못된 키 조합을 처리하지 않아야 한다
- **REQ-304**: 시스템은 20개를 초과하는 이력을 UI에 표시하지 않아야 한다

### Optional Requirements (선택 기능)

**가능하면** 다음 기능을 제공:

- **REQ-401**: 가능하면 이력 데이터를 JSON으로 내보내기를 제공
- **REQ-402**: 가능하면 계산 이력 검색 기능을 제공
- **REQ-403**: 가능하면 이력 항목 삭제 기능을 제공

## 명세 (Specifications)

### 데이터베이스 스키마

```sql
CREATE TABLE IF NOT EXISTS calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expression TEXT NOT NULL,
  result TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_timestamp ON calculations(timestamp DESC);
```

### 데이터 모델

```typescript
interface Calculation {
  id: number;
  expression: string;
  result: string;
  timestamp: number;
  created_at: string;
}

interface HistoryState {
  items: Calculation[];
  isLoading: boolean;
  error: string | null;
}
```

### 키보드 매핑

| 키 | 동작 | 우선순위 |
|-----|------|----------|
| 0-9 | 숫자 입력 | 높음 |
| +, -, *, / | 연산자 입력 | 높음 |
| Enter | 계산 실행 | 높음 |
| Escape | 초기화 (AC) | 높음 |
| Ctrl/Cmd + C | 클립보드 복사 | 중간 |
| Ctrl/Cmd + V | 클립보드 붙여넣기 | 중간 |
| . | 소수점 입력 | 중간 |
| Backspace | 마지막 문자 삭제 | 낮음 |

### 파일 구조

```
src/
├── db/
│   ├── client.ts         # sql.js 초기화
│   ├── schema.sql        # 데이터베이스 스키마
│   └── queries.ts        # CRUD 쿼리
├── hooks/
│   ├── useHistory.ts     # 이력 관리 hook
│   ├── useKeyboard.ts    # 키보드 입력 hook
│   └── useClipboard.ts   # 클립보드 hook
├── components/
│   └── HistoryPanel.tsx  # 이력 패널 UI
└── stores/
    └── historyStore.ts   # Zustand store
```

### 성능 요구사항

- **데이터베이스 초기화**: 3초 이내
- **이력 저장**: 100ms 이내
- **이력 조회**: 200ms 이내
- **키보드 반응 속도**: 50ms 이내

### 보안 요구사항

- **SQL Injection 방어**: Prepared statements 사용
- **XSS 방어**: 이력 출력 시 이스케이핑
- **저장소 격리**: IndexedDB는 동일 출처 정책 준수

## 추적성 (Traceability)

### 관련 SPEC

- **SPEC-CALC-001**: 계산 엔진 (계산 결과 제공)
- **SPEC-CALC-002**: UI 컴포넌트 (디스플레이 및 버튼 입력)

### 구현 파일

- `src/db/client.ts`
- `src/db/queries.ts`
- `src/hooks/useHistory.ts`
- `src/hooks/useKeyboard.ts`
- `src/hooks/useClipboard.ts`
- `src/components/HistoryPanel.tsx`

### 테스트 파일

- `tests/unit/db.test.ts`
- `tests/unit/history.test.ts`
- `tests/unit/keyboard.test.ts`
- `tests/e2e/history.spec.ts`
- `tests/e2e/keyboard.spec.ts`

## 제약사항 (Constraints)

### 기술적 제약

- **브라우저 호환성**: Chrome 120+, Firefox 120+, Safari 17+
- **WebAssembly 필수**: sql.js는 WebAssembly 지원 필요
- **HTTPS 필수**: Clipboard API는 HTTPS 환경에서만 동작
- **저장 용량**: 최대 50MB (IndexedDB quota)

### 비기능적 제약

- **접근성**: WCAG 2.1 AA 준수
- **반응성**: 모든 키보드 입력은 50ms 이내 처리
- **안정성**: 데이터베이스 오류 시 graceful degradation

## 성공 기준 (Success Criteria)

### 기능 완성도

- ✅ 모든 EARS 요구사항 구현
- ✅ 9개 이상의 Given/When/Then 시나리오 통과
- ✅ Playwright E2E 테스트 통과

### 품질 지표

- ✅ 테스트 커버리지 85% 이상
- ✅ 타입 에러 0건
- ✅ Lint 경고 0건
- ✅ 보안 취약점 0건

### 성능 지표

- ✅ 데이터베이스 초기화 3초 이내
- ✅ 이력 저장 100ms 이내
- ✅ 키보드 반응 50ms 이내
