// app.js — 五行專案管理主程式

// ── 狀態 ──────────────────────────────────────────────
let app_currentProjectId = null;
let app_currentCharKey   = 'yan'; // 預設選炎嬌
let app_projects         = [];
let app_tasks            = [];
let app_chatHistory      = [];
let app_currentProject   = null;
let app_isLoading        = false;

// ── 人物顏色對應 ──────────────────────────────────────
const APP_CHAR_COLORS = {
  jin:  '#c9a84c',
  shui: '#4a90d9',
  mu:   '#2ecc71',
  yan:  '#cc3333',
  tu:   '#c8a96e'
};

// ── 人物 SVG 造型 ─────────────────────────────────────
function app_charSvg(key) {
  const svgs = {
    jin: `<svg class="char-svg" viewBox="0 0 56 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="2" width="20" height="20" rx="3" fill="#c9a84c" opacity="0.9"/>
      <polygon points="28,0 34,8 22,8" fill="#fff" opacity="0.5"/>
      <rect x="14" y="22" width="28" height="32" rx="4" fill="#8a6a2a"/>
      <rect x="16" y="24" width="24" height="2" fill="#c9a84c" opacity="0.6"/>
      <rect x="10" y="24" width="8" height="22" rx="3" fill="#8a6a2a"/>
      <rect x="38" y="24" width="8" height="22" rx="3" fill="#8a6a2a"/>
      <rect x="20" y="54" width="8" height="14" rx="3" fill="#6a4a1a"/>
      <rect x="28" y="54" width="8" height="14" rx="3" fill="#6a4a1a"/>
      <circle cx="23" cy="12" r="3" fill="#111" opacity="0.8"/>
      <circle cx="33" cy="12" r="3" fill="#111" opacity="0.8"/>
      <circle cx="24" cy="11" r="1" fill="#fff" opacity="0.6"/>
      <circle cx="34" cy="11" r="1" fill="#fff" opacity="0.6"/>
      <rect x="22" y="8" width="12" height="1" fill="#c9a84c" opacity="0.4"/>
    </svg>`,
    shui: `<svg class="char-svg" viewBox="0 0 56 70" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="28" cy="12" rx="14" ry="12" fill="#1a4a7a"/>
      <path d="M14 8 Q28 0 42 8" stroke="#4a90d9" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M10 18 Q4 30 6 45 Q8 55 28 58 Q48 55 50 45 Q52 30 46 18 Z" fill="#2a5a8a"/>
      <path d="M10 22 Q6 35 8 48" stroke="#4a90d9" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path d="M46 22 Q50 35 48 48" stroke="#4a90d9" stroke-width="1.5" fill="none" opacity="0.4"/>
      <rect x="20" y="56" width="7" height="14" rx="3" fill="#1a3a6a"/>
      <rect x="29" y="56" width="7" height="14" rx="3" fill="#1a3a6a"/>
      <circle cx="22" cy="11" r="3.5" fill="#0a2a5a"/>
      <circle cx="34" cy="11" r="3.5" fill="#0a2a5a"/>
      <circle cx="23" cy="10" r="1.2" fill="#4af" opacity="0.8"/>
      <circle cx="35" cy="10" r="1.2" fill="#4af" opacity="0.8"/>
      <ellipse cx="28" cy="18" rx="4" ry="1.5" fill="#4a90d9" opacity="0.3"/>
    </svg>`,
    mu: `<svg class="char-svg" viewBox="0 0 56 70" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="6" r="7" fill="#1a6a2a"/>
      <circle cx="38" cy="6" r="7" fill="#1a6a2a"/>
      <circle cx="18" cy="6" r="4" fill="#2ecc71" opacity="0.7"/>
      <circle cx="38" cy="6" r="4" fill="#2ecc71" opacity="0.7"/>
      <ellipse cx="28" cy="17" rx="13" ry="12" fill="#2a5a2a"/>
      <rect x="14" y="28" width="28" height="28" rx="6" fill="#1a4a1a"/>
      <path d="M14 28 Q8 32 6 44 Q8 50 14 50 Z" fill="#1a4a1a"/>
      <path d="M42 28 Q48 32 50 44 Q48 50 42 50 Z" fill="#1a4a1a"/>
      <rect x="19" y="56" width="7" height="14" rx="3" fill="#1a3a1a"/>
      <rect x="30" y="56" width="7" height="14" rx="3" fill="#1a3a1a"/>
      <circle cx="22" cy="16" r="3" fill="#0a1a0a"/>
      <circle cx="34" cy="16" r="3" fill="#0a1a0a"/>
      <circle cx="23" cy="15" r="1" fill="#2ecc71" opacity="0.9"/>
      <circle cx="35" cy="15" r="1" fill="#2ecc71" opacity="0.9"/>
      <path d="M23 21 Q28 24 33 21" stroke="#2ecc71" stroke-width="1.5" fill="none" opacity="0.6"/>
    </svg>`,
    yan: `<svg class="char-svg" viewBox="0 0 56 70" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4 Q28 0 36 4 Q40 0 44 4 Q46 8 44 12 Q48 10 46 16 Q40 14 36 18 Q32 10 28 14 Q24 10 20 18 Q16 14 10 16 Q8 10 12 4 Q16 0 20 4 Z" fill="#cc3333" opacity="0.9"/>
      <path d="M22 6 Q28 3 34 6" stroke="#ff6644" stroke-width="1.5" fill="none" opacity="0.6"/>
      <ellipse cx="28" cy="20" rx="13" ry="11" fill="#8a2222"/>
      <rect x="15" y="30" width="26" height="26" rx="5" fill="#6a1a1a"/>
      <path d="M15 32 Q9 36 8 46 Q9 52 15 52 Z" fill="#6a1a1a"/>
      <path d="M41 32 Q47 36 48 46 Q47 52 41 52 Z" fill="#6a1a1a"/>
      <rect x="19" y="56" width="8" height="14" rx="3" fill="#4a1a1a"/>
      <rect x="29" y="56" width="8" height="14" rx="3" fill="#4a1a1a"/>
      <circle cx="22" cy="19" r="3.5" fill="#2a0a0a"/>
      <circle cx="34" cy="19" r="3.5" fill="#2a0a0a"/>
      <circle cx="23" cy="18" r="1.2" fill="#ff4422" opacity="0.9"/>
      <circle cx="35" cy="18" r="1.2" fill="#ff4422" opacity="0.9"/>
      <path d="M24 24 Q28 28 32 24" stroke="#ff4422" stroke-width="1.5" fill="none" opacity="0.7"/>
    </svg>`,
    tu: `<svg class="char-svg" viewBox="0 0 56 70" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="28" cy="14" rx="18" ry="14" fill="#8a6a2a"/>
      <ellipse cx="28" cy="14" rx="14" ry="11" fill="#c8a96e" opacity="0.8"/>
      <ellipse cx="28" cy="36" rx="18" ry="22" fill="#7a5a1a"/>
      <ellipse cx="28" cy="30" rx="14" ry="14" fill="#8a6a2a" opacity="0.6"/>
      <ellipse cx="22" cy="58" rx="6" ry="8" fill="#6a4a1a"/>
      <ellipse cx="34" cy="58" rx="6" ry="8" fill="#6a4a1a"/>
      <circle cx="22" cy="13" r="3.5" fill="#3a2a0a"/>
      <circle cx="34" cy="13" r="3.5" fill="#3a2a0a"/>
      <circle cx="23" cy="12" r="1.2" fill="#c8a96e" opacity="0.7"/>
      <circle cx="35" cy="12" r="1.2" fill="#c8a96e" opacity="0.7"/>
      <path d="M23 19 Q28 22 33 19" stroke="#c8a96e" stroke-width="1.5" fill="none" opacity="0.6"/>
      <circle cx="28" cy="4" r="4" fill="#c8a96e" opacity="0.5"/>
    </svg>`
  };
  return svgs[key] || '';
}

// ── 頁面切換 ──────────────────────────────────────────
function app_showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

// ── 首頁：載入專案列表 ────────────────────────────────
async function app_loadHome() {
  app_showPage('page-home');
  try {
    app_projects = await sb_getProjects();
    app_renderProjectList();
  } catch (e) {
    console.error(e);
    app_toast('載入專案失敗：' + e.message, 'error');
  }
}

function app_renderProjectList() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  if (app_projects.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚔️</div>
        <p>尚無專案，點擊「新增專案」開始你的征途</p>
      </div>`;
    return;
  }

  grid.innerHTML = app_projects.map(p => {
    const pct = p['5m_progress'] || 0;
    const isFinished = p['5m_status'] === 'finished';
    return `
      <div class="project-card ${isFinished ? 'finished' : ''}" onclick="app_openProject('${p['5m_id']}')">
        <div class="project-card-name">${p['5m_name']}</div>
        <div class="project-card-desc">${p['5m_description'] || '（無描述）'}</div>
        <div class="project-card-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
          <span class="progress-text">${pct}%</span>
        </div>
        <div class="project-card-actions" onclick="event.stopPropagation()">
          <button class="btn btn-ghost btn-sm" onclick="app_openProject('${p['5m_id']}')">進入戰場</button>
          <button class="btn btn-ghost btn-sm" onclick="app_deleteProject('${p['5m_id']}')">刪除</button>
        </div>
      </div>`;
  }).join('');
}

// ── 新增專案 ──────────────────────────────────────────
function app_showNewProjectModal() {
  document.getElementById('modal-new-project').classList.add('open');
}

function app_closeNewProjectModal() {
  document.getElementById('modal-new-project').classList.remove('open');
  document.getElementById('new-project-name').value = '';
  document.getElementById('new-project-desc').value = '';
}

async function app_createProject() {
  const name = document.getElementById('new-project-name').value.trim();
  const desc = document.getElementById('new-project-desc').value.trim();
  if (!name) { app_toast('請輸入專案名稱'); return; }

  const btn = document.getElementById('btn-create-project');
  btn.textContent = '生成怪物中...';
  btn.disabled = true;

  try {
    // 生成怪物
    const monsterData = await char_generateMonster(name, desc);
    const project = await sb_createProject({
      name,
      description: desc,
      monster_css: JSON.stringify(monsterData),
      monster_name: monsterData.name
    });

    app_closeNewProjectModal();
    app_toast(`「${name}」專案建立！迎戰「${monsterData.name}」！`);
    await app_loadHome();
  } catch (e) {
    console.error(e);
    app_toast('建立失敗：' + e.message, 'error');
  } finally {
    btn.textContent = '建立';
    btn.disabled = false;
  }
}

async function app_deleteProject(id) {
  if (!confirm('確定刪除此專案？此操作無法復原。')) return;
  try {
    await sb_deleteProject(id);
    app_toast('專案已刪除');
    await app_loadHome();
  } catch (e) {
    app_toast('刪除失敗：' + e.message, 'error');
  }
}

// ── 進入專案（戰鬥畫面）────────────────────────────────
async function app_openProject(id) {
  app_currentProjectId = id;
  app_showPage('page-battle');

  try {
    app_currentProject = await sb_getProject(id);
    app_tasks = await sb_getTasks(id);
    app_chatHistory = await sb_getChatHistory(id);

    app_renderBattleHeader();
    app_renderMonster();
    app_renderChars();
    app_renderChatHistory();
    app_selectChar(app_currentCharKey);

    // 通知排程
    notif_startScheduler(
      () => ({ tasks: app_tasks, projectName: app_currentProject['5m_name'] }),
      () => app_currentProject
    );
  } catch (e) {
    console.error(e);
    app_toast('載入失敗：' + e.message, 'error');
    app_loadHome();
  }
}

function app_renderBattleHeader() {
  if (!app_currentProject) return;
  const progress = sb_calcProgress(app_tasks);

  document.getElementById('battle-project-name').textContent = app_currentProject['5m_name'];
  document.getElementById('battle-progress-fill').style.width = progress + '%';
  document.getElementById('battle-progress-pct').textContent = progress + '%';
}

function app_renderMonster() {
  if (!app_currentProject) return;
  const monsterContainer = document.getElementById('monster-container');
  let monsterData = null;
  try {
    monsterData = JSON.parse(app_currentProject['5m_monster_css'] || '{}');
  } catch (e) { monsterData = { name: '未知怪物', bodyColor: '#cc3333', eyeColor: '#fff', accentColor: '#ff6644', shape: 'blob' }; }

  const progress = sb_calcProgress(app_tasks);
  monster_render(monsterContainer, monsterData, progress);
}

function app_renderChars() {
  const grid = document.getElementById('chars-grid');
  const selector = document.getElementById('char-selector-list');
  if (!grid || !selector) return;

  const keys = Object.keys(char_LIST);

  grid.innerHTML = keys.map(key => {
    const c = char_LIST[key];
    return `
      <div class="char-slot" id="char-slot-${key}" style="--char-color:${c.color}">
        <div class="char-avatar">${app_charSvg(key)}</div>
        <div class="char-name">${c.name}</div>
      </div>`;
  }).join('');

  selector.innerHTML = keys.map(key => {
    const c = char_LIST[key];
    return `
      <button class="char-select-btn" id="char-btn-${key}"
        style="--active-color:${c.color}"
        onclick="app_selectChar('${key}')">
        <span class="char-emoji">${c.emoji}</span>
        ${c.name}
      </button>`;
  }).join('');
}

function app_selectChar(key) {
  app_currentCharKey = key;
  document.querySelectorAll('.char-select-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`char-btn-${key}`);
  if (btn) btn.classList.add('active');
}

// ── 聊天 ─────────────────────────────────────────────
async function app_sendChat() {
  if (app_isLoading) return;
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;

  input.value = '';
  app_isLoading = true;

  // 顯示使用者訊息
  app_addBubble({ role: 'user', content: msg, character: null });

  // 儲存使用者訊息
  await sb_saveChatMessage({ project_id: app_currentProjectId, character: null, role: 'user', content: msg });

  // 顯示 loading
  const loadingId = 'loading-' + Date.now();
  app_addBubble({ role: 'loading', content: `${char_LIST[app_currentCharKey].name} 思考中...`, id: loadingId });

  // 人物攻擊動畫
  const slot = document.getElementById(`char-slot-${app_currentCharKey}`);
  if (slot) {
    slot.classList.add('speaking', 'attacking');
    setTimeout(() => slot.classList.remove('attacking'), 800);
  }

  try {
    const history = app_chatHistory.filter(h => h['5m_character'] === app_currentCharKey || h['5m_role'] === 'user');
    const reply = await char_chat(app_currentCharKey, msg, app_currentProject, app_tasks, history.slice(-20));

    // 移除 loading
    document.getElementById(loadingId)?.remove();

    // 顯示回應
    app_addBubble({ role: 'char', content: reply, character: app_currentCharKey });

    // 儲存回應
    const saved = await sb_saveChatMessage({ project_id: app_currentProjectId, character: app_currentCharKey, role: 'assistant', content: reply });
    app_chatHistory.push(saved);

    setTimeout(() => slot?.classList.remove('speaking'), 1500);
  } catch (e) {
    document.getElementById(loadingId)?.remove();
    app_addBubble({ role: 'char', content: `⚠️ 呼叫失敗：${e.message}`, character: app_currentCharKey });
  }

  app_isLoading = false;
}

// 現況更新：五人同時發言
async function app_allUpdate() {
  if (app_isLoading) return;
  app_isLoading = true;

  app_addBubble({ role: 'user', content: '【現況更新】請各位提供建議！', character: null });

  // 所有人物攻擊動畫
  Object.keys(char_LIST).forEach((key, i) => {
    const slot = document.getElementById(`char-slot-${key}`);
    if (slot) {
      setTimeout(() => {
        slot.classList.add('speaking', 'attacking');
        setTimeout(() => slot.classList.remove('attacking'), 800);
      }, i * 150);
    }
  });

  const loadingId = 'loading-all-' + Date.now();
  app_addBubble({ role: 'loading', content: '五行齊聚，運算中...', id: loadingId });

  try {
    const results = await char_allSpeak(app_currentProject, app_tasks);
    document.getElementById(loadingId)?.remove();

    for (const { key, text } of results) {
      app_addBubble({ role: 'char', content: text, character: key });
      await sb_saveChatMessage({ project_id: app_currentProjectId, character: key, role: 'assistant', content: text });
      await new Promise(r => setTimeout(r, 200));
    }

    Object.keys(char_LIST).forEach(key => {
      document.getElementById(`char-slot-${key}`)?.classList.remove('speaking');
    });
  } catch (e) {
    document.getElementById(loadingId)?.remove();
    app_addBubble({ role: 'char', content: '⚠️ 現況更新失敗：' + e.message, character: null });
  }

  app_isLoading = false;
}

function app_renderChatHistory() {
  const display = document.getElementById('chat-display');
  if (!display) return;
  display.innerHTML = '';
  app_chatHistory.forEach(h => {
    app_addBubble({
      role: h['5m_role'] === 'user' ? 'user' : 'char',
      content: h['5m_content'],
      character: h['5m_character']
    }, false);
  });
  display.scrollTop = display.scrollHeight;
}

function app_addBubble({ role, content, character, id }, scroll = true) {
  const display = document.getElementById('chat-display');
  if (!display) return;

  const div = document.createElement('div');
  if (id) div.id = id;
  div.className = `chat-bubble ${role} fade-in`;

  if (role === 'char' && character) {
    const c = char_LIST[character];
    div.style.setProperty('--bubble-color', c.color);
    div.style.setProperty('--bubble-bg', c.color + '1a');
    div.innerHTML = `<div class="chat-bubble-sender">${c.emoji} ${c.name}</div>${content}`;
  } else {
    div.textContent = content;
  }

  div.onclick = () => app_showModal(role, content, character);
  display.appendChild(div);
  if (scroll) display.scrollTop = display.scrollHeight;
}

// ── 對話詳細 Modal ────────────────────────────────────
function app_showModal(role, content, character) {
  const overlay = document.getElementById('modal-chat');
  const sender  = document.getElementById('modal-chat-sender');
  const text    = document.getElementById('modal-chat-content');

  if (character && char_LIST[character]) {
    const c = char_LIST[character];
    sender.textContent = `${c.emoji} ${c.name}`;
    sender.style.color = c.color;
  } else {
    sender.textContent = '你';
    sender.style.color = '#888';
  }
  text.textContent = content;
  overlay.classList.add('open');
}
function app_closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ── 任務面板 ─────────────────────────────────────────
function app_toggleTaskPanel() {
  document.getElementById('task-panel').classList.toggle('open');
}

function app_renderTaskPanel() {
  const list = document.getElementById('task-list');
  if (!list) return;

  if (app_tasks.length === 0) {
    list.innerHTML = '<p style="color:var(--gray);font-size:0.82rem;padding:10px 0;">尚無任務</p>';
    return;
  }

  const now = new Date();
  list.innerHTML = app_tasks.map(t => {
    const isDone = t['5m_status'] === 'done';
    const due = t['5m_due_date'] ? new Date(t['5m_due_date']) : null;
    const isOverdue = due && due < now && !isDone;
    const dueStr = due ? due.toLocaleDateString('zh-TW') : '';

    return `
      <div class="task-item">
        <div class="task-checkbox ${isDone ? 'checked' : ''}"
          onclick="app_toggleTask('${t['5m_id']}')"></div>
        <div class="task-info">
          <div class="task-title ${isDone ? 'done' : ''}">${t['5m_title']}</div>
          ${dueStr ? `<div class="task-due ${isOverdue ? 'overdue' : ''}">${isOverdue ? '⚠ ' : ''}${dueStr}</div>` : ''}
        </div>
        <select class="task-status-select" onchange="app_updateTaskStatus('${t['5m_id']}', this.value)">
          <option value="todo" ${t['5m_status']==='todo' ? 'selected' : ''}>待辦</option>
          <option value="doing" ${t['5m_status']==='doing' ? 'selected' : ''}>進行中</option>
          <option value="done" ${t['5m_status']==='done' ? 'selected' : ''}>完成</option>
        </select>
        <button class="task-del-btn" onclick="app_deleteTask('${t['5m_id']}')">✕</button>
      </div>`;
  }).join('');
}

async function app_addTask() {
  const titleInput = document.getElementById('new-task-title');
  const dueInput   = document.getElementById('new-task-due');
  const title = titleInput.value.trim();
  if (!title) return;

  try {
    const task = await sb_createTask({ project_id: app_currentProjectId, title, due_date: dueInput.value || null });
    app_tasks.push(task);
    titleInput.value = '';
    dueInput.value = '';
    app_renderTaskPanel();
    app_updateProgress();
    notif_checkDueDates([task], app_currentProject['5m_name']);
  } catch (e) {
    app_toast('新增失敗：' + e.message, 'error');
  }
}

async function app_toggleTask(id) {
  const task = app_tasks.find(t => t['5m_id'] === id);
  if (!task) return;
  const newStatus = task['5m_status'] === 'done' ? 'todo' : 'done';
  await app_updateTaskStatus(id, newStatus);
}

async function app_updateTaskStatus(id, status) {
  try {
    const updated = await sb_updateTask(id, { status });
    const idx = app_tasks.findIndex(t => t['5m_id'] === id);
    if (idx >= 0) app_tasks[idx] = updated;
    app_renderTaskPanel();
    app_updateProgress();
  } catch (e) {
    app_toast('更新失敗：' + e.message, 'error');
  }
}

async function app_deleteTask(id) {
  try {
    await sb_deleteTask(id);
    app_tasks = app_tasks.filter(t => t['5m_id'] !== id);
    app_renderTaskPanel();
    app_updateProgress();
  } catch (e) {
    app_toast('刪除失敗：' + e.message, 'error');
  }
}

function app_updateProgress() {
  const progress = sb_calcProgress(app_tasks);

  // 更新頭部
  document.getElementById('battle-progress-fill').style.width = progress + '%';
  document.getElementById('battle-progress-pct').textContent = progress + '%';

  // 怪物受傷動畫
  const monsterContainer = document.getElementById('monster-container');
  let monsterData = null;
  try { monsterData = JSON.parse(app_currentProject['5m_monster_css']); } catch (e) {}
  if (monsterContainer && monsterData) {
    monster_takeDamage(monsterContainer, monsterData, progress);
  }

  // 儲存進度到 DB
  sb_updateProject(app_currentProjectId, { progress }).catch(console.error);

  // 如果 100% 完成
  if (progress === 100) {
    setTimeout(() => app_toast('🎉 專案完成！怪物已被消滅！'), 800);
    sb_updateProject(app_currentProjectId, { status: 'finished' }).catch(console.error);
  }
}

// ── 通知授權 ─────────────────────────────────────────
async function app_requestNotif() {
  const granted = await notif_requestPermission();
  app_toast(granted ? '✅ 通知已開啟' : '❌ 通知未授權');
}

// ── Toast ─────────────────────────────────────────────
function app_toast(msg, type = 'info') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:${type === 'error' ? '#cc3333' : '#1a1a1a'};
    border:1px solid ${type === 'error' ? '#cc3333' : '#444'};
    color:#f0ede6; padding:10px 20px; border-radius:8px;
    font-size:0.85rem; z-index:999; font-family:var(--font-body);
    box-shadow:0 4px 20px rgba(0,0,0,0.5);
    animation:fade-in 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Enter 送出 ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('chat-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); app_sendChat(); }
  });
  document.getElementById('new-task-title')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') app_addTask();
  });

  // 任務面板開啟時渲染
  const observer = new MutationObserver(() => {
    if (document.getElementById('task-panel')?.classList.contains('open')) {
      app_renderTaskPanel();
    }
  });
  const panel = document.getElementById('task-panel');
  if (panel) observer.observe(panel, { attributes: true, attributeFilter: ['class'] });

  // 啟動首頁
  char_loadAll().then(() => app_loadHome());
});
