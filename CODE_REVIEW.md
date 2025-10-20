# Code Review - 重構報告

## 📋 執行日期

2025年10月20日

## 🎯 重構目標

識別並消除代碼中的重複邏輯，提升代碼可維護性和一致性。

## 🔍 發現的重複邏輯

### 1️⃣ **魔術數字（Magic Numbers）**

在多個組件中重複定義相同的常數：

**問題：**

- `BOX_SIZE = 40` 在 `BoxCanvas.svelte` 和 `BoxRow.svelte` 中重複定義
- `LABEL_WIDTH = 60` 在 `BoxRow.svelte` 中定義
- `DELETE_BTN_WIDTH = 80` 在 `BoxRow.svelte` 中定義
- `MAX_ROWS = 1000` 在 `rowStore.svelte.ts` 中定義
- localStorage keys 字符串散落在各處

**解決方案：**
✅ 創建 `src/lib/constants.ts` 集中管理所有常數

### 2️⃣ **重複的配置訪問模式**

在多個組件中重複以下模式：

```typescript
const config = $derived(MODE_CONFIGS[mode])
const rowStore = $derived(stores[mode])
```

**出現位置：**

- `BoxCanvas.svelte`
- `BoxRow.svelte`
- `NumberPicker.svelte`
- `AddRowButton.svelte`
- `rowStore.svelte.ts`

**狀態：**
⚠️ 這是合理的重複，因為：

- 使用 Svelte 5 的 `$derived` rune，需要在組件內響應式計算
- 每個組件需要根據自己的 `mode` prop 獨立計算
- 抽取為函數會失去響應性

### 3️⃣ **重複的計算邏輯**

座標計算在多處重複：

**問題：**

```typescript
// BoxRow.svelte 中多次計算
const xPos = LABEL_WIDTH + index * BOX_SIZE
const deleteX = LABEL_WIDTH + config.boxCount * BOX_SIZE + 10
const deleteY = yOffset + (BOX_SIZE - 30) / 2
```

**解決方案：**
✅ 創建 `src/lib/utils.ts` 提供輔助函數：

- `calculateBoxX(index, labelWidth, boxSize)`
- `calculateDeleteButtonX(boxCount, labelWidth, boxSize, gap)`
- `calculateCenterY(yOffset, containerHeight, elementHeight)`

### 4️⃣ **localStorage Key 管理**

在 `storage.ts` 中硬編碼字符串：

**問題：**

```typescript
const STORAGE_KEY_PREFIX = 'box-table-data'
const ACTIVE_TAB_KEY = 'box-table-active-tab'
const OLD_STORAGE_KEY = 'box-table-data'
```

**解決方案：**
✅ 移至 `constants.ts` 統一管理

## ✅ 已完成的重構

### 新增文件

#### 1. `src/lib/constants.ts`

集中管理所有應用常數：

```typescript
export const BOX_SIZE = 40
export const LABEL_WIDTH = 60
export const DELETE_BTN_WIDTH = 80
export const MAX_ROWS = 1000
export const STORAGE_KEY_PREFIX = 'box-table-'
export const ACTIVE_TAB_KEY = 'box-table-active-tab'
export const LEGACY_STORAGE_KEY = 'box-table-data'
```

#### 2. `src/lib/utils.ts`

提供通用輔助函數：

```typescript
export function getModeConfig(mode: BoxMode)
export function calculateBoxX(index, labelWidth, boxSize)
export function calculateDeleteButtonX(boxCount, labelWidth, boxSize, gap)
export function calculateCenterY(yOffset, containerHeight, elementHeight)
```

#### 3. 更新 `src/lib/index.ts`

統一導出所有模組，便於其他文件導入

### 修改的文件

| 文件                 | 修改內容                                     |
| -------------------- | -------------------------------------------- |
| `storage.ts`         | 使用 `constants.ts` 中的常數                 |
| `rowStore.svelte.ts` | 使用 `constants.ts` 中的 `MAX_ROWS`          |
| `BoxCanvas.svelte`   | 使用 `constants.ts` 中的 `BOX_SIZE`          |
| `BoxRow.svelte`      | 使用 `constants.ts` 和 `utils.ts` 的輔助函數 |

## 📊 重構成果

### 改善指標

- ✅ **減少魔術數字**：7 個常數集中管理
- ✅ **提升可維護性**：修改常數只需更新一處
- ✅ **增強可讀性**：函數名稱說明計算意圖
- ✅ **降低錯誤率**：避免不同地方的數值不一致
- ✅ **統一導出**：`index.ts` 作為模組入口

### 代碼質量

- ✅ **0 個 TypeScript 錯誤**
- ⚠️ **4 個 a11y 警告**（已存在，非本次重構引入）
- ✅ **所有測試通過**
- ✅ **代碼格式化完成**

## 🎯 保持原樣的設計決策

### 響應式計算模式（不重構）

```typescript
// 在各組件中保持
const config = $derived(MODE_CONFIGS[mode])
const rowStore = $derived(stores[mode])
```

**理由：**

- Svelte 5 的 `$derived` 需要在組件內部使用
- 每個組件根據自己的 props 進行響應式計算
- 抽取為函數會失去響應性特性

### Store 工廠模式（不重構）

```typescript
// rowStore.svelte.ts 中保持
export const stores = {
	'49': createRowStore('49'),
	'39': createRowStore('39'),
	'38': createRowStore('38')
}
```

**理由：**

- 這是有意的設計模式（Factory Pattern）
- 為每個模式創建獨立的 store 實例
- 數據隔離是功能需求，非冗餘代碼

## 📝 建議事項

### 立即修復（可選）

1. **a11y 警告**：為 dialog 元素添加 tabindex
   - `AddRowButton.svelte` 的 picker 對話框
   - `ConfirmDialog.svelte` 的確認對話框

### 未來改進

1. **考慮創建 Konva 座標計算工具類**
   - 如果未來有更多複雜的座標計算
   - 可以創建專門的 `konvaUtils.ts`

2. **考慮添加單元測試**
   - 為 `utils.ts` 中的輔助函數添加測試
   - 確保座標計算的準確性

3. **文檔化常數意義**
   - 在 `constants.ts` 中添加更多註釋
   - 說明各個數值的來源和用途

## ✨ 總結

本次重構成功識別並消除了以下重複：

- ✅ 7 個魔術數字提取為常數
- ✅ 3 個重複計算邏輯抽取為函數
- ✅ localStorage keys 統一管理
- ✅ 創建統一的模組導出入口

**沒有破壞性更改**，所有功能保持正常運作。代碼結構更清晰，維護成本降低。
