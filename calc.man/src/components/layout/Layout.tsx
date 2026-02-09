import React from 'react'

/**
 * Layout 컴포넌트 속성
 */
interface LayoutProps {
  children: React.ReactNode
}

/**
 * Layout 컴포넌트
 *
 * [SPEC-CALC-002] 반응형 컨테이너 및 중앙 정렬
 * - 화면 중앙 정렬
 * - 최대 너비 제한 (max-w-md)
 * - 모바일/데스크톱 반응형 패딩
 *
 * REQ-UI-010: 반응형 레이아웃 (모바일 < 768px, 데스크톱 >= 768px)
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-4 md:p-6">{children}</div>
    </div>
  )
}
