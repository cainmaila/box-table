# Box Table

Box Table 是一個響應式的web手機應用，使用SvelteKit構建，專為手機用戶設計，提供直觀的表格操作體驗。

## 功能

- 響應式設計，適配各種手機螢幕
- **多模式 Tab 切換**：支援三種不同數字範圍的表格模式
  - **49 模式**：1~49 號碼排列與互動（每列 49 個 box）
  - **39 模式**：1~39 號碼排列與互動（每列 39 個 box）
  - **38 模式**：1~38 號碼排列與互動（每列 38 個 box）
- 特殊用途的表單：號碼排列與互動
  - 新增一列（橫向）包含指定數量的正方體box，數字順序排列
  - 設定起始數字，從該數字開始循環排列至填滿所有box
  - 設定後不可修改，只能刪除整列並重新新增
  - 每個box可點擊切換顏色（白底黑字 ↔ 黑底白字）
- 圖形互動，使用svelte-konva實現互動式圖形元素
- 適合手機畫面，支援無限列增加與xy滾動
- **獨立資料儲存**：每個 Tab 的資料獨立儲存，切換 Tab 不會影響其他模式的資料

## 需求規格

### 0. Tab 模式切換

- **位置**：頁面頂部 Header 區域
- **Tab 數量**：3 個
- **Tab 類型**：
  - **Tab 1 - 49 模式**（預設）：
    - 每列包含 49 個 box
    - 數字範圍：1~49
    - 起始數字選擇：1~49
  - **Tab 2 - 39 模式**：
    - 每列包含 39 個 box
    - 數字範圍：1~39
    - 起始數字選擇：1~39
  - **Tab 3 - 38 模式**：
    - 每列包含 38 個 box
    - 數字範圍：1~38
    - 起始數字選擇：1~38
- **資料隔離**：每個 Tab 的列資料獨立儲存在 localStorage
- **切換行為**：
  - 切換 Tab 時保留當前 Tab 的滾動位置和縮放狀態
  - 切換到其他 Tab 時載入該 Tab 的資料
  - 每個 Tab 有獨立的列編號計數器

### 1. 新增列功能

- 用戶可以新增一列（橫向排列）box
- 每列包含的 box 數量根據當前 Tab 決定（49/39/38個）
- box內顯示對應範圍的數字，順序排列
- 每列建立後內容不可再修改，只能刪除整列重新新增
- 最多允許存在1000列，超過應提示使用者

### 2. 起始數字設定

- 每次新增列時，用戶需設定起始數字（根據當前 Tab 的範圍）
- 排列邏輯：
  - 從設定數字開始（如13）
  - 依次增加：13, 14, 15, ..., 直到範圍最大值
  - 超過最大值後重複：1, 2, 3, ..., 直到填滿所有box
  - 例如（39模式，起始數字13）：13, 14, ..., 39, 1, 2, ..., 12
- 設定後不可修改

### 3. 刪除列功能

- 每列提供刪除按鈕
- 刪除整列後可重新新增

### 4. Box互動

- 預設：白底黑字
- 點擊：切換為黑底白字
- 再點擊：復原白底黑字
- 循環切換

### 5. 顯示與滾動

- box大小適合手機畫面（建議40x40px）
- 橫向49個box，豎向無限列
- 支援xy軸滾動
- 支援縮放功能（pinch to zoom）

## 技術實作細節

### 資料持久化

- 使用 `localStorage` 儲存所有列資料
- 儲存內容包括：
  - 每列的起始數字
  - 每個box的顏色狀態（白底黑字/黑底白字）
- 頁面載入時自動恢復資料

### UI/UX 設計

#### Tab 切換介面

- **位置**：頁面最頂部（Header 區域）
- **設計**：
  - 三個水平 Tab 按鈕：「49」、「39」、「38」
  - 當前選中的 Tab 有視覺高亮（如底部邊框、背景色）
  - 響應式設計：手機螢幕上 Tab 按鈕等寬分佈
- **互動**：
  - 點擊 Tab 即時切換
  - 切換動畫：平滑過渡效果
  - 保留各 Tab 的狀態（滾動位置、縮放比例）

#### 新增列介面

- 位置：Tab 下方（Header 區域）
- 流程：
  1. 點擊「新增列」按鈕
  2. 彈出浮動視窗顯示起始數字選擇器（範圍根據當前 Tab）
  3. 驗證輸入後建立新列
  4. 新列出現在最上方（Canvas 頂部）

#### 刪除列

- 刪除按鈕位於每列右側
- 刪除前需要確認對話框（防止誤刪）

#### 列識別

- 每列顯示列編號/ID
- 設計需避免與box數字混淆
- 位置：每列最左側

### 渲染策略

#### Canvas 實作

- 使用 `svelte-konva` (Konva.js 的 Svelte 包裝)
- 原因：避免 HTML 方式產生 49,000+ DOM 元素（1000列 × 49個box）造成效能問題
- 組件架構：
  - `Stage`：主要 canvas 容器
  - `Layer`：列容器
  - `Rect`：個別 box
  - `Text`：box 內的數字

#### 效能優化

- **虛擬滾動**：只渲染可見範圍的列
  - 僅渲染視窗內 + 緩衝區的列
  - 根據滾動位置動態建立/銷毀 Konva layers
  - 目標：任何時刻保持渲染元素在 500-1000 個以內
- **事件委派**：有效使用 Konva 事件系統
- **狀態管理**：最小化反應式更新

### 手機優化

#### 縮放與平移

- **捏合縮放**：支援手機縮放功能
- **平移**：支援雙軸觸控平移
- **Konva 功能**：使用 Konva 內建的 `draggable` 和 `scale` 屬性

#### 響應式尺寸

- **Box 尺寸**：40x40px 基準
- **總寬度**：49個box × 40px = 1960px（需要橫向滾動）
- **縮放範圍**：建議 0.5x - 2x

### 詳細設計規格

#### Box 樣式

- **間距**：完全無間距，box之間緊密對齊（0px gap）
- **邊框**：無邊框
- **對齊**：所有box必須精確對齊，無縫隙
- **顏色**：
  - 預設：白底黑字 (`background: white; color: black`)
  - 點擊後：黑底白字 (`background: black; color: white`)

#### 起始數字選擇器

- **類型**：網格選擇器 (Grid Picker)
- **佈局**：根據當前 Tab 動態調整
  - **49 模式**：7x7 網格顯示數字 1-49
  - **39 模式**：6x7 網格顯示數字 1-39（最後一行 4 個）
  - **38 模式**：6x7 網格顯示數字 1-38（最後一行 3 個）
- **互動**：點擊任一數字即選定
- **必選**：使用者必須選擇一個數字才能建立列

#### 列編號設計

- **格式**：#1, #2, #3...
- **顏色**：灰色系（如 `#666` 或 `#888`），與box數字區分
- **位置**：每列最左側
- **字體**：比box數字稍小

#### 刪除按鈕

- **樣式**：文字按鈕「刪除」
- **位置**：每列右側
- **確認對話框**：「確定要刪除列 #X 嗎？此操作無法復原。」
  - 按鈕：「確定刪除」/「取消」

#### Stage 尺寸

- **高度**：滿版 (`100vh` 扣除頂部 Tab 區域和「新增列」按鈕高度)
- **寬度**：根據當前 Tab 動態調整
  - **49 模式**：列編號(60px) + 49×40px + 刪除按鈕(90px) + padding(20px) = 2130px
  - **39 模式**：列編號(60px) + 39×40px + 刪除按鈕(90px) + padding(20px) = 1730px
  - **38 模式**：列編號(60px) + 38×40px + 刪除按鈕(90px) + padding(20px) = 1690px
- **滾動容器**：外層 HTML `<div>` 處理滾動，內層 Konva Stage 渲染內容

#### 資料結構 (localStorage)

```typescript
// 每個 Tab 獨立儲存，使用不同的 key
// 'box-table-data-49' for 49模式
// 'box-table-data-39' for 39模式
// 'box-table-data-38' for 38模式

{
  rows: [
    {
      id: number,           // 列ID
      startNumber: number,  // 起始數字 (根據模式：1-49, 1-39, 1-38)
      boxes: boolean[]      // N個boolean，true=黑底白字，false=白底黑字
                            // 49模式：49個，39模式：39個，38模式：38個
    }
  ]
}
```

#### Tab 狀態管理

```typescript
// 當前選中的 Tab（儲存在 localStorage）
// 'box-table-active-tab': '49' | '39' | '38'

// 每個 Tab 的視圖狀態（可選，用於恢復滾動位置和縮放）
// 'box-table-view-state-49', 'box-table-view-state-39', 'box-table-view-state-38'
{
  scrollTop: number,
  scrollLeft: number,
  scale: number
}
```

#### 限制與驗證

- **最大列數**：每個 Tab 獨立計算，各自最多 1000 列
- **超過限制**：顯示提示「已達到最多1000列的上限」
- **新增按鈕**：達到上限時停用 (disabled)

---

## Tab 功能技術實作規劃

### 架構設計

#### 1. 組件結構

```
+page.svelte
├── TabSwitcher.svelte          (新增：Tab 切換元件)
├── AddRowButton.svelte         (修改：接收 mode prop)
└── BoxCanvas.svelte            (修改：接收 mode prop)
    ├── BoxRow.svelte           (修改：動態 box 數量)
    └── ConfirmDialog.svelte    (無需修改)
```

#### 2. 資料模型

```typescript
// types.ts 新增
export type BoxMode = '49' | '39' | '38'

export interface ModeConfig {
	mode: BoxMode
	maxNumber: number // 49, 39, 38
	boxCount: number // 49, 39, 38
	totalWidth: number // 計算後的總寬度
	gridLayout: {
		// NumberPicker 網格佈局
		cols: number
		rows: number
	}
}

// 每個模式的配置
export const MODE_CONFIGS: Record<BoxMode, ModeConfig> = {
	'49': {
		mode: '49',
		maxNumber: 49,
		boxCount: 49,
		totalWidth: 2130,
		gridLayout: { cols: 7, rows: 7 }
	},
	'39': {
		mode: '39',
		maxNumber: 39,
		boxCount: 39,
		totalWidth: 1730,
		gridLayout: { cols: 7, rows: 6 }
	},
	'38': {
		mode: '38',
		maxNumber: 38,
		boxCount: 38,
		totalWidth: 1690,
		gridLayout: { cols: 7, rows: 6 }
	}
}
```

#### 3. Storage 策略

```typescript
// storage.ts 修改
export function getStorageKey(mode: BoxMode): string {
	return `box-table-data-${mode}`
}

export function loadFromStorage(mode: BoxMode): StorageData {
	const key = getStorageKey(mode)
	// ... 載入邏輯
}

export function saveToStorage(mode: BoxMode, data: StorageData): void {
	const key = getStorageKey(mode)
	// ... 儲存邏輯
}

// 新增：Tab 狀態管理
export function getActiveTab(): BoxMode {
	return (localStorage.getItem('box-table-active-tab') as BoxMode) || '49'
}

export function setActiveTab(mode: BoxMode): void {
	localStorage.setItem('box-table-active-tab', mode)
}
```

#### 4. Store 重構

```typescript
// rowStore.svelte.ts 修改
import { writable } from 'svelte/store'

// 改為接收 mode 參數的工廠函式
export function createRowStore(mode: BoxMode) {
	const config = MODE_CONFIGS[mode]
	const initialData = loadFromStorage(mode)

	// ... store 實作

	return {
		subscribe,
		addRow: (startNumber: number) => {
			// 驗證 startNumber 範圍 (1 ~ config.maxNumber)
			if (startNumber < 1 || startNumber > config.maxNumber) {
				return false
			}
			// ... 新增邏輯
		},
		deleteRow,
		toggleBox
	}
}

// 為每個模式創建獨立的 store
export const stores = {
	'49': createRowStore('49'),
	'39': createRowStore('39'),
	'38': createRowStore('38')
}
```

### 實作步驟

#### Phase 1: 基礎架構（1-2小時）

1. ✅ 更新 `types.ts` 新增 `BoxMode` 和 `ModeConfig`
2. ✅ 修改 `storage.ts` 支援多模式
3. ✅ 重構 `rowStore.svelte.ts` 為工廠模式
4. ✅ 創建 `TabSwitcher.svelte` 組件

#### Phase 2: 組件適配（2-3小時）

1. ✅ 修改 `BoxCanvas.svelte` 接收 `mode` prop
2. ✅ 修改 `BoxRow.svelte` 動態渲染 box 數量
3. ✅ 修改 `NumberPicker.svelte` 動態網格佈局
4. ✅ 修改 `AddRowButton.svelte` 傳遞 mode

#### Phase 3: 整合測試（1小時）

1. ✅ 整合到 `+page.svelte`
2. ✅ 測試 Tab 切換
3. ✅ 測試資料隔離
4. ✅ 測試響應式佈局

#### Phase 4: 優化（1小時）

1. ✅ 切換動畫
2. ✅ 狀態持久化（滾動位置、縮放）
3. ✅ 效能優化
4. ✅ 錯誤處理

### UI 設計細節

#### TabSwitcher 組件

```svelte
<div class="tab-switcher">
	<button class:active={currentTab === '49'} onclick={() => switchTab('49')}> 49 </button>
	<button class:active={currentTab === '39'} onclick={() => switchTab('39')}> 39 </button>
	<button class:active={currentTab === '38'} onclick={() => switchTab('38')}> 38 </button>
</div>
```

**樣式**：

- 等寬按鈕：`flex: 1`
- 選中狀態：底部 3px 藍色邊框 + 背景色變化
- 過渡動畫：`transition: all 0.3s ease`
- 手機優化：最小觸控區域 44px

### 資料遷移

對於現有用戶：

- 檢測舊的 `box-table-data` key
- 自動遷移到 `box-table-data-49`
- 設定 `box-table-active-tab` 為 '49'
- 顯示遷移成功提示
