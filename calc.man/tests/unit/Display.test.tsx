import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Display from '@/components/calculator/Display'

/**
 * Display 컴포넌트 테스트
 *
 * [SPEC-CALC-002] Display 컴포넌트 테스트
 * - 값 표시 검증
 * - 글꼴 크기 자동 조정 검증
 * - 오류 메시지 표시 검증
 */
describe('Display Component', () => {
  /**
   * REQ-UI-001: 현재 입력값을 항상 표시해야 함
   */
  it('should display the current value', () => {
    render(<Display value="123" />)

    expect(screen.getByText('123')).toBeInTheDocument()
  })

  /**
   * REQ-UI-001: 초기값 "0" 표시
   */
  it('should display zero as initial value', () => {
    render(<Display value="0" />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  /**
   * REQ-UI-003: 15자 이하일 때 기본 글꼴 크기 (text-4xl)
   */
  it('should use default font size for values <= 15 characters', () => {
    render(<Display value="123456789012345" />)

    const display = screen.getByText('123456789012345')
    expect(display).toHaveClass('text-4xl')
  })

  /**
   * REQ-UI-008: 16-20자일 때 중간 글꼴 크기 (text-3xl)
   */
  it('should use medium font size for 16-20 characters', () => {
    render(<Display value="1234567890123456" />)

    const display = screen.getByText('1234567890123456')
    expect(display).toHaveClass('text-3xl')
  })

  /**
   * REQ-UI-008: 21자 이상일 때 작은 글꼴 크기 (text-2xl)
   */
  it('should use small font size for 21+ characters', () => {
    render(<Display value="123456789012345678901" />)

    const display = screen.getByText('123456789012345678901')
    expect(display).toHaveClass('text-2xl')
  })

  /**
   * REQ-UI-009: 오류 상태 시 "Error" 메시지 표시
   */
  it('should display "Error" message when error prop is true', () => {
    render(<Display value="0" error={true} />)

    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  /**
   * REQ-UI-009: 오류 상태 시 값 표시 안 함
   */
  it('should not display value when error is true', () => {
    render(<Display value="123" error={true} />)

    expect(screen.queryByText('123')).not.toBeInTheDocument()
  })

  /**
   * REQ-UI-002: 접근성 - aria-live 속성
   */
  it('should have aria-live attribute for accessibility', () => {
    render(<Display value="123" />)

    const display = screen.getByText('123')
    expect(display).toHaveAttribute('aria-live', 'polite')
  })

  /**
   * REQ-UI-002: 접근성 - 오류 상태 시 role="alert"
   */
  it('should have role="alert" when in error state', () => {
    render(<Display value="0" error={true} />)

    const errorDisplay = screen.getByText('Error')
    expect(errorDisplay).toHaveAttribute('role', 'alert')
  })

  /**
   * REQ-UI-003: 긴 숫자도 잘림 없이 표시
   */
  it('should handle long numbers without overflow', () => {
    render(<Display value="123456789012345678901234567890" />)

    const display = screen.getByText('123456789012345678901234567890')
    expect(display).toHaveClass('break-all')
  })

  /**
   * REQ-UI-010: 모바일 높이 (h-20 = 80px)
   */
  it('should have mobile height', () => {
    render(<Display value="123" />)

    const container = screen.getByText('123').closest('.bg-gray-800')
    expect(container).toHaveClass('h-20')
  })

  /**
   * REQ-UI-010: 데스크톱 높이 (md:h-24 = 96px)
   */
  it('should have desktop height', () => {
    render(<Display value="123" />)

    const container = screen.getByText('123').closest('.bg-gray-800')
    expect(container).toHaveClass('md:h-24')
  })

  /**
   * 음수 값 표시 검증
   */
  it('should display negative values', () => {
    render(<Display value="-123" />)

    expect(screen.getByText('-123')).toBeInTheDocument()
  })

  /**
   * 소수점 포함 값 표시 검증
   */
  it('should display decimal values', () => {
    render(<Display value="123.456" />)

    expect(screen.getByText('123.456')).toBeInTheDocument()
  })
})
