# calc.man - 프로젝트 구조

## 전체 아키텍처 개요

calc.man은 React + Vite 기반의 단일 페이지 애플리케이션(SPA) 아키텍처를 채택한다. 프론트엔드는 React 컴포넌트 기반으로 UI를 구성하고, shadcn/ui와 Tailwind CSS로 스타일링한다. 데이터 영속성은 SQLite를 사용하며, 계산 이력 저장 등 간단한 데이터 관리에 활용한다.

### 아키텍처 유형

- **클라이언트 사이드 SPA**: Vite 빌드 기반 React 애플리케이션
- **경량 백엔드 (선택적)**: SQLite 연동을 위한 간단한 API 서버 (필요 시)
- **모듈형 단일 저장소**: 기능 단위로 모듈을 분리한 모놀리식 구조

---

## 디렉토리 구조

```
calc.man/
├── .moai/                          # MoAI 프로젝트 설정
│   ├── config/                     # MoAI 설정 파일
│   ├── project/                    # 프로젝트 문서 (product, structure, tech)
│   └── specs/                      # SPEC 문서
├── public/                         # 정적 자산
│   ├── favicon.ico                 # 파비콘
│   └── icons/                      # PWA 아이콘 등
├── src/                            # 소스 코드 루트
│   ├── app/                        # 애플리케이션 진입점
│   │   ├── App.tsx                 # 루트 컴포넌트
│   │   ├── main.tsx                # 엔트리 포인트
│   │   └── index.css               # 글로벌 스타일 (Tailwind 지시자)
│   ├── components/                 # UI 컴포넌트
│   │   ├── ui/                     # shadcn/ui 기본 컴포넌트
│   │   │   ├── button.tsx          # 버튼 컴포넌트
│   │   │   ├── card.tsx            # 카드 컴포넌트
│   │   │   └── ...                 # 기타 shadcn/ui 컴포넌트
│   │   ├── calculator/             # 계산기 전용 컴포넌트
│   │   │   ├── Calculator.tsx      # 계산기 메인 컴포넌트
│   │   │   ├── Display.tsx         # 결과 표시 영역
│   │   │   ├── Keypad.tsx          # 숫자/연산자 키패드
│   │   │   ├── HistoryPanel.tsx    # 계산 이력 패널
│   │   │   └── KeypadButton.tsx    # 개별 키패드 버튼
│   │   └── layout/                 # 레이아웃 컴포넌트
│   │       ├── Header.tsx          # 상단 헤더
│   │       └── Footer.tsx          # 하단 푸터
│   ├── hooks/                      # 커스텀 React 훅
│   │   ├── useCalculator.ts        # 계산 로직 훅
│   │   ├── useKeyboard.ts          # 키보드 입력 처리 훅
│   │   ├── useHistory.ts           # 계산 이력 관리 훅
│   │   └── useTheme.ts             # 테마 전환 훅
│   ├── lib/                        # 유틸리티 및 핵심 라이브러리
│   │   ├── utils.ts                # shadcn/ui 유틸리티 (cn 함수 등)
│   │   ├── calculator.ts           # 계산 엔진 (순수 함수)
│   │   ├── formatter.ts            # 숫자 포맷팅 유틸리티
│   │   └── constants.ts            # 상수 정의
│   ├── store/                      # 상태 관리
│   │   └── calculatorStore.ts      # 계산기 상태 (Zustand 또는 Context)
│   ├── types/                      # TypeScript 타입 정의
│   │   ├── calculator.ts           # 계산기 관련 타입
│   │   └── history.ts              # 이력 관련 타입
│   └── db/                         # 데이터베이스 관련
│       ├── schema.ts               # SQLite 스키마 정의
│       ├── client.ts               # SQLite 클라이언트 설정
│       └── queries.ts              # 데이터베이스 쿼리 함수
├── tests/                          # 테스트 코드
│   ├── unit/                       # 단위 테스트
│   │   ├── calculator.test.ts      # 계산 엔진 테스트
│   │   ├── formatter.test.ts       # 포맷팅 테스트
│   │   └── hooks/                  # 훅 테스트
│   ├── integration/                # 통합 테스트
│   │   └── Calculator.test.tsx     # 계산기 컴포넌트 통합 테스트
│   └── e2e/                        # E2E 테스트
│       └── calculator.spec.ts      # 전체 흐름 테스트
├── index.html                      # HTML 엔트리 포인트 (Vite)
├── vite.config.ts                  # Vite 설정
├── tailwind.config.ts              # Tailwind CSS 설정
├── tsconfig.json                   # TypeScript 설정
├── tsconfig.node.json              # Node 환경 TypeScript 설정
├── components.json                 # shadcn/ui 설정
├── package.json                    # 의존성 및 스크립트
├── postcss.config.js               # PostCSS 설정
└── README.md                       # 프로젝트 소개 문서
```

---

## 디렉토리별 역할

### `src/app/`

애플리케이션의 진입점과 글로벌 설정을 포함한다. `main.tsx`에서 React DOM 렌더링을 시작하고, `App.tsx`에서 전체 레이아웃과 라우팅(필요 시)을 구성한다.

### `src/components/`

모든 UI 컴포넌트를 관리한다. 세 가지 하위 디렉토리로 구분한다.

- **ui/**: shadcn/ui CLI로 생성된 기본 UI 컴포넌트. 직접 수정하지 않는 것을 권장한다.
- **calculator/**: 계산기 도메인에 특화된 컴포넌트. 비즈니스 로직과 밀접하게 연관된다.
- **layout/**: 페이지 레이아웃을 구성하는 구조적 컴포넌트.

### `src/hooks/`

React 커스텀 훅을 모아둔다. 계산 로직, 키보드 이벤트 처리, 이력 관리 등 상태와 부수효과를 캡슐화한다. 컴포넌트에서 비즈니스 로직을 분리하여 테스트 용이성을 높인다.

### `src/lib/`

순수 함수와 유틸리티를 포함한다. React에 의존하지 않는 독립적인 로직으로 구성하여 단위 테스트가 용이하다.

- **calculator.ts**: 사칙연산, 퍼센트 계산 등 핵심 계산 엔진
- **formatter.ts**: 숫자 포맷팅 (천 단위 구분, 소수점 처리 등)
- **utils.ts**: shadcn/ui에서 사용하는 `cn()` 함수 등 공통 유틸리티

### `src/store/`

애플리케이션 상태 관리를 담당한다. 계산기의 현재 입력값, 연산자, 결과값 등을 중앙에서 관리한다. 프로젝트 규모에 따라 Zustand 또는 React Context를 선택한다.

### `src/types/`

TypeScript 타입 및 인터페이스를 정의한다. 계산기 상태, 이력 레코드 등 도메인 모델의 타입을 관리한다.

### `src/db/`

SQLite 데이터베이스 관련 코드를 관리한다. 스키마 정의, 연결 설정, 쿼리 함수를 포함한다.

### `tests/`

테스트 코드를 계층별로 분리한다.

- **unit/**: 개별 함수나 모듈의 단위 테스트
- **integration/**: 컴포넌트 간 상호작용 테스트
- **e2e/**: 사용자 시나리오 기반 전체 흐름 테스트

---

## 모듈 구성 방안

### 핵심 모듈 의존 관계

```
[App] → [Calculator 컴포넌트]
            ├── [Display] ← useCalculator 훅 ← calculator.ts (계산 엔진)
            ├── [Keypad] ← useKeyboard 훅
            └── [HistoryPanel] ← useHistory 훅 ← db/queries.ts (SQLite)
```

### 모듈 분리 원칙

1. **관심사 분리**: UI 렌더링(컴포넌트)과 비즈니스 로직(훅, lib)을 명확히 분리한다.
2. **단방향 의존성**: 상위 모듈이 하위 모듈에 의존하며, 순환 의존을 금지한다.
3. **순수 함수 우선**: 계산 엔진(`lib/calculator.ts`)은 React에 의존하지 않는 순수 함수로 구현한다.
4. **타입 중심 설계**: `types/` 디렉토리에서 도메인 모델을 타입으로 정의하고, 모든 모듈이 공유한다.

### 데이터 흐름

1. 사용자 입력 (버튼 클릭 또는 키보드) -> Keypad 컴포넌트
2. Keypad -> useCalculator 훅으로 입력 전달
3. useCalculator -> calculator.ts 엔진으로 계산 위임
4. 계산 결과 -> Display 컴포넌트에 표시
5. 계산 완료 시 -> useHistory 훅을 통해 SQLite에 이력 저장
6. HistoryPanel -> useHistory 훅을 통해 이력 조회 및 표시

---

## 외부 시스템 연동

### SQLite 연동

- **클라이언트 측 SQLite**: sql.js 또는 wa-sqlite를 사용하여 브라우저 내에서 SQLite를 구동한다.
- **대안**: 경량 백엔드(Express/Fastify)를 추가하여 서버 측 SQLite를 사용할 수 있다.
- **데이터**: 계산 이력, 사용자 설정 등 간단한 영속 데이터를 저장한다.

### 비기능 요구사항

| 항목 | 요구사항 |
|------|----------|
| 성능 | 계산 응답 시간 50ms 이내, 페이지 로드 1초 이내 |
| 접근성 | WCAG 2.1 AA 준수, 키보드 전체 조작 가능 |
| 반응형 | 320px ~ 2560px 화면 너비 대응 |
| 브라우저 지원 | Chrome, Firefox, Safari, Edge 최신 2개 버전 |
| 번들 크기 | 초기 로드 200KB 이하 (gzip) |
