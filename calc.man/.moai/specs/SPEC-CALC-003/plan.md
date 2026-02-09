---
spec_id: SPEC-CALC-003
version: "1.0.0"
created: "2026-02-09"
updated: "2026-02-09"
---

# SPEC-CALC-003 구현 계획

## 개요

계산 이력, 키보드 입력, 클립보드 기능을 구현하기 위한 단계별 실행 계획입니다.

## 마일스톤

### Primary Goal: 데이터베이스 및 이력 관리

**범위**: sql.js 통합, 스키마 생성, CRUD 연산

**구현 파일**:
- `src/db/client.ts` (신규)
- `src/db/schema.sql` (신규)
- `src/db/queries.ts` (신규)
- `src/hooks/useHistory.ts` (신규)
- `src/stores/historyStore.ts` (신규)

**테스트 파일**:
- `tests/unit/db.test.ts` (신규)
- `tests/unit/history.test.ts` (신규)

**구현 순서**:
1. sql.js WebAssembly 로드 및 초기화
2. 데이터베이스 스키마 생성
3. IndexedDB/OPFS 영구 저장 설정
4. CRUD 쿼리 함수 구현
5. useHistory hook 작성
6. Zustand historyStore 연동
7. 단위 테스트 작성

**성공 기준**:
- ✅ 데이터베이스 초기화 3초 이내
- ✅ 계산 저장/조회 정상 동작
- ✅ 세션 간 데이터 영구 보존
- ✅ 단위 테스트 커버리지 85%+

---

### Secondary Goal: 키보드 입력 처리

**범위**: 키보드 이벤트 리스너, 키 매핑, 단축키

**구현 파일**:
- `src/hooks/useKeyboard.ts` (신규)
- `src/utils/keyboardMap.ts` (신규)

**테스트 파일**:
- `tests/unit/keyboard.test.ts` (신규)
- `tests/e2e/keyboard.spec.ts` (신규)

**구현 순서**:
1. useKeyboard hook 작성
2. 키 매핑 정의 (0-9, +, -, *, /, Enter, Escape)
3. 단축키 처리 (Ctrl/Cmd+C, Ctrl/Cmd+V)
4. 계산기 상태와 연동
5. 단위 테스트 작성
6. Playwright E2E 테스트 작성

**성공 기준**:
- ✅ 모든 매핑된 키 정상 동작
- ✅ 키보드 반응 속도 50ms 이내
- ✅ 크로스 플랫폼 호환성 (Windows, macOS)
- ✅ E2E 테스트 통과

---

### Final Goal: 클립보드 및 UI 통합

**범위**: 복사/붙여넣기, HistoryPanel UI, 전체 통합

**구현 파일**:
- `src/hooks/useClipboard.ts` (신규)
- `src/components/HistoryPanel.tsx` (신규)
- `src/components/HistoryItem.tsx` (신규)
- `src/app/page.tsx` (수정)

**테스트 파일**:
- `tests/unit/clipboard.test.ts` (신규)
- `tests/e2e/history.spec.ts` (신규)
- `tests/e2e/integration.spec.ts` (신규)

**구현 순서**:
1. useClipboard hook 작성
2. Clipboard API 권한 처리
3. 숫자 유효성 검증 (붙여넣기 시)
4. HistoryPanel UI 컴포넌트 작성
5. HistoryItem 클릭 핸들러
6. 메인 페이지 통합
7. 통합 테스트 작성

**성공 기준**:
- ✅ 복사/붙여넣기 정상 동작
- ✅ 이력 패널 UI 렌더링
- ✅ 이력 항목 클릭 시 복원
- ✅ 전체 E2E 시나리오 통과

---

### Optional Goal: 고급 기능

**범위**: 이력 내보내기, 검색, 삭제

**구현 파일**:
- `src/utils/exportHistory.ts` (신규)
- `src/components/HistorySearch.tsx` (신규)

**구현 순서**:
1. JSON 내보내기 기능
2. 이력 검색 UI
3. 개별 항목 삭제 기능

**우선순위**: 낮음 (필수 기능 완료 후)

---

## 기술 접근 방법

### 1. sql.js WebAssembly 통합

**라이브러리 선택**:
- `sql.js` v1.10.3+ (최신 안정 버전)

**초기화 전략**:

```typescript
import initSqlJs from 'sql.js';

// WebAssembly 바이너리 경로 설정
const SQL = await initSqlJs({
  locateFile: (file) => `/sql-wasm/${file}`
});

// IndexedDB 백엔드 사용 (영구 저장)
const db = new SQL.Database();
```

**영구 저장 전략**:
- **Option 1**: IndexedDB (크로스 브라우저 호환성 우수)
- **Option 2**: OPFS (성능 우수, Chrome 120+ 필요)
- **선택**: IndexedDB (호환성 우선)

**근거**:
- sql.js는 메모리 내 데이터베이스이므로 새로고침 시 데이터 손실
- IndexedDB를 통해 DB 파일을 직렬화하여 영구 저장
- OPFS는 실험적 API로 Safari 미지원

---

### 2. 데이터베이스 스키마 설계

**테이블 구조**:

```sql
CREATE TABLE IF NOT EXISTS calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expression TEXT NOT NULL,
  result TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_timestamp
  ON calculations(timestamp DESC);
```

**인덱스 전략**:
- `timestamp DESC`: 최근 이력 조회 최적화
- Primary Key: id (자동 증가)

**데이터 타입 선택**:
- `expression`: TEXT (예: "2 + 3")
- `result`: TEXT (예: "5")
- `timestamp`: INTEGER (Unix epoch)
- `created_at`: TEXT (ISO 8601)

---

### 3. Zustand 상태 관리 설계

**Store 구조**:

```typescript
interface HistoryState {
  items: Calculation[];
  isLoading: boolean;
  error: string | null;
  loadHistory: () => Promise<void>;
  saveCalculation: (expr: string, result: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}
```

**비동기 처리**:
- `loadHistory`: 앱 초기화 시 호출
- `saveCalculation`: 계산 완료 시 자동 호출
- `clearHistory`: 이력 삭제 버튼 클릭 시

**에러 처리**:
- 데이터베이스 초기화 실패 시 로컬 스토리지 폴백
- SQL 쿼리 실패 시 사용자에게 알림

---

### 4. 키보드 이벤트 아키텍처

**Hook 구조**:

```typescript
const useKeyboard = (onInput: (key: string) => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 키 매핑 처리
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInput]);
};
```

**키 매핑 전략**:
- 숫자 키: `event.key === '0'` ~ `'9'`
- 연산자: `event.key === '+'` 등
- 단축키: `event.ctrlKey || event.metaKey` 체크

**충돌 방지**:
- 입력 필드 포커스 시 키보드 이벤트 무시
- `event.preventDefault()` 적절히 사용

---

### 5. Clipboard API 통합

**권한 처리**:

```typescript
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // HTTPS 환경이 아니거나 권한 거부 시
    fallbackCopy(text); // document.execCommand 폴백
  }
};
```

**유효성 검증**:
- 붙여넣기 시 `parseFloat()` 사용
- `isNaN()` 체크로 유효하지 않은 값 필터링

---

## 아키텍처 설계

### 컴포넌트 계층 구조

```
App
└── Calculator
    ├── Display (읽기 전용, 클립보드 복사 대상)
    ├── ButtonGrid (기존, 키보드 입력도 동일 핸들러)
    └── HistoryPanel (신규)
        └── HistoryItem[] (신규)
```

### 데이터 흐름

1. **계산 완료**:
   - `Calculator` → `calcStore.calculate()`
   - → `historyStore.saveCalculation()`
   - → `db.queries.insertCalculation()`

2. **이력 로드**:
   - `App 초기화` → `historyStore.loadHistory()`
   - → `db.queries.getRecentCalculations()`
   - → `historyStore.items` 업데이트

3. **키보드 입력**:
   - `useKeyboard hook` → `handleKeyPress()`
   - → `calcStore.input()` (버튼 클릭과 동일)

4. **클립보드 복사**:
   - `Ctrl+C` → `useClipboard.copy()`
   - → `navigator.clipboard.writeText()`

---

## 위험 요소 및 대응 방안

### 위험 1: sql.js 초기화 시간 초과

**영향도**: 높음
**발생 가능성**: 중간

**대응 방안**:
- WebAssembly 파일을 CDN에서 로드 (빠른 초기화)
- 로딩 인디케이터 표시
- 타임아웃 시 로컬 스토리지 폴백

---

### 위험 2: 클립보드 권한 거부

**영향도**: 중간
**발생 가능성**: 높음

**대응 방안**:
- `document.execCommand('copy')` 폴백
- 사용자에게 권한 요청 안내
- 수동 복사 버튼 제공

---

### 위험 3: 브라우저별 키보드 이벤트 차이

**영향도**: 중간
**발생 가능성**: 높음

**대응 방안**:
- `event.key` 표준 사용 (레거시 `keyCode` 회피)
- Playwright로 크로스 브라우저 테스트
- 플랫폼별 키 매핑 테이블

---

### 위험 4: IndexedDB quota 초과

**영향도**: 낮음
**발생 가능성**: 낮음

**대응 방안**:
- 이력 최대 20개로 제한 (UI 표시 기준)
- 오래된 항목 자동 삭제 (LIFO)
- Quota 초과 시 경고 메시지

---

## 성능 최적화 전략

### 1. 데이터베이스 최적화

- **인덱스 활용**: `timestamp DESC` 인덱스로 최근 이력 조회 최적화
- **Prepared Statements**: SQL Injection 방어 및 성능 향상
- **배치 처리**: 다중 저장 시 트랜잭션 사용

---

### 2. UI 렌더링 최적화

- **가상 스크롤**: 이력 항목이 많을 경우 (20개 제한으로 불필요할 수 있음)
- **메모이제이션**: `useMemo`로 계산 이력 필터링
- **지연 로딩**: HistoryPanel을 코드 스플리팅으로 분리

---

### 3. 키보드 이벤트 최적화

- **Debounce 불필요**: 키 입력은 즉각 반응 필요
- **이벤트 위임**: 전역 리스너 1개만 사용
- **조기 종료**: 매핑되지 않은 키는 빠르게 반환

---

## 테스트 전략

### 단위 테스트 (Vitest)

**테스트 대상**:
- `db/client.ts`: 초기화, 스키마 생성
- `db/queries.ts`: CRUD 연산
- `hooks/useHistory.ts`: 이력 로드/저장
- `hooks/useKeyboard.ts`: 키 매핑
- `hooks/useClipboard.ts`: 복사/붙여넣기

**커버리지 목표**: 85%+

---

### E2E 테스트 (Playwright)

**시나리오**:
1. 계산 실행 → 이력 저장 확인
2. 페이지 새로고침 → 이력 유지 확인
3. 키보드 입력 → 계산 실행
4. Ctrl+C → 클립보드 복사 확인
5. Ctrl+V → 숫자 붙여넣기 확인
6. 이력 항목 클릭 → 디스플레이 복원
7. 20개 초과 이력 → 오래된 항목 미표시

---

## 의존성 목록

### 프로덕션 의존성

```json
{
  "sql.js": "^1.10.3",
  "zustand": "^5.0.0",
  "react": "^19.0.0"
}
```

### 개발 의존성

```json
{
  "vitest": "^2.0.0",
  "@testing-library/react": "^16.0.0",
  "playwright": "^1.48.0",
  "typescript": "^5.9.0"
}
```

---

## 다음 단계

1. **Primary Goal 완료 후**:
   - `/moai:3-sync SPEC-CALC-003` 실행
   - 데이터베이스 구조 문서화
   - API 레퍼런스 생성

2. **Secondary Goal 완료 후**:
   - 키보드 단축키 문서화
   - 접근성 가이드 작성

3. **Final Goal 완료 후**:
   - 사용자 가이드 업데이트
   - CHANGELOG 항목 추가
   - Pull Request 생성

---

## 참고 자료

- [sql.js 공식 문서](https://sql.js.org/)
- [Clipboard API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Keyboard Events 표준](https://www.w3.org/TR/uievents-key/)
- [IndexedDB Best Practices](https://web.dev/indexeddb-best-practices/)

---

**작성일**: 2026-02-09
**버전**: 1.0.0
**다음 리뷰**: /moai:2-run 시작 전
