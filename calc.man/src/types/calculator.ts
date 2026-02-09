/**
 * 계산기 관련 타입 정의
 */

/**
 * 계산기 연산자 타입
 */
export type Operator = '+' | '-' | '×' | '÷' | '%'

/**
 * 계산기 버튼 타입
 */
export type CalculatorButton =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '.'
  | '+/-'
  | '%'
  | '+'
  | '-'
  | '×'
  | '÷'
  | '='
  | 'AC'
  | 'DEL'

/**
 * 계산기 상태 인터페이스
 */
export interface CalculatorState {
  /** 현재 표시값 */
  displayValue: string
  /** 이전 값 */
  previousValue: string | null
  /** 현재 연산자 */
  operator: Operator | null
  /** 새 숫자 입력을 기다리는 중인지 여부 */
  waitingForNewValue: boolean
  /** 에러 상태 메시지 */
  error: string | null
}

/**
 * 계산 결과 타입
 */
export type CalculationResult =
  | { success: true; value: number }
  | { success: false; error: string }
