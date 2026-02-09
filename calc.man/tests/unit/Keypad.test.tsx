import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Keypad from '@/components/calculator/Keypad'

/**
 * Keypad 컴포넌트 테스트
 *
 * [SPEC-CALC-002] Keypad 컴포넌트 테스트
 * - 버튼 그리드 레이아웃 검증
 * - 클릭 이벤트 전달 검증
 * - 반응형 레이아웃 검증
 */
describe('Keypad Component', () => {
  /**
   * 모든 숫자 버튼 (0-9) 렌더링
   */
  it('should render all number buttons (0-9)', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    // 0-9 숫자 버튼 확인
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument()
    }
  })

  /**
   * AC 버튼 렌더링
   */
  it('should render AC button', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'All Clear' })).toBeInTheDocument()
  })

  /**
   * C 버튼 렌더링
   */
  it('should render C button', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
  })

  /**
   * 연산자 버튼 렌더링 (+, -, *, /)
   */
  it('should render operator buttons', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subtract' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Multiply' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Divide' })).toBeInTheDocument()
  })

  /**
   * Equals 버튼 렌더링
   */
  it('should render equals button', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Equals' })).toBeInTheDocument()
  })

  /**
   * 소수점 버튼 렌더링
   */
  it('should render decimal point button', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Decimal Point' })).toBeInTheDocument()
  })

  /**
   * REQ-UI-004: 숫자 버튼 클릭 시 onButtonClick 핸들러 호출
   */
  it('should call onButtonClick with number when number button is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Keypad onButtonClick={handleClick} />)

    const button5 = screen.getByRole('button', { name: '5' })
    await user.click(button5)

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith('5')
  })

  /**
   * REQ-UI-005: AC 버튼 클릭 시 onButtonClick('AC') 호출
   */
  it('should call onButtonClick with AC when AC button is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Keypad onButtonClick={handleClick} />)

    const acButton = screen.getByRole('button', { name: 'All Clear' })
    await user.click(acButton)

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith('AC')
  })

  /**
   * REQ-UI-006: C 버튼 클릭 시 onButtonClick('C') 호출
   */
  it('should call onButtonClick with C when C button is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Keypad onButtonClick={handleClick} />)

    const cButton = screen.getByRole('button', { name: 'Clear' })
    await user.click(cButton)

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith('C')
  })

  /**
   * 연산자 버튼 클릭 시 핸들러 호출
   */
  it('should call onButtonClick with operator when operator button is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Keypad onButtonClick={handleClick} />)

    const addButton = screen.getByRole('button', { name: 'Add' })
    await user.click(addButton)

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith('+')
  })

  /**
   * REQ-UI-010: 4x5 그리드 레이아웃
   */
  it('should have grid layout with 4 columns', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    const grid = screen.getByRole('button', { name: '7' }).closest('.grid')
    expect(grid).toHaveClass('grid-cols-4')
  })

  /**
   * REQ-UI-010: 모바일 간격 (gap-2 = 8px)
   */
  it('should have mobile gap spacing', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    const grid = screen.getByRole('button', { name: '7' }).closest('.grid')
    expect(grid).toHaveClass('gap-2')
  })

  /**
   * REQ-UI-010: 데스크톱 간격 (md:gap-3 = 12px)
   */
  it('should have desktop gap spacing', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    const grid = screen.getByRole('button', { name: '7' }).closest('.grid')
    expect(grid).toHaveClass('md:gap-3')
  })

  /**
   * 총 버튼 수 확인 (0-9: 10개, AC, C, /, *, -, +, =, .: 8개 = 18개)
   */
  it('should render total of 18 buttons', () => {
    render(<Keypad onButtonClick={vi.fn()} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(18)
  })

  /**
   * 버튼 레이아웃 순서 확인
   */
  it('should render buttons in correct layout order', () => {
    const handleClick = vi.fn()
    render(<Keypad onButtonClick={handleClick} />)

    const buttons = screen.getAllByRole('button')

    // 첫 번째 행: AC, C, /, *
    expect(buttons[0]).toHaveAttribute('aria-label', 'All Clear')
    expect(buttons[1]).toHaveAttribute('aria-label', 'Clear')
    expect(buttons[2]).toHaveAttribute('aria-label', 'Divide')
    expect(buttons[3]).toHaveAttribute('aria-label', 'Multiply')
  })
})
