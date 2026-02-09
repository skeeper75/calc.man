/**
 * useClipboard Hook 테스트
 *
 * [SPEC-CALC-003] TDD: RED-GREEN-REFACTOR
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useClipboard } from './useClipboard'

describe('useClipboard', () => {
  const mockWriteText = vi.fn()
  const mockReadText = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Clipboard API Mock
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
        readText: mockReadText,
      },
    })
  })

  describe('클립보드 복사', () => {
    it('텍스트를 클립보드에 복사해야 함', async () => {
      // Given: Hook이 마운트됨
      mockWriteText.mockResolvedValue(undefined)
      const { result } = renderHook(() => useClipboard())

      // When: 텍스트 복사
      await act(async () => {
        await result.current.copy('12345')
      })

      // Then: 클립보드에 복사되어야 함
      expect(mockWriteText).toHaveBeenCalledWith('12345')
      expect(result.current.copiedValue).toBe('12345')
    })

    it('복사 후 일정 시간 뒤에 copiedValue를 초기화해야 함', async () => {
      // Given: Hook이 마운트됨
      vi.useFakeTimers()
      mockWriteText.mockResolvedValue(undefined)
      const { result } = renderHook(() => useClipboard())

      // When: 텍스트 복사
      await act(async () => {
        await result.current.copy('12345')
      })

      // Then: 복사 직후에는 값이 유지됨
      expect(result.current.copiedValue).toBe('12345')

      // When: 2초 후
      act(() => {
        vi.advanceTimersByTime(2000)
      })

      // Then: 값이 초기화됨
      expect(result.current.copiedValue).toBeNull()

      vi.useRealTimers()
    })

    it('복사 실패 시 에러를 반환해야 함', async () => {
      // Given: 복사 실패
      mockWriteText.mockRejectedValue(new Error('Copy failed'))
      const { result } = renderHook(() => useClipboard())

      // When: 텍스트 복사 시도
      let caughtError: unknown = null
      await act(async () => {
        try {
          await result.current.copy('12345')
        } catch (e) {
          caughtError = e
        }
      })

      // Then: 에러가 발생해야 함
      expect(caughtError).toBeInstanceOf(Error)
      expect((caughtError as Error).message).toBe('Copy failed')
    })
  })

  describe('클립보드 붙여넣기', () => {
    it('클립보드에서 텍스트를 읽어야 함', async () => {
      // Given: 클립보드에 텍스트가 있음
      mockReadText.mockResolvedValue('12345')
      const { result } = renderHook(() => useClipboard())

      // When: 붙여넣기
      const pasted = await act(async () => {
        return await result.current.paste()
      })

      // Then: 텍스트가 반환되어야 함
      expect(pasted).toBe('12345')
    })

    it('[SPEC-CALC-003] REQ-203: 유효하지 않은 숫자면 null을 반환해야 함', async () => {
      // Given: 클립보드에 유효하지 않은 텍스트
      mockReadText.mockResolvedValue('abc')
      const { result } = renderHook(() => useClipboard())

      // When: 붙여넣기 시도
      const pasted = await act(async () => {
        return await result.current.paste()
      })

      // Then: null이 반환되어야 함
      expect(pasted).toBeNull()
    })

    it('음수도 처리할 수 있어야 함', async () => {
      // Given: 클립보드에 음수
      mockReadText.mockResolvedValue('-123')
      const { result } = renderHook(() => useClipboard())

      // When: 붙여넣기
      const pasted = await act(async () => {
        return await result.current.paste()
      })

      // Then: 음수가 반환되어야 함
      expect(pasted).toBe('-123')
    })

    it('소수점도 처리할 수 있어야 함', async () => {
      // Given: 클립보드에 소수
      mockReadText.mockResolvedValue('12.34')
      const { result } = renderHook(() => useClipboard())

      // When: 붙여넣기
      const pasted = await act(async () => {
        return await result.current.paste()
      })

      // Then: 소수가 반환되어야 함
      expect(pasted).toBe('12.34')
    })

    it('붙여넛기 실패 시 에러를 반환해야 함', async () => {
      // Given: 붙여넛기 실패
      mockReadText.mockRejectedValue(new Error('Paste failed'))
      const { result } = renderHook(() => useClipboard())

      // When: 붙여넛기 시도
      let caughtError: unknown = null
      await act(async () => {
        try {
          await result.current.paste()
        } catch (e) {
          caughtError = e
        }
      })

      // Then: 에러가 발생해야 함
      expect(caughtError).toBeInstanceOf(Error)
      expect((caughtError as Error).message).toBe('Paste failed')
    })
  })

  describe('Clipboard API 미지원', () => {
    it('Clipboard API가 없으면 에러를 처리해야 함', async () => {
      // Given: Clipboard API가 없음
      const originalClipboard = navigator.clipboard
      Object.assign(navigator, { clipboard: undefined as any })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useClipboard())

      // When: 복사 시도
      let caughtError: unknown = null
      await act(async () => {
        try {
          await result.current.copy('12345')
        } catch (e) {
          caughtError = e
        }
      })

      // Then: 에러가 발생하고 콘솔에 기록됨
      expect(caughtError).toBeInstanceOf(Error)
      expect((caughtError as Error).message).toBe('Clipboard API not supported')
      expect(consoleSpy).toHaveBeenCalled()

      // Cleanup
      Object.assign(navigator, { clipboard: originalClipboard })
      consoleSpy.mockRestore()
    })
  })
})
