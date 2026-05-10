// characters.js — 人物設定載入 & Claude API 互動

const CLAUDE_API = 'https://hhcubvixldieuwdeqnwc.supabase.co/functions/v1/proxy-claude';
const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';
const CLAUDE_HEADERS = () => ({ 'Content-Type': 'application/json' });

// 人物清單定義
const char_LIST = {
  jin:  { key: 'jin',  name: '金喬',   emoji: '⚡', element: '金', color: '#c9a84c', file: './characters/jin.md' },
  shui: { key: 'shui', name: '水玉瑤', emoji: '💧', element: '水', color: '#4a90d9', file: './characters/shui.md' },
  mu:   { key: 'mu',   name: '木靈珊', emoji: '🌳', element: '木', color: '#2ecc71', file: './characters/mu.md' },
  yan:  { key: 'yan',  name: '炎嬌兒',  emoji: '🔥', element: '火', color: '#cc3333', file: './characters/yan.md' },
  tu:   { key: 'tu',   name: '土財咪', emoji: '🪨', element: '土', color: '#c8a96e', file: './characters/tu.md' }
};

// 快取人物 .md 內容
const char_mdCache = {};

async function char_loadMd(key) {
  if (char_mdCache[key]) return char_mdCache[key];
  const resp = await fetch(char_LIST[key].file);
  if (!resp.ok) throw new Error(`無法載入 ${key}.md`);
  const text = await resp.text();
  char_mdCache[key] = text;
  return text;
}

async function char_loadAll() {
  const keys = Object.keys(char_LIST);
  await Promise.all(keys.map(k => char_loadMd(k)));
  return char_mdCache;
}

// 組裝 system prompt
async function char_buildSystemPrompt(key, projectData, tasks) {
  const md = await char_loadMd(key);
  const progress = sb_calcProgress(tasks);
  const taskSummary = tasks.map(t => {
    const status = { todo: '待辦', doing: '進行中', done: '完成' }[t['5m_status']] || t['5m_status'];
    const due = t['5m_due_date'] ? `（截止：${t['5m_due_date']}）` : '';
    return `- [${status}] ${t['5m_title']}${due}`;
  }).join('\n');

  return `你是五行超能力玩偶「${char_LIST[key].name}」，以下是你的完整設定：

${md}

---

目前正在協助的專案：
專案名稱：${projectData['5m_name']}
專案描述：${projectData['5m_description'] || '（無描述）'}
整體進度：${progress}%

任務清單：
${taskSummary || '（尚無任務）'}

---

請完全依照你的個性與口吻回應。用繁體中文。回應不要太長，保持角色的風格。`;
}

// 單一人物對話
async function char_chat(key, userMessage, projectData, tasks, history = []) {
  const systemPrompt = await char_buildSystemPrompt(key, projectData, tasks);

  const messages = [
    ...history.map(h => ({ role: h['5m_role'], content: h['5m_content'] })),
    { role: 'user', content: userMessage }
  ];

  const resp = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: CLAUDE_HEADERS(),
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages
    })
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error?.message || '呼叫失敗');
  }

  const data = await resp.json();
  return data.content[0].text;
}

// 現況更新：五人同時發言
async function char_allSpeak(projectData, tasks) {
  const keys = Object.keys(char_LIST);
  const progress = sb_calcProgress(tasks);
  const taskSummary = tasks.map(t => {
    const status = { todo: '待辦', doing: '進行中', done: '完成' }[t['5m_status']] || t['5m_status'];
    const due = t['5m_due_date'] ? `（截止：${t['5m_due_date']}）` : '';
    return `- [${status}] ${t['5m_title']}${due}`;
  }).join('\n');

  const results = await Promise.all(keys.map(async (key) => {
    const md = await char_loadMd(key);
    const system = `你是五行超能力玩偶「${char_LIST[key].name}」，以下是你的設定：\n${md}\n\n請依照你的個性，針對以下專案現況提出你的建議或疑問。用繁體中文。保持角色風格，不要太長。`;
    const userMsg = `專案「${projectData['5m_name']}」目前進度 ${progress}%。\n\n任務：\n${taskSummary || '（尚無任務）'}\n\n請給出你的看法。`;

    const resp = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: CLAUDE_HEADERS(),
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: userMsg }]
      })
    });
    const data = await resp.json();
    return { key, text: data.content[0].text };
  }));

  return results;
}

// 生成怪物 CSS 設定
async function char_generateMonster(projectName, projectDesc) {
  const prompt = `你是一個CSS藝術生成器。
根據以下專案，生成一個獨特的2D怪物CSS樣式設定（JSON格式）。
專案名稱：${projectName}
專案描述：${projectDesc || '無'}

請回傳純 JSON，格式如下，不要加任何說明文字或markdown符號：
{
  "name": "怪物名稱（配合專案主題）",
  "bodyColor": "#十六進制顏色",
  "eyeColor": "#十六進制顏色",
  "accentColor": "#十六進制顏色",
  "shape": "round|angular|blob|spike",
  "personality": "一句話描述怪物的氣質"
}`;

  const resp = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: CLAUDE_HEADERS(),
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await resp.json();
  if (!resp.ok || !data.content) throw new Error(data.error?.message || JSON.stringify(data));
  const raw = data.content[0].text.replace(/```json|```/g, '').trim();
  return JSON.parse(raw);
}
