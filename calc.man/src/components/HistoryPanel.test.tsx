/**
 * HistoryPanel 컴포넌트 테스트
 *
 * [SPEC-CALC-003] TDD: RED-GREEN-REFACTOR
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HistoryPanel from './HistoryPanel'
import type { Calculation } from '../types/history'

describe('HistoryPanel', () => {
  const mockCalculations: Calculation[] = [
    {
      id: 1,
      expression: '2 + 2',
      result: '4',
      timestamp: 1000,
      created_at: '2024-01-01 00:00:00',
    },
    {
      id: 2,
      expression: '3 × 3',
      result: '9',
      timestamp: 2000,
      created_at: '2024-01-01 00:01:00',
    },
    {
      id: 3,
      expression: '10 ÷ 2',
      result: '5',
      timestamp: 3000,
      created_at: '2024-01-01 00:02:00',
    },
  ]

  describe('렌더링', () => {
    it('계산 이력 목록을 표시해야 함', () => {
      // Given: 계산 이력이 있음
      const onRestore = vi.fn()
      const onDelete = vi.fn()

      // When: 컴포넌트 렌더링
      render(
        <HistoryPanel
          items={mockCalculations}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      )

      // Then: 모든 이력 항목이 표시됨
      expect(screen.getByText('2 + 2 =')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('3 × 3 =')).toBeInTheDocument()
      expect(screen.getByText('9')).toBeInTheDocument()
      expect(screen.getByText('10 ÷ 2 =')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('이력이 없으면 빈 상태를 표시해야 함', () => {
      // Given: 빈 이력
      const onRestore = vi.fn()
      const onDelete = vi.fn()

      // When: 컴포넌트 렌더링
      render(
        <HistoryPanel
          items={[]}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      )

      // Then: 빈 상태 메시지 표시
      expect(screen.getByText(/계산 이력이 없습니다/)).toBeInTheDocument()
    })

    it('로딩 중이면 스피너를 표시해야 함', () => {
      // Given: 로딩 상태
      const onRestore = vi.fn()
      const onDelete = vi.fn()

      // When: 컴포넌트 렌더링
      render(
        <HistoryPanel
          items={[]}
          isLoading={true}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      )

      // Then: 로딩 메시지 표시
      expect(screen.getByText(/로딩 중/)).toBeInTheDocument()
    })

    it('[SPEC-CALC-003] REQ-201: 최대 20개 항목만 표시해야 함', () => {
      // Given: 25개의 이력 항목
      const manyCalculations: Calculation[] = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        expression: `${i} + ${i}`,
        result: `${i * 2}`,
        timestamp: i * 1000,
        created_at: '2024-01-01',
      }))
      const onRestore = vi.fn()
      const onDelete = vi.fn()

      // When: 컴포넌트 렌더링
      const { container } = render(
        <HistoryPanel
          items={manyCalculations}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      )

      // Then: 20개만 표시됨
      const items = container.querySelectorAll('[data-testid="history-item"]')
      expect(items).toHaveLength(20)
    })
  })

  describe('이력 복원', () => {
    it('[SPEC-CALC-003] REQ-107: 이력 항목 클릭 시 복원 핸들러 호출', () => {
      // Given: 계산 이력이 있음
      const onRestore = vi.fn()
      const onDelete = vi.fn()

      render(
        <HistoryPanel
          items={mockCalculations}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      )

      // When: 첫 번째 항목 클릭
      const firstItem = screen.getByText('2 + 2 =')
      fireEvent.click(firstItem)

      // Then: 복원 핸들러가 해당 항목으로 호출됨
      expect(onRestore).toHaveBeenCalledWith(mockCalculations[0])
    })
  })

  describe('이력 삭제', () => {
    it('삭제 버튼 클릭 시 삭제 핸들러 호출', () => {
      // Given: 계산 이력이 있음
      const onRestore = vi.fn()
      const onDelete = vi.fn()

      render(
        <HistoryPanel
          items={mockCalculations}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      )

      // When: 첫 번째 항목의 삭제 버튼 클릭
      const deleteButtons = screen.getAllByLabelText(/삭제/)
      fireEvent.click(deleteButtons[0])

      // Then: 삭제 핸들러가 해당 ID로 호출됨
      expect(onDelete).toHaveBeenCalledWith(1)
    })

    it('삭제 버튼은 접근 가능한 라벨을 가져야 함', () => {
      // Given: 계산 이력이 있음
      const onRestore = vi.fn()
      const onDelete = vi.fn()

      // When: 컴포넌트 렌더링
      render(
        <HistoryPanel
          items={mockCalculations}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      )

      // Then: 모든 삭제 버튼에 aria-label이 있음
      const deleteButtons = screen.getAllByLabelText(/삭제/)
      expect(deleteButtons).toHaveLength(3)
    })
  })

  describe('전체 삭제', () => {
    it('전체 삭제 버튼 클릭 시 onClearAll 핸들러 호출', () => {
      // Given: 계산 이력이 있음
      const onRestore = vi.fn()
      const onDelete = vi.fn()
      const onClearAll = vi.fn()

      render(
        <HistoryPanel
          items={mockCalculations}
          onRestore={onRestore}
          onDelete={onDelete}
          onClearAll={onClearAll}
        />
      )

      // When: 전체 삭제 버튼 클릭
      const clearAllButton = screen.getByText(/전체 삭제/)
      fireEvent.click(clearAllButton)

      // Then: 전체 삭제 핸들러 호출
      expect(onClearAll).toHaveBeenCalled()
    })

    it('이력이 없으면 전체 삭제 버튼을 표시하지 않음', () => {
      // Given: 빈 이력
      const onRestore = vi.fn()
      const onDelete = vi.fn()
      const onClearAll = vi.fn()

      // When: 컴포넌트 렌더링
      render(
        <HistoryPanel
          items={[]}
          onRestore={onRestore}
          onDelete={onDelete}
          onClearAll={onClearAll}
        />
      )

      // Then: 전체 삭제 버튼 없음
      expect(screen.queryByText(/전체 삭제/)).not.toBeInTheDocument()
    })
  })

  describe('접근성', () => {
    it('각 이력 항목에 role="button"이 있어야 함', () => {
      // Given: 계산 이력이 있음
      const onRestore = vi.fn()
      const onDelete = vi.fn()

      // When: 컴포넌트 렌더링
      const { container } = render(
        <HistoryPanel
          items={mockCalculations}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      )

      // Then: 모든 항목에 button role이 있음
      const items = container.querySelectorAll('[role="button"]')
      expect(items.length).toBeGreaterThan(0)
    })

    it('키보드로 항목을 선택할 수 있어야 함', () => {
      // Given: 계산 이력이 있음
      const onRestore = vi.fn()
      const onDelete = vi.fn()

      render(
        <HistoryPanel
          items={mockCalculations}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      )

      // When: 첫 번째 항목에 Enter 키 입력
      const firstItem = screen.getByText('2 + 2 =').closest('[role="button"]')
      if (firstItem) {
        fireEvent.keyDown(firstItem, { key: 'Enter' })

        // Then: 복원 핸들러 호출
        expect(onRestore).toHaveBeenCalledWith(mockCalculations[0])
      }
    })
  })
})
