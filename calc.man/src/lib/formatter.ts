/**
 * 숫자 포맷팅 유틸리티
 *
 * 포맷된 숫자 문자열을 파싱하고 정제하는 기능을 제공합니다.
 */

/**
 * 포맷된 숫자 문자열에서 쉼표를 제거합니다
 * @param value - 쉼표가 포함된 문자열
 * @returns 쉼표가 제거된 문자열
 */
export function stripCommas(value: string): string {
  return value.replace(/,/g, '')
}

/**
 * 입력 문자열에서 유효하지 않은 문자를 제거합니다
 * @param value - 정제할 입력 문자열
 * @returns 숫자, 소수점, 음수 기호만 포함된 문자열
 */
export function sanitizeInput(value: string): string {
  // 공백과 쉼표 제거, 허용된 문자만 유지
  const cleaned = value.replace(/\s+/g, '').replace(/,/g, '').replace(/[^0-9.-]/g, '')

  // 음수 기호 처리
  const hasNegativeSign = cleaned.startsWith('-')
  const withoutSign = cleaned.replace(/-/g, '')

  // 첫 번째 소수점만 유지
  const dotIndex = withoutSign.indexOf('.')
  const validNumber =
    dotIndex === -1
      ? withoutSign
      : withoutSign.slice(0, dotIndex) + withoutSign.slice(dotIndex)

  // 유효성 확인
  if (validNumber.replace(/\./g, '') === '') {
    return ''
  }

  return hasNegativeSign ? '-' + validNumber : validNumber
}

/**
 * 포맷된 숫자 문자열을 숫자로 변환합니다
 * @param value - 포맷된 숫자 문자열 (천 단위 구분 기호 포함 가능)
 * @returns 파싱된 숫자 값
 */
export function parseFormattedNumber(value: string): number {
  // 빈 문자열 처리
  if (value.trim() === '') {
    return 0
  }

  // 유효성 검사: 유효한 숫자 형식인지 확인
  // 유효한 형식: 선택적 음수 기호, 숫자, 선택적 소수점, 숫자
  const isValidFormat = /^-?\d*\.?\d+$/.test(value.replace(/,/g, ''))

  if (!isValidFormat) {
    return NaN
  }

  // 쉼표 제거
  const stripped = stripCommas(value)

  // 파싱
  const parsed = parseFloat(stripped)

  return parsed
}
