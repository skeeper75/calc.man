import type { CalculationResult } from '../types/calculator'

/**
 * 핵심 계산 엔진
 *
 * 기본 산술 연산과 숫자 포맷팅을 제공합니다.
 */

/**
 * 덧셈
 * @param a - 첫 번째 피연산자
 * @param b - 두 번째 피연산자
 * @returns 두 수의 합
 */
export function add(a: number, b: number): number {
  return a + b
}

/**
 * 뺄셈
 * @param a - 첫 번째 피연산자
 * @param b - 두 번째 피연산자
 * @returns 두 수의 차
 */
export function subtract(a: number, b: number): number {
  return a - b
}

/**
 * 곱셈
 * @param a - 첫 번째 피연산자
 * @param b - 두 번째 피연산자
 * @returns 두 수의 곱
 */
export function multiply(a: number, b: number): number {
  return a * b
}

/**
 * 나눗셈
 * @param a - 피제수
 * @param b - 제수
 * @returns 계산 결과 또는 에러 메시지
 */
export function divide(a: number, b: number): CalculationResult {
  // 0으로 나누기 처리
  if (b === 0) {
    return { success: false, error: 'Error: Division by zero' }
  }
  return { success: true, value: a / b }
}

/**
 * 퍼센트 계산
 * @param value - 계산할 값
 * @returns 값의 100분의 1
 */
export function percent(value: number): number {
  return value / 100
}

/**
 * 숫자 입력 유효성 검사
 * @param currentValue - 현재 입력된 값
 * @param input - 새로 입력할 문자
 * @returns 입력이 유효하면 true, 아니면 false
 */
export function validateNumberInput(currentValue: string, input: string): boolean {
  // 숫자 키 입력은 항상 유효
  if (/^[0-9]$/.test(input)) {
    return true
  }

  // 소수점 처리
  if (input === '.') {
    // 이미 소수점이 있으면 유효하지 않음
    return !currentValue.includes('.')
  }

  // 음수 기호 처리 (첫 번째만 허용)
  if (input === '-') {
    return currentValue === ''
  }

  return false
}

/**
 * 숫자 포맷팅
 * @param value - 포맷할 숫자 값
 * @returns 포맷된 문자열 (천 단위 구분 기호, 후행 제로 제거)
 */
export function formatNumber(value: number): string {
  // 특수 값 처리 (NaN, Infinity)
  if (!Number.isFinite(value)) {
    if (Number.isNaN(value)) {
      return 'Error: NaN'
    }
    return value > 0 ? 'Error: Infinity' : 'Error: -Infinity'
  }

  // 소수점 10자리까지 제한하고 후행 제로 제거
  const formatted = parseFloat(value.toFixed(10))

  // 천 단위 구분 기호 추가
  return formatted.toLocaleString('en-US', {
    maximumFractionDigits: 10,
    useGrouping: true,
  })
}
