/**
 * useHistory Hook
 *
 * [SPEC-CALC-003] 계산 이력 관리 커스텀 Hook
 * - 데이터베이스 초기화
 * - 계산 저장 및 조회
 * - 이력 복원
 */

import { useState, useEffect, useCallback } from 'react'
import type { Calculation } from '../types/history'
import { getDatabaseClient } from '../db/client'

/**
 * 계산 이력 관리 Hook
 */
export function useHistory() {
  const [items, setItems] = useState<Calculation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * 데이터베이스 초기화
   */
  useEffect(() => {
    let isMounted = true

    const initDatabase = async () => {
      try {
        const db = getDatabaseClient()
        await db.init()

        if (isMounted) {
          // 최근 이력 로드
          const history = await db.getRecentHistory(20)
          setItems(history)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Database initialization failed')
          setIsLoading(false)
        }
      }
    }

    initDatabase()

    return () => {
      isMounted = false
    }
  }, [])

  /**
   * 계산 저장
   *
   * [SPEC-CALC-003] REQ-001: 계산 완료 시 자동 저장
   */
  const saveCalculation = useCallback(async (expression: string, result: string) => {
    try {
      const db = getDatabaseClient()
      await db.saveCalculation(expression, result)

      // 이력 새로고침
      const history = await db.getRecentHistory(20)
      setItems(history)
    } catch (err) {
      console.error('Failed to save calculation:', err)
      throw err
    }
  }, [])

  /**
   * 이력 복원
   *
   * [SPEC-CALC-003] REQ-107: 이력 항목 클릭 시 계산 복원
   */
  const restoreFromHistory = useCallback((item: Calculation) => {
    // 이력 항목을 반환하여 Calculator 컴포넌트에서 사용
    return item
  }, [])

  /**
   * 특정 이력 항목 삭제
   */
  const deleteHistoryItem = useCallback(async (id: number) => {
    try {
      const db = getDatabaseClient()
      await db.deleteHistoryItem(id)

      // 이력 새로고침
      const history = await db.getRecentHistory(20)
      setItems(history)
    } catch (err) {
      console.error('Failed to delete history item:', err)
      throw err
    }
  }, [])

  /**
   * 모든 이력 삭제
   */
  const clearHistory = useCallback(async () => {
    try {
      const db = getDatabaseClient()
      await db.clearHistory()

      // 이력 비우기
      setItems([])
    } catch (err) {
      console.error('Failed to clear history:', err)
      throw err
    }
  }, [])

  return {
    items,
    isLoading,
    error,
    saveCalculation,
    restoreFromHistory,
    deleteHistoryItem,
    clearHistory,
  }
}
