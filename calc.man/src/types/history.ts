/**
 * 계산 이력 관련 타입 정의
 *
 * [SPEC-CALC-003] 데이터 모델 명세
 */

/**
 * 계산 이력 항목
 */
export interface Calculation {
  id: number
  expression: string
  result: string
  timestamp: number
  created_at: string
}

/**
 * 이력 상태
 */
export interface HistoryState {
  items: Calculation[]
  isLoading: boolean
  error: string | null
}

/**
 * 이력 스토어 액션
 */
export interface HistoryActions {
  // 데이터베이스 초기화
  initDatabase: () => Promise<void>
  // 계산 저장
  saveCalculation: (expression: string, result: string) => Promise<void>
  // 최근 이력 조회
  getRecentHistory: (limit?: number) => Promise<Calculation[]>
  // 이력 항목 복원
  restoreFromHistory: (item: Calculation) => void
  // 모든 이력 삭제
  clearHistory: () => Promise<void>
  // 특정 이력 항목 삭제
  deleteHistoryItem: (id: number) => Promise<void>
  // 상태 초기화
  resetHistory: () => void
}

/**
 * 이력 스토어 타입
 */
export type HistoryStore = HistoryState & HistoryActions

/**
 * 데이터베이스 초기화 상태
 */
export type DbInitStatus = 'idle' | 'loading' | 'success' | 'error'
