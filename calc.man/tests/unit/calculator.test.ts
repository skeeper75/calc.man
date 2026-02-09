import { describe, it, expect } from 'vitest'
import {
  add,
  subtract,
  multiply,
  divide,
  percent,
  validateNumberInput,
  formatNumber,
} from '../../src/lib/calculator'

/**
 * calculator.ts 유닛 테스트
 *
 * TDD RED 단계: 먼저 실패하는 테스트 작성
 */

describe('calculator.ts - 기본 연산', () => {
  describe('add (덧셈)', () => {
    it('두 양수의 합을 반환해야 한다', () => {
      expect(add(5, 3)).toBe(8)
      expect(add(10, 20)).toBe(30)
    })

    it('음수와 양수의 합을 반환해야 한다', () => {
      expect(add(-5, 3)).toBe(-2)
      expect(add(10, -20)).toBe(-10)
    })

    it('두 음수의 합을 반환해야 한다', () => {
      expect(add(-5, -3)).toBe(-8)
    })

    it('소수점 덧셈을 정확하게 처리해야 한다', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3, 10)
    })

    it('0과의 합을 처리해야 한다', () => {
      expect(add(5, 0)).toBe(5)
      expect(add(0, 5)).toBe(5)
      expect(add(0, 0)).toBe(0)
    })
  })

  describe('subtract (뺄셈)', () => {
    it('두 양수의 차를 반환해야 한다', () => {
      expect(subtract(5, 3)).toBe(2)
      expect(subtract(10, 20)).toBe(-10)
    })

    it('음수와 양수의 차를 반환해야 한다', () => {
      expect(subtract(-5, 3)).toBe(-8)
      expect(subtract(10, -20)).toBe(30)
    })

    it('두 음수의 차를 반환해야 한다', () => {
      expect(subtract(-5, -3)).toBe(-2)
    })

    it('소수점 뺄셈을 정확하게 처리해야 한다', () => {
      expect(subtract(0.3, 0.1)).toBeCloseTo(0.2, 10)
    })

    it('0과의 차를 처리해야 한다', () => {
      expect(subtract(5, 0)).toBe(5)
      expect(subtract(0, 5)).toBe(-5)
      expect(subtract(0, 0)).toBe(0)
    })
  })

  describe('multiply (곱셈)', () => {
    it('두 양수의 곱을 반환해야 한다', () => {
      expect(multiply(5, 3)).toBe(15)
      expect(multiply(10, 20)).toBe(200)
    })

    it('음수와 양수의 곱을 반환해야 한다', () => {
      expect(multiply(-5, 3)).toBe(-15)
      expect(multiply(10, -20)).toBe(-200)
    })

    it('두 음수의 곱은 양수여야 한다', () => {
      expect(multiply(-5, -3)).toBe(15)
    })

    it('소수점 곱셈을 정확하게 처리해야 한다', () => {
      expect(multiply(0.5, 0.4)).toBeCloseTo(0.2, 10)
    })

    it('0과의 곱은 0이어야 한다', () => {
      expect(multiply(5, 0)).toBe(0)
      expect(multiply(0, 5)).toBe(0)
      expect(multiply(0, 0)).toBe(0)
    })
  })

  describe('divide (나눗셈)', () => {
    it('두 양수의 몫을 반환해야 한다', () => {
      const result1 = divide(6, 3)
      expect(result1.success).toBe(true)
      if (result1.success) expect(result1.value).toBe(2)

      const result2 = divide(10, 2)
      expect(result2.success).toBe(true)
      if (result2.success) expect(result2.value).toBe(5)
    })

    it('음수와 양수의 몫을 반환해야 한다', () => {
      const result1 = divide(-6, 3)
      expect(result1.success).toBe(true)
      if (result1.success) expect(result1.value).toBe(-2)

      const result2 = divide(10, -2)
      expect(result2.success).toBe(true)
      if (result2.success) expect(result2.value).toBe(-5)
    })

    it('두 음수의 몫은 양수여야 한다', () => {
      const result = divide(-6, -3)
      expect(result.success).toBe(true)
      if (result.success) expect(result.value).toBe(2)
    })

    it('소수점 나눗셈을 정확하게 처리해야 한다', () => {
      const result = divide(0.3, 0.1)
      expect(result.success).toBe(true)
      if (result.success) expect(result.value).toBeCloseTo(3, 10)
    })

    it('0으로 나누면 에러를 반환해야 한다', () => {
      const result = divide(5, 0)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Error: Division by zero')
      }
    })

    it('0이 아닌 수를 0으로 나누면 에러를 반환해야 한다', () => {
      const result = divide(0, 5)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe(0)
      }
    })
  })

  describe('percent (퍼센트)', () => {
    it('양수의 퍼센트를 반환해야 한다', () => {
      expect(percent(50)).toBe(0.5)
      expect(percent(100)).toBe(1)
      expect(percent(25)).toBe(0.25)
    })

    it('음수의 퍼센트를 반환해야 한다', () => {
      expect(percent(-50)).toBe(-0.5)
      expect(percent(-100)).toBe(-1)
    })

    it('0의 퍼센트는 0이어야 한다', () => {
      expect(percent(0)).toBe(0)
    })

    it('소수점 퍼센트를 처리해야 한다', () => {
      expect(percent(0.5)).toBeCloseTo(0.005, 10)
    })
  })
})

describe('calculator.ts - 입력 유효성 검사', () => {
  describe('validateNumberInput', () => {
    it('숫자 키 입력은 유효해야 한다', () => {
      expect(validateNumberInput('0', '0')).toBe(true)
      expect(validateNumberInput('0', '5')).toBe(true)
      expect(validateNumberInput('123', '9')).toBe(true)
    })

    it('소수점 입력은 첫 번째만 유효해야 한다', () => {
      expect(validateNumberInput('0', '.')).toBe(true)
      expect(validateNumberInput('123', '.')).toBe(true)
      expect(validateNumberInput('123.45', '.')).toBe(false)
    })

    it('음수 기호는 첫 번째만 유효해야 한다', () => {
      expect(validateNumberInput('', '-')).toBe(true)
      expect(validateNumberInput('123', '-')).toBe(false)
      expect(validateNumberInput('-123', '-')).toBe(false)
    })

    it('빈 값일 때 0 입력은 유효해야 한다', () => {
      expect(validateNumberInput('', '0')).toBe(true)
    })

    it('빈 값일 때 다른 숫자는 유효해야 한다', () => {
      expect(validateNumberInput('', '5')).toBe(true)
    })
  })
})

describe('calculator.ts - 숫자 포맷팅', () => {
  describe('formatNumber', () => {
    it('정수를 천 단위 구분 기호로 포맷해야 한다', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(1234567890)).toBe('1,234,567,890')
    })

    it('소수점을 최대 10자리까지 표현해야 한다', () => {
      expect(formatNumber(0.123456789012345)).toBe('0.123456789')
    })

    it('후행 제로를 제거해야 한다', () => {
      expect(formatNumber(1.5000)).toBe('1.5')
      expect(formatNumber(1.0)).toBe('1')
      expect(formatNumber(10.00)).toBe('10')
    })

    it('음수를 올바르게 포맷해야 한다', () => {
      expect(formatNumber(-1000)).toBe('-1,000')
      expect(formatNumber(-1.5)).toBe('-1.5')
    })

    it('0을 올바르게 포맷해야 한다', () => {
      expect(formatNumber(0)).toBe('0')
    })

    it('매우 작은 소수를 처리해야 한다', () => {
      expect(formatNumber(0.0000000001)).toBe('0.0000000001')
    })

    it('NaN을 에러 메시지로 변환해야 한다', () => {
      expect(formatNumber(NaN)).toBe('Error: NaN')
    })

    it('Infinity를 에러 메시지로 변환해야 한다', () => {
      expect(formatNumber(Infinity)).toBe('Error: Infinity')
      expect(formatNumber(-Infinity)).toBe('Error: -Infinity')
    })
  })
})
