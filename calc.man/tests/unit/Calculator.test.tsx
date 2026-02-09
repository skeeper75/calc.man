import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCalculatorStore } from '@/store/useCalculatorStore'
import Calculator from '@/components/calculator/Calculator'

/**
 * Calculator 컴포넌트 테스트
 *
 * [SPEC-CALC-002] Calculator 컴포넌트 통합 테스트
 * - 전체 워크플로우 테스트
 * - 숫자 입력 → 연산자 → 숫자 입력 → 결과
 * - AC/C 버튼 동작 검증
 */
describe('Calculator Component', () => {
  /**
   * 각 테스트 전 상태 초기화
   */
  beforeEach(() => {
    const { reset } = useCalculatorStore.getState()
    reset()
  })

  /**
   * 디스플레이 요소를 찾는 헬퍼 함수
   */
  function getDisplay() {
    return document.querySelector('.bg-gray-800')
  }

  /**
   * REQ-UI-001: 컴포넌트 렌더링 및 초기값 "0" 표시
   */
  it('should render and display initial value "0"', async () => {
    render(<Calculator />)
    
    // useKeyboard hook의 초기화를 기다림
    await waitFor(() => {
      const display = getDisplay()
      expect(display).toHaveTextContent('0')
    })
  })

  /**
   * Display 컴포넌트 렌더링
   */
  it('should render Display component', async () => {
    render(<Calculator />)
    
    await waitFor(() => {
      const display = getDisplay()
      expect(display).toBeInTheDocument()
    })
  })

  /**
   * Keypad 컴포넌트 렌더링
   */
  it('should render Keypad component', async () => {
    render(<Calculator />)
    
    await waitFor(() => {
      // Keypad에 있는 모든 버튼 확인
      expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'All Clear' })).toBeInTheDocument()
    })
  })

  /**
   * REQ-UI-004: 숫자 버튼 클릭 시 디스플레이에 숫자 표시
   */
  it('should display number when number button is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    const button5 = screen.getByRole('button', { name: '5' })
    await user.click(button5)

    const display = getDisplay()
    expect(display).toHaveTextContent('5')
  })

  /**
   * REQ-UI-004: 여러 숫자 입력
   */
  it('should display multiple numbers when multiple number buttons are clicked', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '3' }))

    const display = getDisplay()
    expect(display).toHaveTextContent('123')
  })

  /**
   * REQ-UI-005: AC 버튼 클릭 시 모든 상태 초기화 및 "0" 표시
   */
  it('should reset to "0" when AC button is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    // 숫자 입력
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '3' }))

    const display = getDisplay()
    expect(display).toHaveTextContent('123')

    // AC 버튼 클릭
    await user.click(screen.getByRole('button', { name: 'All Clear' }))

    expect(display).toHaveTextContent('0')
  })

  /**
   * REQ-UI-006: C 버튼 클릭 시 마지막 문자 삭제
   */
  it('should delete last character when C button is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '3' }))

    const display = getDisplay()
    expect(display).toHaveTextContent('123')

    // C 버튼 클릭
    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(display).toHaveTextContent('12')
  })

  /**
   * REQ-UI-007: 연산자 버튼 클릭 시 시각적 피드백
   */
  it('should handle operator button clicks', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))

    // 연산자 클릭 후에도 숫자가 화면에 유지되어야 함
    const display = getDisplay()
    expect(display).toHaveTextContent('5')
  })

  /**
   * 통합 테스트: 덧셈 (5 + 3 = 8)
   */
  it('should calculate addition: 5 + 3 = 8', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'Equals' }))

    const display = getDisplay()
    expect(display).toHaveTextContent('8')
  })

  /**
   * 통합 테스트: 곱셈 (4 × 3 = 12)
   */
  it('should calculate multiplication: 4 × 3 = 12', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    const buttons = screen.getAllByRole('button')
    const button4 = buttons.find(b => b.getAttribute('aria-label') === '4')
    const buttonMultiply = buttons.find(b => b.getAttribute('aria-label') === 'Multiply')
    const button3 = buttons.find(b => b.getAttribute('aria-label') === '3')
    const buttonEquals = buttons.find(b => b.getAttribute('aria-label') === 'Equals')

    await user.click(button4!)
    await user.click(buttonMultiply!)
    await user.click(button3!)
    await user.click(buttonEquals!)

    const display = getDisplay()
    expect(display).toHaveTextContent('12')
  })

  /**
   * REQ-UI-009: 0으로 나누기 시 "Error" 메시지 표시
   */
  it('should display "Error" when dividing by zero', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    const buttons = screen.getAllByRole('button')
    const button5 = buttons.find(b => b.getAttribute('aria-label') === '5')
    const buttonDivide = buttons.find(b => b.getAttribute('aria-label') === 'Divide')
    const button0 = buttons.find(b => b.getAttribute('aria-label') === '0')
    const buttonEquals = buttons.find(b => b.getAttribute('aria-label') === 'Equals')

    await user.click(button5!)
    await user.click(buttonDivide!)
    await user.click(button0!)
    await user.click(buttonEquals!)

    const display = getDisplay()
    expect(display).toHaveTextContent('Error')
  })

  /**
   * REQ-UI-009: 오류 상태에서 AC 버튼 클릭 시 정상 상태로 복귀
   */
  it('should clear error state when AC button is clicked after error', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    const buttons = screen.getAllByRole('button')
    const button5 = buttons.find(b => b.getAttribute('aria-label') === '5')
    const buttonDivide = buttons.find(b => b.getAttribute('aria-label') === 'Divide')
    const button0 = buttons.find(b => b.getAttribute('aria-label') === '0')
    const buttonEquals = buttons.find(b => b.getAttribute('aria-label') === 'Equals')
    const buttonAC = buttons.find(b => b.getAttribute('aria-label') === 'All Clear')

    // 오류 상태 생성
    await user.click(button5!)
    await user.click(buttonDivide!)
    await user.click(button0!)
    await user.click(buttonEquals!)

    const display = getDisplay()
    expect(display).toHaveTextContent('Error')

    // AC 버튼 클릭
    await user.click(buttonAC!)

    expect(display).toHaveTextContent('0')
  })

  /**
   * 소수점 포함 계산 (1.5 + 2.5 = 4)
   */
  it('should handle decimal numbers in calculations', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: 'Decimal Point' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'Decimal Point' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'Equals' }))

    const display = getDisplay()
    expect(display).toHaveTextContent('4')
  })

  /**
   * REQ-UI-011: 오류 상태에서 버튼 클릭 무시
   */
  it('should ignore button clicks when in error state', async () => {
    const user = userEvent.setup({ delay: null })
    render(<Calculator />)

    // 초기화 대기
    await waitFor(() => {
      expect(getDisplay()).toHaveTextContent('0')
    })

    const buttons = screen.getAllByRole('button')
    const button5 = buttons.find(b => b.getAttribute('aria-label') === '5')
    const buttonDivide = buttons.find(b => b.getAttribute('aria-label') === 'Divide')
    const button0 = buttons.find(b => b.getAttribute('aria-label') === '0')
    const buttonEquals = buttons.find(b => b.getAttribute('aria-label') === 'Equals')
    const button1 = buttons.find(b => b.getAttribute('aria-label') === '1')

    // 오류 상태 생성
    await user.click(button5!)
    await user.click(buttonDivide!)
    await user.click(button0!)
    await user.click(buttonEquals!)

    const display = getDisplay()
    expect(display).toHaveTextContent('Error')

    // 오류 상태에서 숫자 버튼 클릭 시도
    await user.click(button1!)

    // 오류 메시지가 그대로 유지되어야 함
    expect(display).toHaveTextContent('Error')
  })

  /**
   * shadcn/ui Card 컴포넌트로 래핑
   */
  it('should be wrapped in Card component', async () => {
    render(<Calculator />)

    await waitFor(() => {
      const card = document.querySelector('.rounded-xl')
      expect(card).toBeInTheDocument()
    })
  })

  /**
   * REQ-UI-002: 접근성 - 키보드 탐색 가능
   */
  it('should be keyboard navigable', async () => {
    render(<Calculator />)

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label')
      })
    })
  })
})
