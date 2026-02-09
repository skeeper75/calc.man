-- [SPEC-CALC-003] 데이터베이스 스키마
-- 계산 이력을 저장하는 SQLite 테이블

CREATE TABLE IF NOT EXISTS calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expression TEXT NOT NULL,
  result TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_timestamp ON calculations(timestamp DESC);
