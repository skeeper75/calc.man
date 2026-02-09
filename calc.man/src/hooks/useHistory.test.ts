/**
 * useHistory Hook 테스트
 *
 * [SPEC-CALC-003] TDD: RED-GREEN-REFACTOR
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useHistory } from './useHistory'
import { getDatabaseClient } from '../db/client'
import type { Calculation } from '../types/history'

// Mock database client
vi.mock('../db/client', () => ({
  getDatabaseClient: vi.fn(),
}))

describe('useHistory', () => {
  const mockSaveCalculation = vi.fn()
  const mockGetRecentHistory = vi.fn()
  const mockDeleteHistoryItem = vi.fn()
  const mockClearHistory = vi.fn()
  const mockInit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getDatabaseClient).mockReturnValue({
      init: mockInit,
      saveCalculation: mockSaveCalculation,
      getRecentHistory: mockGetRecentHistory,
      deleteHistoryItem: mockDeleteHistoryItem,
      clearHistory: mockClearHistory,
    } as any)
  })

  describe('초기화', () => {
    it('데이터베이스를 초기화해야 함', async () => {
      // Given: 데이터베이스가 초기화됨
      mockInit.mockResolvedValue(undefined)
      mockGetRecentHistory.mockResolvedValue([])

      // When: Hook 마운트
      const { result } = renderHook(() => useHistory())

      // Then: 초기화 완료 상태가 되어야 함
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockInit).toHaveBeenCalled()
    })

    it('초기화 실패 시 에러 상태가 되어야 함', async () => {
      // Given: 초기화 실패
      mockInit.mockRejectedValue(new Error('Init failed'))

      // When: Hook 마운트
      const { result } = renderHook(() => useHistory())

      // Then: 에러 상태가 되어야 함
      await waitFor(() => {
        expect(result.current.error).toBe('Init failed')
      })
    })

    it('초기화 후 최근 이력을 로드해야 함', async () => {
      // Given: 저장된 이력
      const mockHistory: Calculation[] = [
        { id: 1, expression: '2 + 2', result: '4', timestamp: 1000, created_at: '2024-01-01' },
      ]
      mockInit.mockResolvedValue(undefined)
      mockGetRecentHistory.mockResolvedValue(mockHistory)

      // When: Hook 마운트
      const { result } = renderHook(() => useHistory())

      // Then: 이력이 로드되어야 함
      await waitFor(() => {
        expect(result.current.items).toEqual(mockHistory)
      })
    })
  })

  describe('계산 저장', () => {
    beforeEach(async () => {
      mockInit.mockResolvedValue(undefined)
      mockGetRecentHistory.mockResolvedValue([])
      mockSaveCalculation.mockResolvedValue(1)

      const { result } = renderHook(() => useHistory())
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('계산 결과를 저장해야 함', async () => {
      // Given: Hook이 초기화됨
      const { result } = renderHook(() => useHistory())

      // When: 계산 저장
      await act(async () => {
        await result.current.saveCalculation('2 + 2', '4')
      })

      // Then: 저장되어야 함
      expect(mockSaveCalculation).toHaveBeenCalledWith('2 + 2', '4')
    })

    it('저장 후 이력을 새로고침해야 함', async () => {
      // Given: 저장 후 새 이력
      const newHistory: Calculation[] = [
        { id: 1, expression: '2 + 2', result: '4', timestamp: 1000, created_at: '2024-01-01' },
      ]
      mockSaveCalculation.mockResolvedValue(1)
      mockGetRecentHistory.mockResolvedValue(newHistory)

      const { result } = renderHook(() => useHistory())

      // When: 계산 저장
      await act(async () => {
        await result.current.saveCalculation('2 + 2', '4')
      })

      // Then: 이력이 업데이트되어야 함
      await waitFor(() => {
        expect(result.current.items).toEqual(newHistory)
      })
    })
  })

  describe('이력 복원', () => {
    beforeEach(async () => {
      mockInit.mockResolvedValue(undefined)
      mockGetRecentHistory.mockResolvedValue([])
    })

    it('이력 항목을 복원할 수 있어야 함', async () => {
      // Given: 저장된 이력 항목
      const historyItem: Calculation = {
        id: 1,
        expression: '2 + 2',
        result: '4',
        timestamp: 1000,
        created_at: '2024-01-01',
      }

      // When: Hook에서 복원 함수 호출
      const { result } = renderHook(() => useHistory())

      // 복원 함수는 데이터를 반환만 하고 상태는 변경하지 않음
      await act(async () => {
        const restored = result.current.restoreFromHistory(historyItem)
        expect(restored).toEqual(historyItem)
      })
    })
  })

  describe('이력 삭제', () => {
    beforeEach(async () => {
      mockInit.mockResolvedValue(undefined)
      mockGetRecentHistory.mockResolvedValue([])
    })

    it('특정 항목을 삭제할 수 있어야 함', async () => {
      // Given: Hook이 초기화됨
      mockDeleteHistoryItem.mockResolvedValue(undefined)
      mockGetRecentHistory.mockResolvedValue([])

      const { result } = renderHook(() => useHistory())
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When: 항목 삭제
      await act(async () => {
        await result.current.deleteHistoryItem(1)
      })

      // Then: 삭제되어야 함
      expect(mockDeleteHistoryItem).toHaveBeenCalledWith(1)
    })

    it('모든 이력을 삭제할 수 있어야 함', async () => {
      // Given: Hook이 초기화됨
      mockClearHistory.mockResolvedValue(undefined)
      mockGetRecentHistory.mockResolvedValue([])

      const { result } = renderHook(() => useHistory())
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When: 전체 삭제
      await act(async () => {
        await result.current.clearHistory()
      })

      // Then: 전체 삭제되어야 함
      expect(mockClearHistory).toHaveBeenCalled()
    })
  })
})
