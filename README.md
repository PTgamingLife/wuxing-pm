# 五行陣 — 專案管理系統

水墨江湖風格的五行元素專案管理 APP。五位超能力顧問協助你追蹤並完成專案目標。

---

## 快速部署

### 步驟一：Supabase 設定

1. 前往 [supabase.com](https://supabase.com)，進入你的專案
2. 左側選「SQL Editor」
3. 貼上 `supabase_setup.sql` 的內容，執行
4. 左側選「Settings > API」，複製：
   - **Project URL**（已預設填入）
   - **anon public key**

### 步驟二：填入 API 金鑰

開啟 `supabase.js`，找到第 3 行：

```js
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

替換為你的 anon key。

### 步驟三：上傳 GitHub Pages

```bash
git init
git add .
git commit -m "init: 五行陣專案管理"
git remote add origin https://github.com/ptgaminglife/wuxing-pm.git
git push -u origin main
```

GitHub repo → Settings → Pages → Branch: main → 儲存

---

## 檔案結構

```
├── index.html          # 主頁面
├── style.css           # 水墨江湖樣式
├── app.js              # 主程式邏輯
├── supabase.js         # 資料庫操作（前綴 5m_）
├── characters.js       # 人物載入 & Claude API
├── monster.js          # 怪物 CSS 渲染
├── notification.js     # 瀏覽器推播
├── supabase_setup.sql  # 資料庫建表語法
└── characters/
    ├── jin.md          # 金大官 ⚡
    ├── shui.md         # 水娘娘 💧
    ├── mu.md           # 木靈兒 🌳
    ├── yan.md          # 炎嬌 🔥
    └── tu.md           # 土財咪 🪨
```

---

## 人物設定更新

只需編輯 `characters/` 內的 `.md` 檔案，下次載入頁面自動生效。

---

## 功能說明

| 功能 | 說明 |
|------|------|
| 多專案管理 | 首頁建立、切換、刪除專案 |
| 戰鬥畫面 | 左側怪物（進度越高血量越低），右側五位顧問 |
| 任務清單 | 右上「任務」按鈕開啟抽屜，可新增/更新/刪除任務 |
| 人物對話 | 左下選擇發言者，輸入問題，人物依個性回應 |
| 現況更新 | 點擊「現況更新」，五位顧問同時提出建議 |
| 對話記憶 | 所有對話儲存在 Supabase，下次開啟自動載入 |
| 截止通知 | 允許通知後，每小時檢查是否有即將到期的任務 |

---

## 注意事項

- Claude API 在前端直接呼叫（無後端），適合個人使用
- 瀏覽器通知需手動允許，且只在頁面開啟時有效
- 人物 .md 檔案透過 fetch 載入，需在 HTTP 伺服器環境下運行（GitHub Pages OK）
