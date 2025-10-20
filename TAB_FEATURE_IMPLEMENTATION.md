# Tab 功能實作清單

## 概述

新增三個 Tab 模式（49/39/38），每個 Tab 有獨立的資料儲存和顯示。

---

## Phase 1: 基礎架構

### 1.1 類型定義 (`src/lib/types.ts`)

- [ ] 新增 `BoxMode` 類型：`'49' | '39' | '38'`
- [ ] 新增 `ModeConfig` 介面
- [ ] 新增 `MODE_CONFIGS` 常數
- [ ] 修改 `generateNumbers()` 函式接收 `maxNumber` 參數
- [ ] 修改 `createRow()` 函式接收 `boxCount` 參數

**預估時間**：30 分鐘

---

### 1.2 Storage 重構 (`src/lib/storage.ts`)

- [ ] 新增 `getStorageKey(mode: BoxMode)` 函式
- [ ] 修改 `loadFromStorage()` 接收 `mode` 參數
- [ ] 修改 `saveToStorage()` 接收 `mode` 參數
- [ ] 新增 `getActiveTab()` 函式
- [ ] 新增 `setActiveTab(mode: BoxMode)` 函式
- [ ] 新增 `migrateOldData()` 函式（資料遷移）

**預估時間**：45 分鐘

---

### 1.3 Store 重構 (`src/lib/stores/rowStore.svelte.ts`)

- [ ] 修改為工廠函式 `createRowStore(mode: BoxMode)`
- [ ] 在 `addRow()` 中加入數字範圍驗證
- [ ] 修改 `createRow()` 使用動態 `boxCount`
- [ ] 創建三個獨立 store：`stores['49']`, `stores['39']`, `stores['38']`
- [ ] 導出 `stores` 物件

**預估時間**：45 分鐘

---

## Phase 2: 新增組件

### 2.1 TabSwitcher 組件 (`src/lib/components/TabSwitcher.svelte`)

- [ ] 創建 TabSwitcher 組件
- [ ] 實作三個 Tab 按鈕（49/39/38）
- [ ] 實作 `switchTab()` 函式
- [ ] 加入選中狀態樣式
- [ ] 加入過渡動畫
- [ ] 持久化當前 Tab 到 localStorage
- [ ] 響應式設計（手機適配）

**預估時間**：1 小時

**UI 需求**：

- 按鈕高度：44px（手機最小觸控區域）
- 選中狀態：藍色底部邊框 3px
- 過渡：`transition: all 0.3s ease`
- 佈局：Flexbox 等寬

---

### 2.2 ViewStateManager (`src/lib/stores/viewStateStore.svelte.ts`)

- [ ] 創建 viewStateStore（可選功能）
- [ ] 儲存每個 Tab 的滾動位置
- [ ] 儲存每個 Tab 的縮放比例
- [ ] 實作 `saveViewState()` 函式
- [ ] 實作 `loadViewState()` 函式

**預估時間**：30 分鐘（可選）

---

## Phase 3: 組件適配

### 3.1 BoxCanvas 適配 (`src/lib/components/BoxCanvas.svelte`)

- [ ] 新增 `mode` prop：`BoxMode`
- [ ] 根據 `mode` 載入對應的 store
- [ ] 動態計算 `totalContentWidth`（使用 `MODE_CONFIGS[mode].totalWidth`）
- [ ] 適配虛擬滾動邏輯
- [ ] 傳遞 `mode` 到 `BoxRow`

**預估時間**：45 分鐘

---

### 3.2 BoxRow 適配 (`src/lib/components/BoxRow.svelte`)

- [ ] 新增 `mode` prop：`BoxMode`
- [ ] 使用 `MODE_CONFIGS[mode].boxCount` 動態渲染 box
- [ ] 修改 `generateNumbers()` 調用，傳入 `maxNumber`
- [ ] 確保列編號和刪除按鈕位置正確

**預估時間**：30 分鐘

---

### 3.3 NumberPicker 適配 (`src/lib/components/NumberPicker.svelte`)

- [ ] 新增 `mode` prop：`BoxMode`
- [ ] 根據 `mode` 生成對應數量的數字（49/39/38）
- [ ] 動態調整網格佈局（7x7 / 6x7）
- [ ] 限制可選擇的數字範圍

**預估時間**：30 分鐘

---

### 3.4 AddRowButton 適配 (`src/lib/components/AddRowButton.svelte`)

- [ ] 新增 `mode` prop：`BoxMode`
- [ ] 使用對應 mode 的 store 和 `isMaxReached`
- [ ] 傳遞 `mode` 到 `NumberPicker`

**預估時間**：15 分鐘

---

## Phase 4: 頁面整合

### 4.1 主頁面整合 (`src/routes/+page.svelte`)

- [ ] 新增 `currentMode` 狀態
- [ ] 載入儲存的 `activeTab`
- [ ] 渲染 `TabSwitcher` 組件
- [ ] 傳遞 `mode` 到 `AddRowButton` 和 `BoxCanvas`
- [ ] 實作 Tab 切換邏輯
- [ ] 調整頁面佈局（扣除 Tab 高度）

**預估時間**：45 分鐘

---

## Phase 5: 測試

### 5.1 功能測試

- [ ] Tab 切換正常
- [ ] 每個 Tab 資料獨立
- [ ] 新增列功能（49/39/38 各測試）
- [ ] 刪除列功能
- [ ] Box 點擊切換顏色
- [ ] 數字選擇器範圍正確
- [ ] localStorage 儲存/載入正確

### 5.2 UI/UX 測試

- [ ] Tab 切換動畫流暢
- [ ] 手機端 Tab 按鈕觸控區域足夠大
- [ ] 響應式佈局正常
- [ ] 滾動和縮放正常

### 5.3 邊界情況測試

- [ ] 切換 Tab 不影響其他 Tab 資料
- [ ] 各 Tab 達到 1000 列上限時的處理
- [ ] 舊資料自動遷移到新格式

**預估時間**：1 小時

---

## Phase 6: 優化

### 6.1 效能優化

- [ ] 虛擬滾動在各模式下正常工作
- [ ] Tab 切換時避免不必要的重渲染
- [ ] 使用 `$derived` 優化計算

### 6.2 用戶體驗優化

- [ ] Tab 切換時平滑過渡（fade/slide）
- [ ] 保存每個 Tab 的視圖狀態（可選）
- [ ] 首次使用引導（可選）

**預估時間**：1 小時

---

## 總預估時間

- Phase 1（基礎架構）：2 小時
- Phase 2（新增組件）：1.5 小時
- Phase 3（組件適配）：2 小時
- Phase 4（頁面整合）：0.75 小時
- Phase 5（測試）：1 小時
- Phase 6（優化）：1 小時

**總計：約 8.25 小時**

---

## 實作順序建議

1. **先做 Phase 1**：確保資料結構正確
2. **再做 Phase 2.1**：創建 TabSwitcher（視覺化進度）
3. **然後 Phase 3**：適配現有組件
4. **最後 Phase 4-6**：整合、測試、優化

---

## 資料遷移計劃

### 檢測舊資料

```typescript
function migrateOldData() {
	const oldKey = 'box-table-data'
	const oldData = localStorage.getItem(oldKey)

	if (oldData && !localStorage.getItem('box-table-data-49')) {
		// 遷移到新格式
		localStorage.setItem('box-table-data-49', oldData)
		localStorage.setItem('box-table-active-tab', '49')

		// 可選：刪除舊 key
		// localStorage.removeItem(oldKey);

		console.log('資料已遷移到新格式')
	}
}
```

### 執行時機

在 `+page.svelte` 的 `onMount` 中執行一次。

---

## 檔案清單

### 新增檔案

- `src/lib/components/TabSwitcher.svelte`
- `src/lib/stores/viewStateStore.svelte.ts`（可選）
- `TAB_FEATURE_IMPLEMENTATION.md`（本檔案）

### 修改檔案

- `src/lib/types.ts`
- `src/lib/storage.ts`
- `src/lib/stores/rowStore.svelte.ts`
- `src/lib/components/BoxCanvas.svelte`
- `src/lib/components/BoxRow.svelte`
- `src/lib/components/NumberPicker.svelte`
- `src/lib/components/AddRowButton.svelte`
- `src/routes/+page.svelte`
- `README.md`（已完成）

---

## 注意事項

1. **向後兼容**：確保舊資料能自動遷移
2. **類型安全**：所有新增的程式碼都要有 TypeScript 類型
3. **效能**：Tab 切換不應該造成卡頓
4. **測試**：每個 Phase 完成後都要測試
5. **文檔**：更新 README.md（已完成）

---

## 已完成項目

- [x] 更新 README.md 規格
- [x] 創建實作清單文件

---

**準備開始實作！** 🚀
