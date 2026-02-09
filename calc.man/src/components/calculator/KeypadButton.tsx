import { Button } from '@/components/ui/button'

/**
 * KeypadButton 컴포넌트 속성
 */
interface KeypadButtonProps {
  value: string
  onClick: (value: string) => void
  variant?: 'default' | 'operator' | 'special'
  span?: number
  disabled?: boolean
}

/**
 * 버튼 값에 대한 접근 가능한 레이블 생성
 *
 * REQ-UI-002: 모든 버튼에 접근 가능한 레이블 제공
 */
function getAriaLabel(value: string): string {
  switch (value) {
    case 'AC':
      return 'All Clear'
    case 'C':
      return 'Clear'
    case '=':
      return 'Equals'
    case '/':
      return 'Divide'
    case '*':
      return 'Multiply'
    case '-':
      return 'Subtract'
    case '+':
      return 'Add'
    case '.':
      return 'Decimal Point'
    default:
      return value
  }
}

/**
 * 버튼 변형에 따른 Tailwind CSS 클래스
 */
function getVariantClasses(variant: 'default' | 'operator' | 'special'): string {
  switch (variant) {
    case 'default':
      return 'bg-gray-100 hover:bg-gray-200 text-gray-900'
    case 'operator':
      return 'bg-orange-500 hover:bg-orange-600 text-white'
    case 'special':
      return 'bg-blue-500 hover:bg-blue-600 text-white'
    default:
      return 'bg-gray-100 hover:bg-gray-200 text-gray-900'
  }
}

/**
 * KeypadButton 컴포넌트
 *
 * [SPEC-CALC-002] 개별 버튼 렌더링 및 인터랙션
 * - shadcn/ui Button 컴포넌트 사용
 * - 접근성 레이블 (aria-label)
 * - 호버, 액티브 상태 스타일
 *
 * REQ-UI-002: 모든 버튼에 접근 가능한 레이블 제공 (WCAG AA 준수)
 * REQ-UI-007: 버튼 클릭 시 시각적 피드백 제공
 * REQ-UI-010: 반응형 버튼 크기 (모바일 60px, 데스크톱 80px)
 * REQ-UI-011: 비활성화된 버튼은 클릭 이벤트 처리하지 않음
 */
export default function KeypadButton({
  value,
  onClick,
  variant = 'default',
  span = 1,
  disabled = false,
}: KeypadButtonProps) {
  const ariaLabel = getAriaLabel(value)
  const variantClasses = getVariantClasses(variant)
  const spanClass = span > 1 ? `col-span-${span}` : ''

  const handleClick = () => {
    if (!disabled) {
      onClick(value)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${variantClasses} ${spanClass} h-15 md:h-20 text-xl md:text-2xl font-semibold rounded-lg transition-all active:scale-95`}
      variant="default"
    >
      {value}
    </Button>
  )
}
