import Layout from './components/layout/Layout'
import Calculator from './components/calculator/Calculator'

/**
 * 계산기 애플리케이션 메인 컴포넌트
 *
 * [SPEC-CALC-002] 메인 애플리케이션
 * - Layout 컴포넌트로 반응형 컨테이너 제공
 * - Calculator 컴포넌트로 전체 계산기 UI 렌더링
 */
function App() {
  return (
    <Layout>
      <Calculator />
    </Layout>
  )
}

export default App
