// supabase.js — 五行專案管理 Supabase 連線層
// SUPABASE_URL 與 SUPABASE_ANON_KEY 由 config.js 注入（不進 git）

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── PROJECTS ───────────────────────────────────────────

async function sb_getProjects() {
  const { data, error } = await sb
    .from('5m_projects')
    .select('*')
    .order('5m_created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function sb_getProject(id) {
  const { data, error } = await sb
    .from('5m_projects')
    .select('*')
    .eq('5m_id', id)
    .single();
  if (error) throw error;
  return data;
}

async function sb_createProject({ name, description, monster_css, monster_name }) {
  const { data, error } = await sb
    .from('5m_projects')
    .insert({
      '5m_name': name,
      '5m_description': description,
      '5m_monster_css': monster_css,
      '5m_monster_name': monster_name,
      '5m_status': 'active'
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function sb_updateProject(id, updates) {
  const mapped = {};
  for (const [k, v] of Object.entries(updates)) {
    mapped[`5m_${k}`] = v;
  }
  const { data, error } = await sb
    .from('5m_projects')
    .update(mapped)
    .eq('5m_id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function sb_deleteProject(id) {
  const { error } = await sb
    .from('5m_projects')
    .delete()
    .eq('5m_id', id);
  if (error) throw error;
}

// ─── TASKS ───────────────────────────────────────────────

async function sb_getTasks(projectId) {
  const { data, error } = await sb
    .from('5m_tasks')
    .select('*')
    .eq('5m_project_id', projectId)
    .order('5m_created_at', { ascending: true });
  if (error) throw error;
  return data;
}

async function sb_createTask({ project_id, title, due_date }) {
  const { data, error } = await sb
    .from('5m_tasks')
    .insert({
      '5m_project_id': project_id,
      '5m_title': title,
      '5m_status': 'todo',
      '5m_due_date': due_date || null
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function sb_updateTask(id, updates) {
  const mapped = {};
  for (const [k, v] of Object.entries(updates)) {
    mapped[`5m_${k}`] = v;
  }
  const { data, error } = await sb
    .from('5m_tasks')
    .update(mapped)
    .eq('5m_id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function sb_deleteTask(id) {
  const { error } = await sb
    .from('5m_tasks')
    .delete()
    .eq('5m_id', id);
  if (error) throw error;
}

// ─── CHAT HISTORY ────────────────────────────────────────

async function sb_getChatHistory(projectId, limit = 30) {
  const { data, error } = await sb
    .from('5m_chat_history')
    .select('*')
    .eq('5m_project_id', projectId)
    .order('5m_created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data;
}

async function sb_saveChatMessage({ project_id, character, role, content }) {
  const { data, error } = await sb
    .from('5m_chat_history')
    .insert({
      '5m_project_id': project_id,
      '5m_character': character,
      '5m_role': role,
      '5m_content': content
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function sb_clearChatHistory(projectId) {
  const { error } = await sb
    .from('5m_chat_history')
    .delete()
    .eq('5m_project_id', projectId);
  if (error) throw error;
}

// ─── PROGRESS CALC ───────────────────────────────────────

function sb_calcProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const done = tasks.filter(t => t['5m_status'] === 'done').length;
  return Math.round((done / tasks.length) * 100);
}
