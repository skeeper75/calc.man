/**
 * 데이터베이스 클라이언트 테스트
 *
 * [SPEC-CALC-003] TDD: RED-GREEN-REFACTOR
 *
 * 테스트 커버리지 목표: 85%
 */

import { describe, it, expect } from 'vitest'

describe('DatabaseClient', () => {
  describe('테스트 환경에서의 동작', () => {
    it('테스트 환경에서는 초기화가 즉시 완료되어야 함', async () => {
      // Given: 테스트 환경 (NODE_ENV === 'test')

      // When: DatabaseClient 초기화
      const { DatabaseClient } = await import('./client')
      const dbClient = new DatabaseClient()

      // Then: 초기화가 즉시 완료되어야 함
      const status = dbClient.getStatus()
      expect(status).toBe('idle')

      // When: init() 호출
      await dbClient.init()

      // Then: ready 상태가 되어야 함
      const initStatus = dbClient.getStatus()
      expect(initStatus).toBe('ready')
    })

    it('테스트 환경에서는 이력 조회가 빈 배열을 반환해야 함', async () => {
      // Given: 테스트 환경
      const { DatabaseClient } = await import('./client')
      const dbClient = new DatabaseClient()
      await dbClient.init()

      // When: 이력 조회
      const history = await dbClient.getRecentHistory()

      // Then: 빈 배열 반환
      expect(history).toEqual([])
    })

    it('테스트 환경에서는 데이터베이스 내보내기가 null을 반환해야 함', async () => {
      // Given: 테스트 환경
      const { DatabaseClient } = await import('./client')
      const dbClient = new DatabaseClient()
      await dbClient.init()

      // When: 데이터베이스 내보내기
      const exported = await dbClient.export()

      // Then: null 반환
      expect(exported).toBeNull()
    })
  })

  describe('에러 처리', () => {
    it('초기화되지 않은 상태에서 저장 시도 시 에러가 발생해야 함', async () => {
      // Given: 초기화되지 않은 클라이언트
      const { DatabaseClient } = await import('./client')
      const dbClient = new DatabaseClient()

      // When: 계산 저장 시도 (init 없이)
      const savePromise = dbClient.saveCalculation('2 + 2', '4')

      // Then: 에러 발생 (테스트 환경에서는 init이 성공하므로 실제 DB 로직이 실행됨)
      // 테스트 환경에서는 db가 null이므로 에러 발생
      await expect(savePromise).rejects.toThrow('Database not initialized')
    })
  })
})
