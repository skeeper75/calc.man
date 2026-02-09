import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Vite 설정
// @see https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    exclude: ['**/e2e/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/e2e/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/dist',
        'src/main.tsx',
        'src/App.tsx',
        'src/db/', // 브라우저 전용 데이터베이스 코드
        'src/types/', // 타입 정의
        'src/lib/constants.ts', // 상수 정의
      ],
    },
  },
})
