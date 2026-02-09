import { describe, it, expect } from 'vitest'
import {
  parseFormattedNumber,
  sanitizeInput,
  stripCommas,
} from '../../src/lib/formatter'

/**
 * formatter.ts 유닛 테스트
 *
 * TDD RED 단계: 먼저 실패하는 테스트 작성
 */

describe('formatter.ts - 포맷된 숫자 파싱', () => {
  describe('parseFormattedNumber', () => {
    it('기본 정수를 파싱해야 한다', () => {
      expect(parseFormattedNumber('123')).toBe(123)
      expect(parseFormattedNumber('0')).toBe(0)
    })

    it('천 단위 구분 기호가 있는 숫자를 파싱해야 한다', () => {
      expect(parseFormattedNumber('1,000')).toBe(1000)
      expect(parseFormattedNumber('1,234,567')).toBe(1234567)
      expect(parseFormattedNumber('12,345')).toBe(12345)
    })

    it('소수점이 있는 숫자를 파싱해야 한다', () => {
      expect(parseFormattedNumber('123.45')).toBeCloseTo(123.45, 10)
      expect(parseFormattedNumber('0.5')).toBeCloseTo(0.5, 10)
    })

    it('천 단위 구분 기호와 소수점이 모두 있는 숫자를 파싱해야 한다', () => {
      expect(parseFormattedNumber('1,234.56')).toBeCloseTo(1234.56, 10)
      expect(parseFormattedNumber('12,345.67')).toBeCloseTo(12345.67, 10)
    })

    it('음수를 파싱해야 한다', () => {
      expect(parseFormattedNumber('-123')).toBe(-123)
      expect(parseFormattedNumber('-1,000')).toBe(-1000)
      expect(parseFormattedNumber('-1,234.56')).toBeCloseTo(-1234.56, 10)
    })

    it('빈 문자열은 0을 반환해야 한다', () => {
      expect(parseFormattedNumber('')).toBe(0)
    })

    it('잘못된 형식은 NaN을 반환해야 한다', () => {
      expect(parseFormattedNumber('abc')).toBeNaN()
      expect(parseFormattedNumber('--123')).toBeNaN()
      expect(parseFormattedNumber('1.2.3')).toBeNaN()
    })
  })

  describe('stripCommas', () => {
    it('모든 쉼표를 제거해야 한다', () => {
      expect(stripCommas('1,000')).toBe('1000')
      expect(stripCommas('1,234,567')).toBe('1234567')
    })

    it('쉼표가 없는 문자열은 그대로 반환해야 한다', () => {
      expect(stripCommas('12345')).toBe('12345')
    })

    it('빈 문자열은 그대로 반환해야 한다', () => {
      expect(stripCommas('')).toBe('')
    })
  })

  describe('sanitizeInput', () => {
    it('숫자와 소수점, 음수 기호만 허용해야 한다', () => {
      expect(sanitizeInput('123')).toBe('123')
      expect(sanitizeInput('123.45')).toBe('123.45')
      expect(sanitizeInput('-123')).toBe('-123')
    })

    it('공백을 제거해야 한다', () => {
      expect(sanitizeInput('1 234')).toBe('1234')
      expect(sanitizeInput(' 123 ')).toBe('123')
    })

    it('천 단위 구분 기호를 제거해야 한다', () => {
      expect(sanitizeInput('1,234')).toBe('1234')
    })

    it('잘못된 문자를 제거해야 한다', () => {
      expect(sanitizeInput('abc123def')).toBe('123')
      expect(sanitizeInput('12@#$34')).toBe('1234')
    })

    it('복합 입력을 처리해야 한다', () => {
      expect(sanitizeInput('1,234.56')).toBe('1234.56')
      expect(sanitizeInput('-1,234.56')).toBe('-1234.56')
    })

    it('빈 문자열 또는 유효하지 않은 입력은 빈 문자열을 반환해야 한다', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput('abc')).toBe('')
      expect(sanitizeInput('@#$')).toBe('')
    })
  })
})
