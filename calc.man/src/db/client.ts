/**
 * 데이터베이스 클라이언트
 *
 * [SPEC-CALC-003] SQLite 데이터베이스 관리
 * - sql.js (SQLite WebAssembly) 사용
 * - IndexedDB에 데이터베이스 파일 영구 저장
 * - Prepared statements로 SQL Injection 방어
 */

import initSqlJs from 'sql.js'
import type { Calculation } from '../types/history'
import schemaSql from './schema.sql?raw'

// 타입 정의
type SqlJsDatabase = {
  run: (sql: string, params?: any[]) => void
  exec: (sql: string) => any[]
  prepare: (sql: string) => SqlJsStatement
  export: () => Uint8Array
  close: () => void
}

type SqlJsStatement = {
  bind: (params: any[]) => void
  step: () => boolean
  getAsObject: () => any
  free: () => void
}

/**
 * 데이터베이스 초기화 상태
 */
type DbStatus = 'idle' | 'loading' | 'ready' | 'error'

/**
 * IndexedDB 키 이름
 */
const DB_KEY = 'calculator-db'
const DB_STORE_NAME = 'calculator'

/**
 * 데이터베이스 클라이언트 클래스
 */
export class DatabaseClient {
  private db: SqlJsDatabase | null = null
  private status: DbStatus = 'idle'
  private initPromise: Promise<void> | null = null

  /**
   * 데이터베이스 초기화
   *
   * [SPEC-CALC-003] REQ-004: 앱 로드 시 데이터베이스 초기화
   * - IndexedDB에서 저장된 DB 로드 또는 새 DB 생성
   * - 스키마 실행
   */
  async init(): Promise<void> {
    // 테스트 환경에서는 초기화하지 않음
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
      this.status = 'ready'
      return Promise.resolve()
    }

    // 이미 초기화 중이거나 완료된 경우
    if (this.initPromise) {
      return this.initPromise
    }

    this.status = 'loading'
    this.initPromise = this._init()

    try {
      await this.initPromise
      this.status = 'ready'
    } catch (error) {
      this.status = 'error'
      this.initPromise = null
      throw error
    }

    return this.initPromise
  }

  /**
   * 내부 초기화 로직
   */
  private async _init(): Promise<void> {
    try {
      // sql.js 초기화
      const SQL = await initSqlJs({
        // WebAssembly 위치 지정 (Vite public 폴더)
        locateFile: (file) => `https://sql.js.org/dist/${file}`,
      })

      // IndexedDB에서 저장된 데이터베이스 로드 시도
      const savedDb = await this.loadFromIndexedDB()

      // 저장된 DB가 있으면 로드, 없으면 새 DB 생성
      this.db = savedDb ? (new SQL.Database(savedDb) as SqlJsDatabase) : (new SQL.Database() as SqlJsDatabase)

      if (!this.db) {
        throw new Error('Failed to create database')
      }

      // 스키마 실행 (CREATE TABLE IF NOT EXISTS이므로 안전함)
      this.db.exec(schemaSql)

      // 데이터베이스를 IndexedDB에 저장
      await this.saveToIndexedDB()
    } catch (error) {
      throw new Error(`Database initialization failed: ${error}`)
    }
  }

  /**
   * 계산 이력 저장
   *
   * [SPEC-CALC-003] REQ-001: 계산 완료 시 자동 저장
   * [SPEC-CALC-003] REQ-204: 에러 상태는 저장하지 않음
   */
  async saveCalculation(expression: string, result: string): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    const timestamp = Date.now()

    // Prepared statement로 SQL Injection 방어
    this.db.run(
      'INSERT INTO calculations (expression, result, timestamp) VALUES (?, ?, ?)',
      [expression, result, timestamp]
    )

    // 변경사항 저장
    await this.saveToIndexedDB()

    // 마지막 삽입 ID 반환
    const stmt = this.db.exec('SELECT last_insert_rowid() as id')
    return stmt[0]?.values[0]?.[0] as number ?? 0
  }

  /**
   * 최근 계산 이력 조회
   *
   * [SPEC-CALC-003] REQ-201: 최근 20개 항목 표시
   */
  async getRecentHistory(limit: number = 20): Promise<Calculation[]> {
    if (!this.db) {
      return []
    }

    const stmt = this.db.prepare(
      'SELECT id, expression, result, timestamp, created_at FROM calculations ORDER BY timestamp DESC LIMIT ?'
    )

    stmt.bind([limit])

    const items: Calculation[] = []

    while (stmt.step()) {
      const row = stmt.getAsObject() as unknown as Calculation
      items.push(row)
    }

    stmt.free()

    return items
  }

  /**
   * 특정 이력 항목 삭제
   */
  async deleteHistoryItem(id: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    this.db.run('DELETE FROM calculations WHERE id = ?', [id])
    await this.saveToIndexedDB()
  }

  /**
   * 모든 이력 삭제
   */
  async clearHistory(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    this.db.run('DELETE FROM calculations')
    await this.saveToIndexedDB()
  }

  /**
   * 데이터베이스를 바이너리로 내보내기
   */
  async export(): Promise<Uint8Array | null> {
    if (!this.db) {
      return null
    }

    const data = this.db.export()
    return data
  }

  /**
   * 데이터베이스 닫기
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.saveToIndexedDB()
      this.db.close()
      this.db = null
      this.status = 'idle'
      this.initPromise = null
    }
  }

  /**
   * 데이터베이스 상태 확인
   */
  getStatus(): DbStatus {
    return this.status
  }

  /**
   * IndexedDB에 데이터베이스 저장
   */
  private async saveToIndexedDB(): Promise<void> {
    if (!this.db) {
      return
    }

    try {
      const data = this.db.export()

      const request = indexedDB.open(DB_STORE_NAME, 1)

      return new Promise((resolve, reject) => {
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          if (!db.objectStoreNames.contains(DB_KEY)) {
            db.createObjectStore(DB_KEY)
          }
        }

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          const transaction = db.transaction([DB_KEY], 'readwrite')
          const store = transaction.objectStore(DB_KEY)
          store.put(data, DB_KEY)

          transaction.oncomplete = () => {
            db.close()
            resolve()
          }

          transaction.onerror = () => {
            reject(new Error('Failed to save to IndexedDB'))
          }
        }

        request.onerror = () => {
          reject(new Error('Failed to open IndexedDB'))
        }
      })
    } catch (error) {
      console.error('Failed to save database to IndexedDB:', error)
    }
  }

  /**
   * IndexedDB에서 데이터베이스 로드
   */
  private async loadFromIndexedDB(): Promise<Uint8Array | null> {
    try {
      const request = indexedDB.open(DB_STORE_NAME, 1)

      return new Promise((resolve, reject) => {
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          if (!db.objectStoreNames.contains(DB_KEY)) {
            db.createObjectStore(DB_KEY)
          }
        }

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          const transaction = db.transaction([DB_KEY], 'readonly')
          const store = transaction.objectStore(DB_KEY)
          const getRequest = store.get(DB_KEY)

          getRequest.onsuccess = () => {
            db.close()
            resolve(getRequest.result as Uint8Array | null)
          }

          getRequest.onerror = () => {
            reject(new Error('Failed to load from IndexedDB'))
          }
        }

        request.onerror = () => {
          reject(new Error('Failed to open IndexedDB'))
        }
      })
    } catch (error) {
      console.error('Failed to load database from IndexedDB:', error)
      return null
    }
  }
}

/**
 * 싱글톤 인스턴스
 */
let dbClientInstance: DatabaseClient | null = null

/**
 * 데이터베이스 클라이언트 싱글톤获取
 */
export function getDatabaseClient(): DatabaseClient {
  if (!dbClientInstance) {
    dbClientInstance = new DatabaseClient()
  }
  return dbClientInstance
}
