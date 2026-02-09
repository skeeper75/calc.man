import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Layout from '@/components/layout/Layout'

/**
 * Layout 컴포넌트 테스트
 *
 * [SPEC-CALC-002] Layout 컴포넌트 테스트
 * - 반응형 컨테이너 및 중앙 정렬 검증
 * - 모바일/데스크톱 패딩 검증
 */
describe('Layout Component', () => {
  /**
   * REQ-UI-010: 레이아웃이 자식 컴포넌트를 렌더링해야 함
   */
  it('should render children', () => {
    render(
      <Layout>
        <div data-testid="child">Test Content</div>
      </Layout>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  /**
   * REQ-UI-010: 모바일 레이아웃 클래스 검증 (패딩 16px)
   */
  it('should have mobile responsive classes', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    const layout = screen.getByText('Test').parentElement
    expect(layout).toHaveClass('p-4') // 16px padding for mobile
  })

  /**
   * REQ-UI-010: 데스크톱 레이아웃 클래스 검증 (패딩 24px)
   */
  it('should have desktop responsive classes', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    const layout = screen.getByText('Test').parentElement
    expect(layout).toHaveClass('md:p-6') // 24px padding for desktop
  })

  /**
   * REQ-UI-010: 중앙 정렬 검증
   */
  it('should center content horizontally and vertically', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    const layout = screen.getByText('Test').parentElement?.parentElement
    expect(layout).toHaveClass('flex', 'items-center', 'justify-center')
  })

  /**
   * REQ-UI-010: 최대 너비 제한 검증 (max-w-md)
   */
  it('should have max width constraint', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    const container = screen.getByText('Test').parentElement
    expect(container).toHaveClass('max-w-md')
  })
})
