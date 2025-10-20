# 觸控滾動重構文檔

## 問題描述

原本的實作方式導致觸控拖曳捲軸幾乎無效，主要問題：

1. **事件衝突**：使用 `onpointerdown/onpointerup` 手動檢測點擊，阻止了原生觸控滾動
2. **preventDefault 預設行為**：Konva 預設會阻止觸控事件的瀏覽器預設行為（滾動）
3. **架構混亂**：混用 HTML 滾動容器和 Konva 事件處理，導致衝突

## 解決方案：方案 A - 純 HTML 滾動 + Konva tap 事件

### 核心改動

#### 1. BoxRow.svelte

**之前（問題版本）**：

```svelte
<!-- 手動追蹤指標位置，計算移動距離 -->
<Rect
	onpointerdown={(e) => handleBoxPointerDown(index, e)}
	onpointerup={(e) => handleBoxPointerUp(index, e)}
/>
```

**之後（修復版本）**：

```svelte
<!-- 使用 Konva 內建 tap 事件，自動區分點擊和拖曳 -->
<Rect
  preventDefault={false}  <!-- 關鍵：允許原生觸控滾動 -->
  ontap={() => handleBoxTap(index)}
/>
```

#### 2. 刪除按鈕也同樣處理

**之前**：

```svelte
<Group onpointerclick={handleDeleteClick}>
```

**之後**：

```svelte
<Group preventDefault={false} ontap={handleDeleteClick}>
```

### 技術原理

#### Konva tap 事件的優勢

1. **自動區分點擊和拖曳**
   - Konva 內部已經實作了點擊檢測邏輯
   - 如果手指移動超過閾值，不會觸發 `tap` 事件
   - 無需手動計算距離

2. **preventDefault={false} 的作用**
   - 允許觸控事件的瀏覽器預設行為（滾動）
   - Box 元素不會攔截觸控拖曳手勢
   - 用戶可以正常滾動畫面

3. **與 HTML 滾動容器的配合**
   - HTML `scroll-container` 提供原生滾動
   - Konva Stage 渲染內容
   - Box 只監聽 `tap` 事件，不干擾滾動

### 程式碼簡化

#### 移除的程式碼

```typescript
// ❌ 不再需要手動追蹤指標位置
let pointerDownPos = $state<{ x: number; y: number } | null>(null)
const DRAG_THRESHOLD = 5

function handleBoxPointerDown(index: number, e: any) {
	pointerDownPos = { x: e.evt.clientX, y: e.evt.clientY }
}

function handleBoxPointerUp(index: number, e: any) {
	if (pointerDownPos) {
		const dx = Math.abs(e.evt.clientX - pointerDownPos.x)
		const dy = Math.abs(e.evt.clientY - pointerDownPos.y)
		if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
			rowStore.toggleBox(row.id, index)
		}
	}
	pointerDownPos = null
}
```

#### 新增的程式碼

```typescript
// ✅ 簡潔的 tap 事件處理
function handleBoxTap(index: number) {
	rowStore.toggleBox(row.id, index)
}
```

**減少代碼行數**：從 ~20 行減少到 3 行

### 使用體驗改善

#### 桌面端（滑鼠）

- ✅ 點擊 box 正常切換顏色
- ✅ 可以使用滾輪滾動
- ✅ Ctrl/Cmd + 滾輪縮放正常

#### 移動端（觸控）

- ✅ 輕點 box 正常切換顏色
- ✅ **觸控拖曳可以順暢滾動**（修復重點）
- ✅ 拖曳滾動時不會誤觸 box
- ✅ 支援慣性滾動（瀏覽器原生）

### 為何不使用方案 B（純 Konva 拖曳）

方案 B 需要：

- Stage 設為 `draggable: true`
- 手動計算虛擬滾動的偏移
- 實作拖曳邊界限制
- 自己實作慣性滾動

**缺點**：

- 複雜度高，需要大幅改寫
- 失去原生滾動條
- 失去瀏覽器慣性滾動

**方案 A 的優勢**：

- 最小改動（只改事件監聽）
- 利用瀏覽器原生滾動性能
- 程式碼更簡潔

## 測試檢查清單

### 桌面端測試

- [ ] 滑鼠點擊 box 切換顏色
- [ ] 滑鼠滾輪垂直滾動
- [ ] Shift + 滾輪水平滾動
- [ ] Ctrl/Cmd + 滾輪縮放
- [ ] 點擊刪除按鈕彈出確認對話框

### 移動端測試

- [ ] 輕點 box 切換顏色
- [ ] 單指垂直拖曳滾動（修復重點）
- [ ] 單指水平拖曳滾動（修復重點）
- [ ] 拖曳滾動時不會誤觸 box
- [ ] 慣性滾動正常
- [ ] 輕點刪除按鈕彈出確認對話框

### 邊界情況測試

- [ ] 快速點擊 box（不應視為拖曳）
- [ ] 點擊後小幅移動手指（不應觸發切換）
- [ ] 快速拖曳滾動（不應觸發 tap）
- [ ] 縮放時點擊 box

## 相關文檔

- [Konva Events Documentation](https://konvajs.org/docs/events/Binding_Events.html)
- [Konva Mobile Events](https://konvajs.org/docs/events/Mobile_Events.html)
- [svelte-konva Documentation](https://github.com/konvajs/svelte-konva)

## 技術債務

無。此方案是當前架構下的最佳解。

## 未來可能的優化

1. **雙指縮放（pinch-to-zoom）**
   - 當前只支援 Ctrl/Cmd + 滾輪縮放
   - 可新增觸控雙指縮放支援

2. **橡皮筋效果**
   - 滾動到邊界時的橡皮筋回彈效果
   - 需要使用方案 B（純 Konva）才能實作

3. **自訂滾動條樣式**
   - 當前使用瀏覽器原生滾動條
   - 可使用 CSS 自訂樣式

---

**重構日期**：2025-10-20
**重構原因**：修復觸控滾動失效問題
**方案選擇**：方案 A（純 HTML 滾動 + Konva tap 事件）
**測試狀態**：待測試
