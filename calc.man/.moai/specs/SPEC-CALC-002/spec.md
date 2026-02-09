---
id: SPEC-CALC-002
version: "1.0.0"
status: approved
created: "2026-02-09"
updated: "2026-02-09"
author: "지니"
priority: high
dependencies:
  - SPEC-CALC-001
tags:
  - ui
  - react
  - shadcn
  - responsive
  - accessibility
---

# SPEC-CALC-002: 기본 UI 컴포넌트 및 사용자 인터랙션

## 개요

웹 계산기의 사용자 인터페이스 컴포넌트와 사용자 인터랙션을 구현합니다. React 19, shadcn/ui, Tailwind CSS 4를 사용하여 반응형, 접근 가능한 계산기 UI를 제공합니다.

## 환경 (Environment)

### 기술 스택
- **프론트엔드 프레임워크**: React 19.x
- **UI 라이브러리**: shadcn/ui (Button, Card 컴포넌트)
- **스타일링**: Tailwind CSS 4.x
- **상태 관리**: Zustand 5.x
- **타입 시스템**: TypeScript 5.9+

### 의존성
- **SPEC-CALC-001**: 계산기 엔진이 구현되어 있어야 함
- **Calculator Engine**: useCalculator 훅으로 엔진 접근

### 브라우저 지원
- Chrome/Edge 100+
- Firefox 100+
- Safari 15+
- 모바일 브라우저 (iOS Safari, Chrome Android)

## 가정 (Assumptions)

### 기술적 가정
1. **계산기 엔진 완성**: SPEC-CALC-001의 계산기 엔진이 완전히 구현되어 있음
2. **React 19 기능 활용**: React 19의 use hook과 Server Components 기능 사용 가능
3. **shadcn/ui 설치 완료**: Button, Card 컴포넌트가 프로젝트에 설치되어 있음
4. **Tailwind CSS 설정 완료**: Tailwind CSS 4 설정 및 빌드 파이프라인 구성 완료

### 비즈니스 가정
1. **단일 계산 세션**: 사용자는 한 번에 하나의 계산만 수행
2. **즉시 반응**: 사용자 입력에 대한 UI 반응은 16ms 이내 (60fps)
3. **모바일 우선**: 모바일 사용자가 주요 타겟 사용자

### 사용자 가정
1. **기본 계산 능력**: 사용자는 기본 산술 연산을 이해함
2. **터치/클릭 인터랙션**: 사용자는 버튼 클릭 또는 터치로 계산기 조작
3. **접근성 요구**: 일부 사용자는 키보드 탐색 및 스크린 리더를 사용할 수 있음

## 요구사항 (Requirements)

### Ubiquitous Requirements (항상 적용)
- **[REQ-UI-001]** 시스템은 **항상** 현재 입력값을 디스플레이 영역에 표시해야 한다
  - WHY: 사용자가 입력한 내용을 즉시 확인할 수 있어야 함
  - IMPACT: 실시간 피드백 제공으로 사용자 신뢰도 향상

- **[REQ-UI-002]** 시스템은 **항상** 모든 버튼에 접근 가능한 레이블을 제공해야 한다 (WCAG AA 준수)
  - WHY: 스크린 리더 사용자가 버튼 기능을 이해할 수 있어야 함
  - IMPACT: 접근성 표준 준수 및 포용적 사용자 경험 제공

- **[REQ-UI-003]** 시스템은 **항상** 결과값이 디스플레이 너비를 초과할 때 글꼴 크기를 자동으로 조정해야 한다
  - WHY: 긴 숫자도 잘림 없이 표시되어야 함
  - IMPACT: 모든 계산 결과의 완전한 가시성 보장

### Event-Driven Requirements (이벤트 기반)
- **[REQ-UI-004]** **WHEN** 사용자가 숫자 버튼을 클릭하면 **THEN** 해당 숫자가 디스플레이에 추가되어야 한다
  - WHY: 숫자 입력의 직관적인 피드백 제공
  - IMPACT: 자연스러운 계산기 사용 경험

- **[REQ-UI-005]** **WHEN** 사용자가 AC(All Clear) 버튼을 클릭하면 **THEN** 모든 상태가 초기화되고 디스플레이에 "0"이 표시되어야 한다
  - WHY: 새로운 계산을 시작할 수 있어야 함
  - IMPACT: 상태 초기화를 통한 깨끗한 계산 시작

- **[REQ-UI-006]** **WHEN** 사용자가 C(Clear) 버튼을 클릭하면 **THEN** 마지막 입력 문자가 삭제되어야 한다
  - WHY: 입력 오류 수정 기능 필요
  - IMPACT: 사용자 입력 오류 복구 가능

- **[REQ-UI-007]** **WHEN** 사용자가 연산자 버튼을 클릭하면 **THEN** 버튼에 시각적 피드백이 표시되어야 한다
  - WHY: 사용자가 버튼 클릭을 인지할 수 있어야 함
  - IMPACT: 즉각적인 인터랙션 피드백으로 사용성 향상

### State-Driven Requirements (상태 기반)
- **[REQ-UI-008]** **IF** 디스플레이 값이 15자리를 초과하면 **THEN** 글꼴 크기를 점진적으로 줄여야 한다
  - WHY: 긴 숫자도 디스플레이에 맞게 표시되어야 함
  - IMPACT: 모든 계산 결과의 가독성 보장

- **[REQ-UI-009]** **IF** 계산 결과가 오류 상태이면 **THEN** "Error" 메시지를 표시해야 한다
  - WHY: 잘못된 계산 시도를 사용자에게 알려야 함
  - IMPACT: 명확한 오류 전달로 사용자 혼란 방지

- **[REQ-UI-010]** **IF** 화면 너비가 768px 미만이면 **THEN** 모바일 레이아웃을 적용해야 한다
  - WHY: 작은 화면에서도 사용 가능해야 함
  - IMPACT: 반응형 디자인으로 모바일 사용성 향상

### Unwanted Requirements (금지 요구사항)
- **[REQ-UI-011]** 시스템은 비활성화된 버튼의 클릭 이벤트를 처리**하지 않아야 한다**
  - WHY: 비활성화된 기능은 실행되지 않아야 함
  - IMPACT: 예상치 않은 동작 방지

- **[REQ-UI-012]** 시스템은 UI 렌더링 중에 계산기 엔진 상태를 직접 수정**하지 않아야 한다**
  - WHY: 렌더링과 상태 변경을 분리해야 함
  - IMPACT: React의 단방향 데이터 흐름 유지 및 버그 방지

### Optional Requirements (선택 요구사항)
- **[REQ-UI-013]** **가능하면** 모바일에서 버튼 클릭 시 햅틱 피드백을 제공한다
  - WHY: 촉각 피드백이 사용자 경험을 향상시킬 수 있음
  - IMPACT: 향상된 모바일 사용자 경험

## 명세 (Specifications)

### 컴포넌트 구조

#### 1. Calculator.tsx (Main Component)
**책임**: 전체 계산기 UI 조율 및 레이아웃 관리

**Props**: 없음

**핵심 기능**:
- useCalculator 훅으로 계산기 상태 관리
- Display와 Keypad 컴포넌트 조합
- shadcn/ui Card 컴포넌트로 전체 래핑

**구조**:
```
<Card>
  <Display value={state.display} />
  <Keypad onButtonClick={handleButtonClick} />
</Card>
```

#### 2. Display.tsx (Display Component)
**책임**: 계산기 디스플레이 영역 렌더링

**Props**:
- `value: string` - 표시할 값
- `error?: boolean` - 오류 상태 여부

**핵심 기능**:
- 값의 길이에 따른 글꼴 크기 동적 조정
- 오류 상태 시 "Error" 메시지 표시
- 텍스트 오버플로우 처리

**글꼴 크기 로직**:
- 15자 이하: text-4xl (36px)
- 16-20자: text-3xl (30px)
- 21자 이상: text-2xl (24px)

#### 3. Keypad.tsx (Keypad Component)
**책임**: 계산기 버튼 그리드 레이아웃

**Props**:
- `onButtonClick: (value: string) => void` - 버튼 클릭 핸들러

**핵심 기능**:
- 4x5 그리드 레이아웃 (숫자 0-9, 연산자, AC, C, =)
- KeypadButton 컴포넌트 조합
- 반응형 버튼 크기 조정

**버튼 레이아웃**:
```
AC  C  /  *
7   8  9  -
4   5  6  +
1   2  3  =
0   .
```

#### 4. KeypadButton.tsx (Button Component)
**책임**: 개별 버튼 렌더링 및 인터랙션

**Props**:
- `value: string` - 버튼 표시 값
- `onClick: (value: string) => void` - 클릭 핸들러
- `variant?: 'default' | 'operator' | 'special'` - 버튼 스타일 변형
- `span?: number` - 그리드 스팬 (0 버튼용)

**핵심 기능**:
- shadcn/ui Button 컴포넌트 사용
- 접근성 레이블 (aria-label)
- 호버, 액티브 상태 스타일
- 햅틱 피드백 (모바일, 선택 사항)

**버튼 변형**:
- `default`: 숫자 버튼 (bg-gray-100)
- `operator`: 연산자 버튼 (bg-orange-500)
- `special`: AC, C, = 버튼 (bg-blue-500)

#### 5. Layout.tsx (Responsive Container)
**책임**: 반응형 컨테이너 및 중앙 정렬

**Props**:
- `children: React.ReactNode` - 자식 컴포넌트

**핵심 기능**:
- 화면 중앙 정렬
- 최대 너비 제한 (max-w-md)
- 모바일/데스크톱 반응형 패딩

#### 6. useCalculator (Custom Hook)
**책임**: 계산기 상태 관리 및 비즈니스 로직

**반환값**:
```typescript
{
  display: string;
  error: boolean;
  handleNumberInput: (num: string) => void;
  handleOperatorInput: (op: string) => void;
  handleClear: () => void;
  handleAllClear: () => void;
  handleEquals: () => void;
}
```

**핵심 기능**:
- Zustand 스토어 연동 (SPEC-CALC-001 엔진)
- 입력 검증 및 포맷팅
- 오류 상태 관리

### 반응형 디자인

#### 브레이크포인트
- **모바일**: < 768px
  - 버튼 크기: 60px x 60px
  - 디스플레이 높이: 80px
  - 컨테이너 패딩: 16px

- **데스크톱**: >= 768px
  - 버튼 크기: 80px x 80px
  - 디스플레이 높이: 100px
  - 컨테이너 패딩: 24px

#### Tailwind CSS 클래스 예시
```typescript
// 모바일 우선 접근
className="w-full max-w-md mx-auto p-4 md:p-6"
className="h-20 md:h-24 text-4xl md:text-5xl"
className="grid grid-cols-4 gap-2 md:gap-3"
```

### 접근성 (Accessibility)

#### WCAG AA 준수 사항
1. **키보드 탐색**:
   - 모든 버튼은 Tab 키로 접근 가능
   - Enter/Space 키로 버튼 활성화
   - Escape 키로 AC 기능 실행

2. **스크린 리더**:
   - 모든 버튼에 aria-label 제공
   - 디스플레이 영역에 aria-live="polite" 적용
   - 오류 상태 시 role="alert" 제공

3. **색상 대비**:
   - 텍스트와 배경 대비비 최소 4.5:1
   - 포커스 인디케이터 명확히 표시

4. **포커스 관리**:
   - 포커스 순서는 논리적 읽기 순서 따름
   - 포커스 인디케이터 항상 표시

### 성능 요구사항

1. **렌더링 성능**:
   - 버튼 클릭에 대한 UI 업데이트: < 16ms (60fps)
   - 초기 렌더링: < 100ms

2. **번들 크기**:
   - Calculator 컴포넌트 번들: < 50KB (gzipped)
   - 총 JavaScript 번들: < 200KB (gzipped)

3. **메모이제이션**:
   - KeypadButton 컴포넌트는 React.memo로 최적화
   - 이벤트 핸들러는 useCallback으로 메모이제이션

### 테스트 범위

#### 단위 테스트 (Component Tests)
- Display 컴포넌트: 값 표시, 글꼴 크기 조정, 오류 메시지
- KeypadButton 컴포넌트: 클릭 이벤트, 스타일 변형, 접근성
- useCalculator 훅: 상태 관리, 입력 처리, 오류 처리

#### 통합 테스트 (Integration Tests)
- Calculator 컴포넌트: 전체 워크플로우 테스트
- 숫자 입력 → 연산자 → 숫자 입력 → 결과
- AC/C 버튼 동작 검증

#### E2E 테스트 (End-to-End Tests)
- 실제 사용자 시나리오 테스트
- 반응형 레이아웃 검증
- 접근성 자동 검사 (axe-core)

### 파일 구조

```
src/
├── components/
│   ├── calculator/
│   │   ├── Calculator.tsx         # 메인 컴포넌트
│   │   ├── Display.tsx            # 디스플레이 컴포넌트
│   │   ├── Keypad.tsx             # 키패드 컴포넌트
│   │   ├── KeypadButton.tsx       # 버튼 컴포넌트
│   │   └── Layout.tsx             # 레이아웃 컴포넌트
│   └── ui/                        # shadcn/ui 컴포넌트
│       ├── button.tsx
│       └── card.tsx
├── hooks/
│   └── useCalculator.ts           # 계산기 훅
├── lib/
│   └── utils.ts                   # 유틸리티 함수
└── app/
    └── page.tsx                   # Next.js 페이지

tests/
├── components/
│   ├── Calculator.test.tsx
│   ├── Display.test.tsx
│   ├── Keypad.test.tsx
│   └── KeypadButton.test.tsx
└── e2e/
    └── calculator.spec.ts
```

## 추적성 (Traceability)

### 관련 SPEC
- **SPEC-CALC-001**: 계산기 엔진 (의존성)
- **SPEC-CALC-003**: 고급 기능 (향후 확장)

### Git 브랜치 전략
- 브랜치명: `feature/SPEC-CALC-002-ui-components`
- PR 제목: `[SPEC-CALC-002] 기본 UI 컴포넌트 및 사용자 인터랙션 구현`

### 커밋 메시지 형식
```
feat(calc): implement Display component with dynamic font sizing

[SPEC-CALC-002][REQ-UI-003] Display 컴포넌트 구현
- 값 길이에 따른 글꼴 크기 자동 조정
- 오버플로우 처리
- 접근성 레이블 추가

🗿 MoAI <email@mo.ai.kr>
```

## 비고

### 기술 부채
- 햅틱 피드백은 MVP에서 제외 (선택 요구사항)
- 키보드 입력 지원은 별도 SPEC에서 처리 예정

### 참고 자료
- [React 19 문서](https://react.dev)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [Tailwind CSS 4 문서](https://tailwindcss.com)
- [WCAG 2.1 AA 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
