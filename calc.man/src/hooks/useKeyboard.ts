/**
 * useKeyboard Hook
 *
 * [SPEC-CALC-003] 키보드 입력 처리 커스텀 Hook
 * - 숫자 키 (0-9)
 * - 연산자 키 (+, -, *, /)
 * - 특수 키 (Enter, Escape, Backspace)
 * - 클립보드 단축키 (Ctrl/Cmd+C, Ctrl/Cmd+V)
 */

import { useEffect, useCallback } from 'react'

/**
 * 키보드 입력 처리 Hook
 *
 * @param onInput - 숫자/연산자 입력 핸들러
 * @param onCopy - 복사 핸들러 (선택)
 * @param onPaste - 붙여넣기 핸들러 (선택)
 */
export function useKeyboard(
  onInput: (value: string) => void,
  onCopy?: () => void,
  onPaste?: () => void
) {
  /**
   * 키보드 이벤트 처리
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // [SPEC-CALC-003] REQ-101: Enter 키 → 계산 실행
      if (event.key === 'Enter') {
        event.preventDefault()
        onInput('=')
        return
      }

      // [SPEC-CALC-003] REQ-102: Escape 키 → 초기화 (AC)
      if (event.key === 'Escape') {
        event.preventDefault()
        onInput('AC')
        return
      }

      // [SPEC-CALC-003] REQ-105: 숫자 키 (0-9)
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault()
        onInput(event.key)
        return
      }

      // [SPEC-CALC-003] REQ-106: 연산자 키
      if (event.key === '+') {
        event.preventDefault()
        onInput('+')
        return
      }

      if (event.key === '-') {
        event.preventDefault()
        onInput('-')
        return
      }

      if (event.key === '*') {
        event.preventDefault()
        onInput('×')
        return
      }

      if (event.key === '/') {
        event.preventDefault()
        onInput('÷')
        return
      }

      // 소수점
      if (event.key === '.') {
        event.preventDefault()
        onInput('.')
        return
      }

      // Backspace → DEL
      if (event.key === 'Backspace') {
        event.preventDefault()
        onInput('DEL')
        return
      }

      // [SPEC-CALC-003] REQ-103: Ctrl/Cmd + C → 복사
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        if (onCopy) {
          event.preventDefault()
          onCopy()
        }
        return
      }

      // [SPEC-CALC-003] REQ-104: Ctrl/Cmd + V → 붙여넣기
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        if (onPaste) {
          event.preventDefault()
          onPaste()
        }
        return
      }
    },
    [onInput, onCopy, onPaste]
  )

  /**
   * 이벤트 리스너 등록
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
