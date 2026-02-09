import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { useCalculatorStore } from '@/store/useCalculatorStore'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useClipboard } from '@/hooks/useClipboard'
import { useHistory } from '@/hooks/useHistory'
import Display from './Display'
import Keypad from './Keypad'

/**
 * Calculator 컴포넌트
 *
 * [SPEC-CALC-002] 전체 계산기 UI 조율 및 레이아웃 관리
 * [SPEC-CALC-003] 이력, 키보드, 클립보드 기능 통합
 * - useCalculatorStore로 계산기 상태 관리
 * - useKeyboard로 키보드 입력 처리
 * - useClipboard로 복사/붙여넛기
 * - useHistory로 계산 이력 저장
 * - Display와 Keypad 컴포넌트 조합
 * - shadcn/ui Card 컴포넌트로 전체 래핑
 *
 * REQ-UI-001: 항상 현재 입력값 표시
 * REQ-UI-012: UI 렌더링 중에 엔진 상태를 직접 수정하지 않음
 * [SPEC-CALC-003] REQ-001: 계산 완료 시 자동 저장
 */
export default function Calculator() {
  const {
    displayValue,
    previousValue,
    operator,
    error,
    inputNumber,
    setOperator,
    calculate,
    clearAll,
    deleteLast,
  } = useCalculatorStore()

  const { copy, paste, copiedValue } = useClipboard()
  const { saveCalculation } = useHistory()

  /**
   * [SPEC-CALC-003] 키보드 입력 처리
   */
  useKeyboard(
    // 일반 입력 핸들러
    (value) => handleInput(value),
    // 복사 핸들러
    () => copy(displayValue),
    // 붙여넛기 핸들러
    async () => {
      const pasted = await paste()
      if (pasted) {
        handlePaste(pasted)
      }
    }
  )

  /**
   * [SPEC-CALC-003] 계산 완료 시 이력 저장
   * [SPEC-CALC-003] REQ-001: 계산 완료 시 결과를 SQLite에 자동 저장
   * [SPEC-CALC-003] REQ-204: 에러 상태는 저장하지 않음
   */
  useEffect(() => {
    if (
      !error &&
      previousValue !== null &&
      operator === null &&
      displayValue !== '0'
    ) {
      // 계산이 완료된 상태 (연산자가 없고 이전 값이 있는 경우)
      const expression = `${previousValue} ${operator} ${displayValue}`
      saveCalculation(expression, displayValue).catch((err) => {
        console.error('Failed to save calculation:', err)
      })
    }
  }, [error, previousValue, operator, displayValue, saveCalculation])

  /**
   * 입력 처리 통합 함수
   */
  const handleInput = (value: string) => {
    // 에러 상태이면 AC 버튼만 허용
    if (error && value !== 'AC') {
      return
    }

    switch (value) {
      case 'AC':
        clearAll()
        break
      case 'DEL':
        deleteLast()
        break
      case '=':
        calculate()
        break
      case '+':
      case '-':
        setOperator(value)
        break
      case '*':
      case '×':
        setOperator('×')
        break
      case '/':
      case '÷':
        setOperator('÷')
        break
      default:
        // 숫자 또는 소수점
        inputNumber(value)
        break
    }
  }

  /**
   * [SPEC-CALC-003] 붙여넛기 처리
   * [SPEC-CALC-003] REQ-104: 클립보드의 숫자를 붙여넛기
   */
  const handlePaste = (value: string) => {
    if (error) {
      return
    }

    // 붙여넛은 값으로 displayValue를 교체
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue)) {
      // Store의 displayValue를 직접 업데이트하는 방식이 필요할 수 있음
      // 현재는 inputNumber를 통해 숫자를 하나씩 입력하는 방식
      // 개선을 위해 store에 setValue 액션 추가 필요
      inputNumber(value)
    }
  }

  /**
   * 버튼 클릭 핸들러
   *
   * REQ-UI-012: UI는 이벤트 핸들러를 통해 상태 변경만 요청
   */
  const handleButtonClick = (value: string) => {
    handleInput(value)
  }

  return (
    <Card className="p-6 shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Calc.man</h1>

      {/* 디스플레이 영역 - 복사 피드백 표시 */}
      <Display value={displayValue} error={!!error} copied={copiedValue !== null} />

      {/* 키패드 영역 */}
      <Keypad onButtonClick={handleButtonClick} />
    </Card>
  )
}
