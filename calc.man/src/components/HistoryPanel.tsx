/**
 * HistoryPanel 컴포넌트
 *
 * [SPEC-CALC-003] 계산 이력 패널 UI
 * - 최근 계산 이력 표시 (최대 20개)
 * - 이력 항목 클릭 시 복원
 * - 개별/전체 삭제 기능
 * - WCAG 2.1 AA 준수
 */

import { Trash2, Clock } from 'lucide-react'
import type { Calculation } from '../types/history'

interface HistoryPanelProps {
  /** 계산 이력 목록 */
  items: Calculation[]
  /** 로딩 상태 */
  isLoading?: boolean
  /** 이력 복원 핸들러 */
  onRestore: (item: Calculation) => void
  /** 개별 삭제 핸들러 */
  onDelete: (id: number) => void
  /** 전체 삭제 핸들러 */
  onClearAll?: () => void
}

/**
 * 계산 이력 패널 컴포넌트
 */
export default function HistoryPanel({
  items,
  isLoading = false,
  onRestore,
  onDelete,
  onClearAll,
}: HistoryPanelProps) {
  /**
   * [SPEC-CALC-003] REQ-201: 최대 20개 항목 표시
   */
  const displayItems = items.slice(0, 20)

  /**
   * 타임스탬프를 readable 형식으로 변환
   */
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`

    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    })
  }

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center p-8 text-gray-500"
        role="status"
        aria-live="polite"
      >
        <Clock className="w-5 h-5 mr-2 animate-spin" />
        <span>로딩 중...</span>
      </div>
    )
  }

  /**
   * 빈 상태
   */
  if (displayItems.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 text-gray-400"
        role="status"
        aria-live="polite"
      >
        <Clock className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">계산 이력이 없습니다</p>
        <p className="text-xs mt-1">계산을 완료하면 이력이 저장됩니다</p>
      </div>
    )
  }

  /**
   * 이력 목록
   */
  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          계산 이력 ({displayItems.length})
        </h2>

        {/* 전체 삭제 버튼 */}
        {onClearAll && items.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="모든 계산 이력 삭제"
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* 이력 목록 */}
      <ul
        className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800"
        role="listbox"
        aria-label="계산 이력 목록"
      >
        {displayItems.map((item) => (
          <li
            key={item.id}
            data-testid="history-item"
            className="group"
          >
            <div
              onClick={() => onRestore(item)}
              onKeyDown={(e) => {
                // Enter와 Space 키로 복원
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onRestore(item)
                }
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800/50 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${item.expression} = ${item.result}, ${formatTimestamp(item.timestamp)}`}
            >
              <div className="flex items-start justify-between gap-2">
                {/* 계산 식과 결과 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono truncate">
                      {item.expression} =
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-mono">
                      {item.result}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all focus:opacity-100 focus:outline-none"
                  aria-label={`${item.expression} 이력 삭제`}
                  title="이력 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
