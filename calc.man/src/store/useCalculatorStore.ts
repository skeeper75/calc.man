import { create } from 'zustand'
import type { CalculatorState, Operator } from '../types/calculator'
import {
  add,
  subtract,
  multiply,
  divide,
  percent,
  formatNumber,
  validateNumberInput,
} from '../lib/calculator'
import { parseFormattedNumber } from '../lib/formatter'

/**
 * 계산기 상태 관리 스토어
 *
 * Zustand를 사용한 계산기 상태 관리
 */
interface CalculatorActions {
  // 숫자 입력
  inputNumber: (num: string) => void
  // 연산자 설정
  setOperator: (op: Operator) => void
  // 계산 실행
  calculate: () => void
  // 부호 변경
  toggleSign: () => void
  // 퍼센트 계산
  inputPercent: () => void
  // 현재 입력만 지우기
  clearEntry: () => void
  // 모두 지우기
  clearAll: () => void
  // 마지막 문자 삭제
  deleteLast: () => void
  // 상태 초기화
  reset: () => void
}

type CalculatorStore = CalculatorState & CalculatorActions

/**
 * 초기 상태
 */
const initialState: CalculatorState = {
  displayValue: '0',
  previousValue: null,
  operator: null,
  waitingForNewValue: false,
  error: null,
}

/**
 * 계산기 스토어
 */
export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  ...initialState,

  /**
   * 숫자 입력 처리
   */
  inputNumber: (num: string) => {
    const state = get()

    // 에러 상태이면 입력 무시
    if (state.error) {
      return
    }

    // 새로운 값 입력 대기 중이면 displayValue를 교체
    if (state.waitingForNewValue) {
      if (validateNumberInput('', num)) {
        set({
          displayValue: num === '.' ? '0.' : num,
          waitingForNewValue: false,
        })
      }
      return
    }

    // 현재 값이 '0'이고 소수점이 아니면 교체
    if (state.displayValue === '0' && num !== '.') {
      set({ displayValue: num })
      return
    }

    // 유효성 검사 후 입력 추가
    if (validateNumberInput(state.displayValue, num)) {
      set({ displayValue: state.displayValue + num })
    }
  },

  /**
   * 연산자 설정
   */
  setOperator: (op: Operator) => {
    const state = get()

    // 에러 상태이면 무시
    if (state.error) {
      return
    }

    // 이전 연산이 있으면 계산 먼저 실행
    if (state.operator && state.previousValue && !state.waitingForNewValue) {
      get().calculate()
      const newState = get()
      if (newState.error) return
    }

    set({
      operator: op,
      previousValue: state.displayValue,
      waitingForNewValue: true,
    })
  },

  /**
   * 계산 실행
   */
  calculate: () => {
    const state = get()

    if (!state.operator || state.previousValue === null) {
      return
    }

    // % 연산자는 계산하지 않음
    if (state.operator === '%') {
      return
    }

    const prev = parseFormattedNumber(state.previousValue)
    const current = parseFormattedNumber(state.displayValue)

    // 연산자별 계산 함수 매핑
    const operations: Record<
      '+' | '-' | '×' | '÷',
      () => number | null
    > = {
      '+': () => add(prev, current),
      '-': () => subtract(prev, current),
      '×': () => multiply(prev, current),
      '÷': () => {
        const result = divide(prev, current)
        if (!result.success) {
          set({ error: result.error })
          return null
        }
        return result.value
      },
    }

    const result = operations[state.operator]?.()

    // 에러 또는 유효하지 않은 연산자 처리
    if (result === null || result === undefined) {
      return
    }

    set({
      displayValue: formatNumber(result),
      previousValue: null,
      operator: null,
      waitingForNewValue: true,
    })
  },

  /**
   * 부호 변경
   */
  toggleSign: () => {
    const state = get()

    // 에러 상태이면 무시
    if (state.error) {
      return
    }

    const current = parseFormattedNumber(state.displayValue)
    const toggled = -current
    set({ displayValue: formatNumber(toggled) })
  },

  /**
   * 퍼센트 계산
   */
  inputPercent: () => {
    const state = get()

    // 에러 상태이면 무시
    if (state.error) {
      return
    }

    const current = parseFormattedNumber(state.displayValue)
    const result = percent(current)
    set({ displayValue: formatNumber(result) })
  },

  /**
   * 현재 입력만 지우기
   */
  clearEntry: () => {
    set({
      displayValue: '0',
      waitingForNewValue: false,
    })
  },

  /**
   * 모두 지우기
   */
  clearAll: () => {
    set({
      displayValue: '0',
      previousValue: null,
      operator: null,
      waitingForNewValue: false,
      error: null,
    })
  },

  /**
   * 마지막 문자 삭제
   */
  deleteLast: () => {
    const state = get()

    // 에러 상태이면 무시
    if (state.error) {
      return
    }

    const current = state.displayValue

    // 한 자리만 있으면 0으로
    if (current.length === 1 || (current.length === 2 && current.startsWith('-'))) {
      set({ displayValue: '0' })
      return
    }

    // 마지막 문자 제거
    set({ displayValue: current.slice(0, -1) })
  },

  /**
   * 상태 초기화
   */
  reset: () => {
    set(initialState)
  },
}))
