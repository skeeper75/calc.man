/**
 * 계산기 관련 상수
 */

/**
 * 최대 소수점 자리수
 */
export const MAX_DECIMAL_PLACES = 10

/**
 * 최대 표시 가능 숫자 길이
 */
export const MAX_DISPLAY_LENGTH = 15

/**
 * 계산기 버튼 레이아웃
 */
export const BUTTON_LAYOUT = [
  ['AC', 'DEL', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['+/-', '0', '.', '='],
] as const

/**
 * 숫자 버튼 목록
 */
export const NUMBER_BUTTONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'] as const

/**
 * 연산자 버튼 목록
 */
export const OPERATOR_BUTTONS = ['+', '-', '×', '÷', '%'] as const

/**
 * 기능 버튼 목록
 */
export const FUNCTION_BUTTONS = ['AC', 'DEL', '+/-', '='] as const
