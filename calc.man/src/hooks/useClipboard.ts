/**
 * useClipboard Hook
 *
 * [SPEC-CALC-003] 클립보드 복사/붙여넛기 처리 커스텀 Hook
 * - Clipboard API 사용
 * - 숫자 유효성 검사
 * - 복사 피드백 (일시적 표시)
 */

import { useState, useCallback } from 'react'

/**
 * 클립보드 복사/붙여넛기 Hook
 */
export function useClipboard() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null)

  /**
   * 클립보드에 텍스트 복사
   *
   * [SPEC-CALC-003] REQ-103: Ctrl/Cmd+C → 클립보드 복사
   */
  const copy = useCallback(async (text: string): Promise<void> => {
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported')
      throw new Error('Clipboard API not supported')
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedValue(text)

      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopiedValue(null)
      }, 2000)
    } catch (error) {
      // 에러 로그는 에러 케이스 테스트에서 스파이로 검증하므로 그대로 출력
      console.error('Failed to copy:', error)
      throw error
    }
  }, [])

  /**
   * 클립보드에서 텍스트 붙여넛기
   *
   * [SPEC-CALC-003] REQ-104: Ctrl/Cmd+V → 클립보드 붙여넛기
   * [SPEC-CALC-003] REQ-203: 유효하지 않은 숫자면 무시
   */
  const paste = useCallback(async (): Promise<string | null> => {
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported')
      throw new Error('Clipboard API not supported')
    }

    try {
      const text = await navigator.clipboard.readText()

      // 숫자 유효성 검사 (정수, 음수, 소수)
      const numberRegex = /^-?\d*\.?\d+$/

      if (!numberRegex.test(text)) {
        return null
      }

      return text
    } catch (error) {
      // 에러 로그는 에러 케이스 테스트에서 스파이로 검증하므로 그대로 출력
      console.error('Failed to paste:', error)
      throw error
    }
  }, [])

  return {
    copy,
    paste,
    copiedValue,
  }
}
