import KeypadButton from './KeypadButton'

/**
 * Keypad 컴포넌트 속성
 */
interface KeypadProps {
  onButtonClick: (value: string) => void
}

/**
 * 버튼 레이아웃 정의
 *
 * [SPEC-CALC-002] 4x5 그리드 레이아웃
 * - AC, C, /, *
 * - 7, 8, 9, -
 * - 4, 5, 6, +
 * - 1, 2, 3, =
 * - 0 (span 2), .
 */
const BUTTON_LAYOUT = [
  ['AC', 'C', '/', '*'],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '='],
  ['0', '.'],
]

/**
 * 버튼 변형 결정
 */
function getButtonVariant(value: string): 'default' | 'operator' | 'special' {
  if (['AC', 'C', '='].includes(value)) return 'special'
  if (['+', '-', '*', '/'].includes(value)) return 'operator'
  return 'default'
}

/**
 * 0 버튼의 그리드 스팬 결정
 */
function getButtonSpan(value: string): number {
  return value === '0' ? 2 : 1
}

/**
 * Keypad 컴포넌트
 *
 * [SPEC-CALC-002] 계산기 버튼 그리드 레이아웃
 * - 4x5 그리드 레이아웃 (숫자 0-9, 연산자, AC, C, =)
 * - KeypadButton 컴포넌트 조합
 * - 반응형 버튼 크기 조정
 *
 * REQ-UI-010: 반응형 레이아웃 (모바일 < 768px, 데스크톱 >= 768px)
 */
export default function Keypad({ onButtonClick }: KeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {BUTTON_LAYOUT.map((row, rowIndex) =>
        row.map((value) => (
          <KeypadButton
            key={`${rowIndex}-${value}`}
            value={value}
            onClick={onButtonClick}
            variant={getButtonVariant(value)}
            span={getButtonSpan(value)}
          />
        ))
      )}
    </div>
  )
}
