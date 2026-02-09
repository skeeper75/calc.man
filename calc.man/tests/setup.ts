import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Vitest 설정
// 각 테스트 후 컴포넌트 정리
afterEach(() => {
  cleanup()
})
