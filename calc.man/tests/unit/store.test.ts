import { describe, it, expect, beforeEach } from 'vitest'
import { useCalculatorStore } from '../../src/store/useCalculatorStore'

/**
 * useCalculatorStore.ts 유닛 테스트
 *
 * TDD RED 단계: 먼저 실패하는 테스트 작성
 */

describe('store/useCalculatorStore.ts - 계산기 상태 관리', () => {
  beforeEach(() => {
    // 각 테스트 전에 상태 초기화
    useCalculatorStore.getState().reset()
  })

  describe('초기 상태', () => {
    it('초기 displayValue는 "0"이어야 한다', () => {
      const state = useCalculatorStore.getState()
      expect(state.displayValue).toBe('0')
    })

    it('초기 previousValue는 null이어야 한다', () => {
      const state = useCalculatorStore.getState()
      expect(state.previousValue).toBe(null)
    })

    it('초기 operator는 null이어야 한다', () => {
      const state = useCalculatorStore.getState()
      expect(state.operator).toBe(null)
    })

    it('초기 waitingForNewValue는 false여야 한다', () => {
      const state = useCalculatorStore.getState()
      expect(state.waitingForNewValue).toBe(false)
    })

    it('초기 error는 null이어야 한다', () => {
      const state = useCalculatorStore.getState()
      expect(state.error).toBe(null)
    })
  })

  describe('inputNumber 액션', () => {
    it('숫자를 입력하면 displayValue가 업데이트되어야 한다', () => {
      const { inputNumber } = useCalculatorStore.getState()

      inputNumber('5')
      expect(useCalculatorStore.getState().displayValue).toBe('5')

      inputNumber('3')
      expect(useCalculatorStore.getState().displayValue).toBe('53')
    })

    it('waitingForNewValue가 true이면 displayValue를 덮어써야 한다', () => {
      const { inputNumber, setOperator } = useCalculatorStore.getState()

      inputNumber('5')
      setOperator('+')
      expect(useCalculatorStore.getState().waitingForNewValue).toBe(true)

      inputNumber('3')
      expect(useCalculatorStore.getState().displayValue).toBe('3')
      expect(useCalculatorStore.getState().waitingForNewValue).toBe(false)
    })

    it('소수점을 입력하면 소수점이 추가되어야 한다', () => {
      const { inputNumber } = useCalculatorStore.getState()

      inputNumber('5')
      inputNumber('.')
      inputNumber('3')

      expect(useCalculatorStore.getState().displayValue).toBe('5.3')
    })

    it('이미 소수점이 있으면 중복되지 않아야 한다', () => {
      const { inputNumber } = useCalculatorStore.getState()

      inputNumber('5')
      inputNumber('.')
      inputNumber('.')
      inputNumber('3')

      expect(useCalculatorStore.getState().displayValue).toBe('5.3')
    })
  })

  describe('setOperator 액션', () => {
    it('연산자를 설정하고 previousValue를 저장해야 한다', () => {
      const { inputNumber, setOperator } = useCalculatorStore.getState()

      inputNumber('5')
      setOperator('+')

      const state = useCalculatorStore.getState()
      expect(state.operator).toBe('+')
      expect(state.previousValue).toBe('5')
      expect(state.waitingForNewValue).toBe(true)
    })

    it('연속으로 연산자를 설정하면 이전 연산자를 바꿔야 한다', () => {
      const { inputNumber, setOperator } = useCalculatorStore.getState()

      inputNumber('5')
      setOperator('+')
      setOperator('-')

      expect(useCalculatorStore.getState().operator).toBe('-')
    })
  })

  describe('calculate 액션', () => {
    it('덧셈을 계산해야 한다', () => {
      const { inputNumber, setOperator, calculate } = useCalculatorStore.getState()

      inputNumber('5')
      setOperator('+')
      inputNumber('3')
      calculate()

      expect(useCalculatorStore.getState().displayValue).toBe('8')
    })

    it('뺄셈을 계산해야 한다', () => {
      const { inputNumber, setOperator, calculate } = useCalculatorStore.getState()

      inputNumber('10')
      setOperator('-')
      inputNumber('3')
      calculate()

      expect(useCalculatorStore.getState().displayValue).toBe('7')
    })

    it('곱셈을 계산해야 한다', () => {
      const { inputNumber, setOperator, calculate } = useCalculatorStore.getState()

      inputNumber('5')
      setOperator('×')
      inputNumber('3')
      calculate()

      expect(useCalculatorStore.getState().displayValue).toBe('15')
    })

    it('나눗셈을 계산해야 한다', () => {
      const { inputNumber, setOperator, calculate } = useCalculatorStore.getState()

      inputNumber('6')
      setOperator('÷')
      inputNumber('3')
      calculate()

      expect(useCalculatorStore.getState().displayValue).toBe('2')
    })

    it('0으로 나누면 에러를 표시해야 한다', () => {
      const { inputNumber, setOperator, calculate } = useCalculatorStore.getState()

      inputNumber('5')
      setOperator('÷')
      inputNumber('0')
      calculate()

      expect(useCalculatorStore.getState().error).toBe('Error: Division by zero')
    })
  })

  describe('toggleSign 액션', () => {
    it('양수를 음수로 바꿔야 한다', () => {
      const { inputNumber, toggleSign } = useCalculatorStore.getState()

      inputNumber('5')
      toggleSign()

      expect(useCalculatorStore.getState().displayValue).toBe('-5')
    })

    it('음수를 양수로 바꿔야 한다', () => {
      const { inputNumber, toggleSign } = useCalculatorStore.getState()

      inputNumber('5')
      toggleSign()
      toggleSign()

      expect(useCalculatorStore.getState().displayValue).toBe('5')
    })
  })

  describe('inputPercent 액션', () => {
    it('퍼센트를 계산해야 한다', () => {
      const { inputNumber, inputPercent } = useCalculatorStore.getState()

      inputNumber('50')
      inputPercent()

      expect(useCalculatorStore.getState().displayValue).toBe('0.5')
    })
  })

  describe('clearEntry 액션', () => {
    it('현재 입력만 지워야 한다', () => {
      const { inputNumber, setOperator, clearEntry } = useCalculatorStore.getState()

      inputNumber('5')
      setOperator('+')
      inputNumber('3')
      clearEntry()

      const state = useCalculatorStore.getState()
      expect(state.displayValue).toBe('0')
      expect(state.previousValue).toBe('5')
      expect(state.operator).toBe('+')
    })
  })

  describe('clearAll 액션', () => {
    it('모든 상태를 초기화해야 한다', () => {
      const { inputNumber, setOperator, clearAll } = useCalculatorStore.getState()

      inputNumber('5')
      setOperator('+')
      inputNumber('3')
      clearAll()

      const state = useCalculatorStore.getState()
      expect(state.displayValue).toBe('0')
      expect(state.previousValue).toBe(null)
      expect(state.operator).toBe(null)
      expect(state.waitingForNewValue).toBe(false)
      expect(state.error).toBe(null)
    })
  })

  describe('deleteLast 액션', () => {
    it('마지막 숫자를 삭제해야 한다', () => {
      const { inputNumber, deleteLast } = useCalculatorStore.getState()

      inputNumber('5')
      inputNumber('3')
      deleteLast()

      expect(useCalculatorStore.getState().displayValue).toBe('5')
    })

    it('한 자리만 있으면 0이 되어야 한다', () => {
      const { inputNumber, deleteLast } = useCalculatorStore.getState()

      inputNumber('5')
      deleteLast()

      expect(useCalculatorStore.getState().displayValue).toBe('0')
    })
  })

  describe('reset 액션', () => {
    it('상태를 초기값으로 재설정해야 한다', () => {
      const { inputNumber, setOperator, reset } = useCalculatorStore.getState()

      inputNumber('5')
      setOperator('+')
      reset()

      const state = useCalculatorStore.getState()
      expect(state.displayValue).toBe('0')
      expect(state.previousValue).toBe(null)
      expect(state.operator).toBe(null)
      expect(state.waitingForNewValue).toBe(false)
      expect(state.error).toBe(null)
    })
  })
})
