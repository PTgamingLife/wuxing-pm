-- ══════════════════════════════════════════════════════
-- 五行陣 Supabase 資料庫建表語法
-- 前綴：5m_
-- ══════════════════════════════════════════════════════

-- 1. 專案表
CREATE TABLE IF NOT EXISTS "5m_projects" (
  "5m_id"           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "5m_name"         TEXT NOT NULL,
  "5m_description"  TEXT,
  "5m_monster_css"  TEXT,
  "5m_monster_name" TEXT,
  "5m_status"       TEXT DEFAULT 'active' CHECK ("5m_status" IN ('active', 'finished')),
  "5m_progress"     INTEGER DEFAULT 0,
  "5m_created_at"   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 任務表
CREATE TABLE IF NOT EXISTS "5m_tasks" (
  "5m_id"          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "5m_project_id"  UUID NOT NULL REFERENCES "5m_projects"("5m_id") ON DELETE CASCADE,
  "5m_title"       TEXT NOT NULL,
  "5m_status"      TEXT DEFAULT 'todo' CHECK ("5m_status" IN ('todo', 'doing', 'done')),
  "5m_due_date"    DATE,
  "5m_created_at"  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 對話歷史表
CREATE TABLE IF NOT EXISTS "5m_chat_history" (
  "5m_id"          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "5m_project_id"  UUID NOT NULL REFERENCES "5m_projects"("5m_id") ON DELETE CASCADE,
  "5m_character"   TEXT,  -- jin / shui / mu / yan / tu / null(user)
  "5m_role"        TEXT NOT NULL CHECK ("5m_role" IN ('user', 'assistant')),
  "5m_content"     TEXT NOT NULL,
  "5m_created_at"  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security（單人使用可關閉）──
ALTER TABLE "5m_projects"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "5m_tasks"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "5m_chat_history" ENABLE ROW LEVEL SECURITY;

-- 允許匿名讀寫（單人本地使用）
CREATE POLICY "allow_all_projects"     ON "5m_projects"     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_tasks"        ON "5m_tasks"        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_chat_history" ON "5m_chat_history" FOR ALL USING (true) WITH CHECK (true);

-- ── 索引優化 ──
CREATE INDEX IF NOT EXISTS idx_5m_tasks_project       ON "5m_tasks"("5m_project_id");
CREATE INDEX IF NOT EXISTS idx_5m_chat_project        ON "5m_chat_history"("5m_project_id");
CREATE INDEX IF NOT EXISTS idx_5m_chat_created        ON "5m_chat_history"("5m_created_at");
