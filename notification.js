// notification.js — 瀏覽器推播通知

async function notif_requestPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function notif_send(title, body, icon = '⚡') {
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: './favicon.ico',
    badge: './favicon.ico'
  });
}

// 檢查任務截止日並推播
function notif_checkDueDates(tasks, projectName) {
  if (Notification.permission !== 'granted') return;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  tasks.forEach(task => {
    if (!task['5m_due_date'] || task['5m_status'] === 'done') return;

    const due = new Date(task['5m_due_date']);
    const diffMs = due - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      notif_send(
        `⚠️ 任務已逾期`,
        `【${projectName}】${task['5m_title']} 已逾期 ${Math.abs(diffDays)} 天`
      );
    } else if (diffDays === 0) {
      notif_send(
        `🔥 今天截止！`,
        `【${projectName}】${task['5m_title']} 今天截止，趕快行動！`
      );
    } else if (diffDays === 1) {
      notif_send(
        `⏰ 明天截止`,
        `【${projectName}】${task['5m_title']} 明天就到期了`
      );
    }
  });
}

// 定期檢查（每小時）
function notif_startScheduler(getTasksFn, getProjectFn) {
  notif_checkOnce(getTasksFn, getProjectFn);
  setInterval(() => notif_checkOnce(getTasksFn, getProjectFn), 60 * 60 * 1000);
}

async function notif_checkOnce(getTasksFn, getProjectFn) {
  try {
    const { tasks, projectName } = await getTasksFn();
    notif_checkDueDates(tasks, projectName);
  } catch (e) {
    console.warn('通知檢查失敗', e);
  }
}
