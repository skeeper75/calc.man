
/**
 * Display 컴포넌트 속성
 */
interface DisplayProps {
  value: string
  error?: boolean
  copied?: boolean
}

/**
 * 값의 길이에 따른 글꼴 크기 계산
 *
 * REQ-UI-008: 값 길이에 따른 글꼴 크기 조정
 * - 15자 이하: text-4xl (36px)
 * - 16-20자: text-3xl (30px)
 * - 21자 이상: text-2xl (24px)
 */
function getFontSizeClass(value: string): string {
  const length = value.length
  if (length <= 15) return 'text-4xl'
  if (length <= 20) return 'text-3xl'
  return 'text-2xl'
}

/**
 * Display 컴포넌트
 *
 * [SPEC-CALC-002] 계산기 디스플레이 영역 렌더링
 * - 값의 길이에 따른 글꼴 크기 동적 조정
 * - 오류 상태 시 "Error" 메시지 표시
 * - 텍스트 오버플로우 처리
 *
 * REQ-UI-001: 항상 현재 입력값 표시
 * REQ-UI-003: 결과값이 너비를 초과할 때 글꼴 크기 자동 조정
 * REQ-UI-008: 15자 초과 시 글꼴 크기 점진적 축소
 * REQ-UI-009: 오류 상태 시 "Error" 메시지 표시
 * REQ-UI-010: 반응형 높이 (모바일 80px, 데스크톱 96px)
 */
export default function Display({ value, error = false, copied = false }: DisplayProps) {
  const fontSizeClass = getFontSizeClass(value)
  const displayValue = error ? 'Error' : value

  return (
    <div className="relative bg-gray-800 text-white p-4 rounded-lg mb-4 h-20 md:h-24 flex items-center justify-center">
      {error ? (
        <span
          className={`${fontSizeClass} font-mono text-right w-full break-all text-red-400`}
          role="alert"
          aria-live="polite"
        >
          {displayValue}
        </span>
      ) : (
        <span
          className={`${fontSizeClass} font-mono text-right w-full break-all`}
          aria-live="polite"
        >
          {displayValue}
        </span>
      )}

      {/* [SPEC-CALC-003] 복사 피드백 표시 */}
      {copied && (
        <div
          className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded animate-pulse"
          role="status"
          aria-live="polite"
        >
          복사됨!
        </div>
      )}
    </div>
  )
}
