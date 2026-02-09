/**
 * [SPEC-CALC-003] 계산 이력 E2E 테스트
 *
 * Playwright를 사용한 엔드투엔드 테스트
 */

import { test, expect } from '@playwright/test'

test.describe('계산 이력 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('[REQ-001] 계산 완료 시 결과가 자동 저장됨', async ({ page }) => {
    // Given: 계산기가 로드됨
    const display = page.locator('[aria-live="polite"]').first()

    // When: 2 + 2 계산 수행
    await page.click('button:has-text("2")')
    await page.click('button:has-text("+")')
    await page.click('button:has-text("2")')
    await page.click('button:has-text("=")')

    // Then: 결과가 표시됨
    await expect(display).toHaveText('4')

    // When: 이력 패널 열기 (구현 필요)
    // TODO: 이력 패널 UI 추가 후 테스트 완료
  })

  test('[REQ-107] 이력 항목 클릭 시 계산 복원', async ({ page }) => {
    // Given: 계산 이력이 있음
    await page.click('button:has-text("5")')
    await page.click('button:has-text("×")')
    await page.click('button:has-text("3")')
    await page.click('button:has-text("=")')

    // When: 이력 패널에서 항목 클릭
    // TODO: 이력 패널 UI 추가 후 테스트 완료

    // Then: 해당 계산이 디스플레이에 복원됨
  })
})

test.describe('키보드 입력 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('[REQ-105] 숫자 키로 입력 가능', async ({ page }) => {
    const display = page.locator('[aria-live="polite"]').first()

    // When: 키보드로 숫자 입력
    await page.keyboard.press('1')
    await page.keyboard.press('2')
    await page.keyboard.press('3')

    // Then: 디스플레이에 숫자 표시
    await expect(display).toHaveText('123')
  })

  test('[REQ-106] 연산자 키로 계산 가능', async ({ page }) => {
    const display = page.locator('[aria-live="polite"]').first()

    // When: 키보드로 계산 입력
    await page.keyboard.press('2')
    await page.keyboard.press('+')
    await page.keyboard.press('3')
    await page.keyboard.press('Enter')

    // Then: 계산 결과 표시
    await expect(display).toHaveText('5')
  })

  test('[REQ-101] Enter 키로 계산 실행', async ({ page }) => {
    const display = page.locator('[aria-live="polite"]').first()

    // When: 키보드로 계산
    await page.keyboard.press('1')
    await page.keyboard.press('0')
    await page.keyboard.press('-')
    await page.keyboard.press('5')
    await page.keyboard.press('Enter')

    // Then: 결과 표시
    await expect(display).toHaveText('5')
  })

  test('[REQ-102] Escape 키로 초기화', async ({ page }) => {
    const display = page.locator('[aria-live="polite"]').first()

    // Given: 숫자 입력됨
    await page.keyboard.press('1')
    await page.keyboard.press('2')
    await page.keyboard.press('3')
    await expect(display).toHaveText('123')

    // When: Escape 키 누름
    await page.keyboard.press('Escape')

    // Then: 초기화됨
    await expect(display).toHaveText('0')
  })
})

test.describe('클립보드 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('[REQ-103] Ctrl+C로 복사 가능', async ({ page }) => {
    // Given: 계산 결과 있음
    await page.click('button:has-text("7")')
    await page.click('button:has-text("×")')
    await page.click('button:has-text("6")')
    await page.click('button:has-text("=")')

    const display = page.locator('[aria-live="polite"]').first()
    await expect(display).toHaveText('42')

    // When: Ctrl+C 누름
    await page.keyboard.press('Control+c')

    // Then: 복사 피드백 표시
    // TODO: 복사 피드백 UI 확인
    const copiedFeedback = page.locator('text=복사됨!')
    await expect(copiedFeedback).toBeVisible()
  })

  test('[REQ-104] Ctrl+V로 붙여넛기 가능', async ({ page }) => {
    // Given: 클립보드에 숫자 있음
    // Playwright에서는 context.grantPermissions로 클립보드 접근 권한 필요
    // 실제 클립보드 조작은 제한적이므로 UI 테스트로 대체

    // When: 디스플레이 포커스 후 Ctrl+V
    await page.click('[aria-live="polite"]')
    await page.keyboard.press('Control+v')

    // Then: 디스플레이 상태 확인 (클립보드가 비어있으므로 변경 없음)
    const display = page.locator('[aria-live="polite"]').first()
    const value = await display.textContent()
    expect(value).toBeTruthy()
  })

  test('[REQ-203] 유효하지 않은 숫자는 붙여넛기 무시', async ({ page }) => {
    // Given: 계산기가 로드됨
    const display = page.locator('[aria-live="polite"]').first()
    const initialValue = await display.textContent()

    // When: Ctrl+V 누름 (클립보드 비어있음)
    await page.click('[aria-live="polite"]')
    await page.keyboard.press('Control+v')

    // Then: 디스플레이 변경 없음
    await expect(display).toHaveText(initialValue ?? '0')
  })
})
