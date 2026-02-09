/**
 * useKeyboard Hook 테스트
 *
 * [SPEC-CALC-003] TDD: RED-GREEN-REFACTOR
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboard } from './useKeyboard'

describe('useKeyboard', () => {
  beforeEach(() => {
    // 모든 이벤트 리스너 정리
    vi.clearAllMocks()
  })

  describe('숫자 키 입력', () => {
    it('0-9 키를 입력하면 해당 숫자를 반환해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: 숫자 키 입력
      const event = new KeyboardEvent('keydown', { key: '5' })
      window.dispatchEvent(event)

      // Then: 숫자가 전달되어야 함
      expect(mockOnInput).toHaveBeenCalledWith('5')
    })

    it('모든 숫자 키를 처리해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: 각 숫자 키 입력
      const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      digits.forEach((digit) => {
        const event = new KeyboardEvent('keydown', { key: digit })
        window.dispatchEvent(event)
      })

      // Then: 모든 숫자가 처리되어야 함
      expect(mockOnInput).toHaveBeenCalledTimes(10)
    })
  })

  describe('연산자 키 입력', () => {
    it('더하기 키를 입력하면 + 연산자를 반환해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: + 키 입력
      const event = new KeyboardEvent('keydown', { key: '+' })
      window.dispatchEvent(event)

      // Then: + 연산자가 전달되어야 함
      expect(mockOnInput).toHaveBeenCalledWith('+')
    })

    it('빼기 키를 입력하면 - 연산자를 반환해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: - 키 입력
      const event = new KeyboardEvent('keydown', { key: '-' })
      window.dispatchEvent(event)

      // Then: - 연산자가 전달되어야 함
      expect(mockOnInput).toHaveBeenCalledWith('-')
    })

    it('곱하기 키를 입력하면 × 연산자를 반환해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: * 키 입력
      const event = new KeyboardEvent('keydown', { key: '*' })
      window.dispatchEvent(event)

      // Then: × 연산자가 전달되어야 함
      expect(mockOnInput).toHaveBeenCalledWith('×')
    })

    it('나누기 키를 입력하면 ÷ 연산자를 반환해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: / 키 입력
      const event = new KeyboardEvent('keydown', { key: '/' })
      window.dispatchEvent(event)

      // Then: ÷ 연산자가 전달되어야 함
      expect(mockOnInput).toHaveBeenCalledWith('÷')
    })
  })

  describe('특수 키 입력', () => {
    it('Enter 키를 입력하면 = 를 반환해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: Enter 키 입력
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      window.dispatchEvent(event)

      // Then: = 가 전달되어야 함
      expect(mockOnInput).toHaveBeenCalledWith('=')
    })

    it('Escape 키를 입력하면 AC 를 반환해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: Escape 키 입력
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      window.dispatchEvent(event)

      // Then: AC 가 전달되어야 함
      expect(mockOnInput).toHaveBeenCalledWith('AC')
    })

    it('소수점 키를 입력하면 . 를 반환해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: . 키 입력
      const event = new KeyboardEvent('keydown', { key: '.' })
      window.dispatchEvent(event)

      // Then: . 가 전달되어야 함
      expect(mockOnInput).toHaveBeenCalledWith('.')
    })

    it('Backspace 키를 입력하면 DEL 을 반환해야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnInput = vi.fn()
      renderHook(() => useKeyboard(mockOnInput))

      // When: Backspace 키 입력
      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      window.dispatchEvent(event)

      // Then: DEL 이 전달되어야 함
      expect(mockOnInput).toHaveBeenCalledWith('DEL')
    })
  })

  describe('클립보드 단축키', () => {
    it('Ctrl+C를 누르면 복사 이벤트를 발생시켜야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnCopy = vi.fn()
      const preventDefault = vi.fn()
      renderHook(() => useKeyboard(vi.fn(), mockOnCopy))

      // When: Ctrl+C 입력
      const event = new KeyboardEvent('keydown', {
        key: 'c',
        ctrlKey: true,
      } as any)
      Object.defineProperty(event, 'preventDefault', {
        value: preventDefault,
        configurable: true,
      })
      window.dispatchEvent(event)

      // Then: 복사 함수가 호출되어야 함
      expect(mockOnCopy).toHaveBeenCalled()
      expect(preventDefault).toHaveBeenCalled()
    })

    it('Cmd+C(Mac)를 누르면 복사 이벤트를 발생시켜야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnCopy = vi.fn()
      const preventDefault = vi.fn()
      renderHook(() => useKeyboard(vi.fn(), mockOnCopy))

      // When: Cmd+C 입력
      const event = new KeyboardEvent('keydown', {
        key: 'c',
        metaKey: true,
      } as any)
      Object.defineProperty(event, 'preventDefault', {
        value: preventDefault,
        configurable: true,
      })
      window.dispatchEvent(event)

      // Then: 복사 함수가 호출되어야 함
      expect(mockOnCopy).toHaveBeenCalled()
    })

    it('Ctrl+V를 누르면 붙여넣기 이벤트를 발생시켜야 함', () => {
      // Given: Hook이 마운트됨
      const mockOnPaste = vi.fn()
      const preventDefault = vi.fn()
      renderHook(() => useKeyboard(vi.fn(), vi.fn(), mockOnPaste))

      // When: Ctrl+V 입력
      const event = new KeyboardEvent('keydown', {
        key: 'v',
        ctrlKey: true,
      } as any)
      Object.defineProperty(event, 'preventDefault', {
        value: preventDefault,
        configurable: true,
      })
      window.dispatchEvent(event)

      // Then: 붙여넣기 함수가 호출되어야 함
      expect(mockOnPaste).toHaveBeenCalled()
      expect(preventDefault).toHaveBeenCalled()
    })
  })

  describe('정리', () => {
    it('언마운트 시 이벤트 리스너를 제거해야 함', () => {
      // Given: Hook이 마운트됨
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      const { unmount } = renderHook(() => useKeyboard(vi.fn()))

      // When: 언마운트
      unmount()

      // Then: 이벤트 리스너가 제거되어야 함
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })
  })
})
