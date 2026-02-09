import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import KeypadButton from '@/components/calculator/KeypadButton'

/**
 * KeypadButton 컴포넌트 테스트
 *
 * [SPEC-CALC-002] KeypadButton 컴포넌트 테스트
 * - 클릭 이벤트 처리 검증
 * - 스타일 변형 검증
 * - 접근성 검증
 */
describe('KeypadButton Component', () => {
  /**
   * REQ-UI-004: 숫자 버튼 클릭 시 onClick 핸들러 호출
   */
  it('should call onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<KeypadButton value="5" onClick={handleClick} />)

    const button = screen.getByRole('button', { name: '5' })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith('5')
  })

  /**
   * REQ-UI-002: 접근성 - aria-label 제공
   */
  it('should have accessible label', () => {
    render(<KeypadButton value="7" onClick={vi.fn()} />)

    const button = screen.getByRole('button', { name: '7' })
    expect(button).toBeInTheDocument()
  })

  /**
   * 기본 스타일 (default variant)
   */
  it('should have default styles for default variant', () => {
    render(<KeypadButton value="1" onClick={vi.fn()} variant="default" />)

    const button = screen.getByRole('button', { name: '1' })
    expect(button).toHaveClass('bg-gray-100')
  })

  /**
   * 연산자 스타일 (operator variant)
   */
  it('should have operator styles for operator variant', () => {
    render(<KeypadButton value="+" onClick={vi.fn()} variant="operator" />)

    const button = screen.getByRole('button', { name: 'Add' })
    expect(button).toHaveClass('bg-orange-500')
  })

  /**
   * 특수 버튼 스타일 (special variant)
   */
  it('should have special styles for special variant', () => {
    render(<KeypadButton value="AC" onClick={vi.fn()} variant="special" />)

    const button = screen.getByRole('button', { name: 'All Clear' })
    expect(button).toHaveClass('bg-blue-500')
  })

  /**
   * REQ-UI-011: 비활성화된 버튼은 클릭 이벤트 처리하지 않음
   */
  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<KeypadButton value="5" onClick={handleClick} disabled />)

    const button = screen.getByRole('button', { name: '5' })
    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  /**
   * REQ-UI-011: 비활성화된 버튼 시각적 표시
   */
  it('should have disabled attribute when disabled prop is true', () => {
    render(<KeypadButton value="5" onClick={vi.fn()} disabled />)

    const button = screen.getByRole('button', { name: '5' })
    expect(button).toBeDisabled()
  })

  /**
   * REQ-UI-010: 모바일 버튼 크기 (h-15 = 60px)
   */
  it('should have mobile button size', () => {
    render(<KeypadButton value="8" onClick={vi.fn()} />)

    const button = screen.getByRole('button', { name: '8' })
    expect(button).toHaveClass('h-15')
  })

  /**
   * REQ-UI-010: 데스크톱 버튼 크기 (md:h-20 = 80px)
   */
  it('should have desktop button size', () => {
    render(<KeypadButton value="8" onClick={vi.fn()} />)

    const button = screen.getByRole('button', { name: '8' })
    expect(button).toHaveClass('md:h-20')
  })

  /**
   * 그리드 스팬 (span prop)
   */
  it('should apply grid span when span prop is provided', () => {
    render(<KeypadButton value="0" onClick={vi.fn()} span={2} />)

    const button = screen.getByRole('button', { name: '0' })
    expect(button).toHaveClass('col-span-2')
  })

  /**
   * AC 버튼에 대한 특수 aria-label
   */
  it('should have special aria-label for AC button', () => {
    render(<KeypadButton value="AC" onClick={vi.fn()} variant="special" />)

    const button = screen.getByRole('button', { name: 'All Clear' })
    expect(button).toBeInTheDocument()
  })

  /**
   * C 버튼에 대한 특수 aria-label
   */
  it('should have special aria-label for C button', () => {
    render(<KeypadButton value="C" onClick={vi.fn()} variant="special" />)

    const button = screen.getByRole('button', { name: 'Clear' })
    expect(button).toBeInTheDocument()
  })

  /**
   * Equals 버튼에 대한 특수 aria-label
   */
  it('should have special aria-label for equals button', () => {
    render(<KeypadButton value="=" onClick={vi.fn()} variant="special" />)

    const button = screen.getByRole('button', { name: 'Equals' })
    expect(button).toBeInTheDocument()
  })
})
