// Svelte store 管理列資料（使用傳統 writable store，相容 svelte-konva）

import { writable, derived } from 'svelte/store'
import { createRow, MODE_CONFIGS } from '../types'
import type { Row, BoxMode, SubTab } from '../types'
import { loadFromStorage, saveToStorage } from '../storage'
import { MAX_ROWS, DEFAULT_SUBTAB } from '../constants'

/**
 * 創建指定模式和 subTab 的 row store（工廠函式）
 */
function createRowStore(mode: BoxMode, subTab: SubTab = DEFAULT_SUBTAB) {
	const config = MODE_CONFIGS[mode]

	// 服務器端始終使用空數組，避免 SSR hydration 問題
	const { subscribe, set, update } = writable<Row[]>([])

	let nextId = 1

	// 瀏覽器端載入數據
	if (typeof window !== 'undefined') {
		const initialData = loadFromStorage(mode, subTab)
		if (initialData.rows.length > 0) {
			set(initialData.rows)
			nextId = Math.max(...initialData.rows.map((r) => r.id)) + 1
		}
	}

	function save(rows: Row[]) {
		saveToStorage(mode, { rows }, subTab)
	}

	return {
		subscribe,

		/**
		 * 新增列
		 * @param startNumber 起始數字（必須在 1 到 maxNumber 範圍內）
		 * @returns 是否成功新增
		 */
		addRow: (startNumber: number): boolean => {
			// 驗證起始數字範圍
			if (startNumber < 1 || startNumber > config.maxNumber) {
				console.error(`起始數字 ${startNumber} 超出範圍，應在 1-${config.maxNumber} 之間`)
				return false
			}

			let success = false
			update((rows) => {
				if (rows.length >= MAX_ROWS) {
					return rows
				}
				const newRow = createRow(nextId++, startNumber, config.boxCount)
				const updatedRows = [newRow, ...rows] // 新列出現在最上方（陣列開頭）
				save(updatedRows)
				success = true
				return updatedRows
			})
			return success
		},

		/**
		 * 刪除列
		 */
		deleteRow: (id: number) => {
			update((rows) => {
				const updatedRows = rows.filter((r) => r.id !== id)
				save(updatedRows)
				return updatedRows
			})
		},

		/**
		 * 切換 box 狀態
		 */
		toggleBox: (rowId: number, boxIndex: number) => {
			update((rows) => {
				const row = rows.find((r) => r.id === rowId)
				if (row && boxIndex >= 0 && boxIndex < config.boxCount) {
					row.boxes[boxIndex] = !row.boxes[boxIndex]
					save(rows)
				}
				return rows
			})
		}
	}
}

// 為每個模式的第 1 頁創建預設 store（向後兼容）
export const stores = {
	'49': createRowStore('49', 1),
	'39': createRowStore('39', 1),
	'38': createRowStore('38', 1)
}

// 為每個模式創建 isMaxReached 衍生 store
export const isMaxReachedStores = {
	'49': derived(stores['49'], ($rows) => $rows.length >= MAX_ROWS),
	'39': derived(stores['39'], ($rows) => $rows.length >= MAX_ROWS),
	'38': derived(stores['38'], ($rows) => $rows.length >= MAX_ROWS)
}

// 所有 store 的嵌套結構（延遲初始化）
type StoreInstance = ReturnType<typeof createRowStore>
const allStores: Partial<Record<BoxMode, Partial<Record<SubTab, StoreInstance>>>> = {}

// 所有 isMaxReached store 的嵌套結構（延遲初始化）
type DerivedStoreBoolean = ReturnType<typeof derived<StoreInstance, boolean>>
const allIsMaxReachedStores: Partial<
	Record<BoxMode, Partial<Record<SubTab, DerivedStoreBoolean>>>
> = {}

/**
 * 獲取指定模式和 subTab 的 store
 * 延遲初始化：只在需要時創建 store
 */
export function getStore(mode: BoxMode, subTab: SubTab = DEFAULT_SUBTAB): StoreInstance {
	// 第 1 頁返回預設 store（向後兼容）
	if (subTab === 1) {
		return stores[mode]
	}

	// 確保模式的嵌套對象存在
	if (!allStores[mode]) {
		allStores[mode] = {}
	}

	// 延遲創建 store
	if (!allStores[mode]![subTab]) {
		allStores[mode]![subTab] = createRowStore(mode, subTab)
	}

	return allStores[mode]![subTab]!
}

/**
 * 獲取指定模式和 subTab 的 isMaxReached store
 * 延遲初始化：只在需要時創建 derived store
 */
export function getIsMaxReachedStore(
	mode: BoxMode,
	subTab: SubTab = DEFAULT_SUBTAB
): DerivedStoreBoolean {
	// 第 1 頁返回預設 store（向後兼容）
	if (subTab === 1) {
		return isMaxReachedStores[mode]
	}

	// 確保模式的嵌套對象存在
	if (!allIsMaxReachedStores[mode]) {
		allIsMaxReachedStores[mode] = {}
	}

	// 延遲創建 derived store
	if (!allIsMaxReachedStores[mode]![subTab]) {
		const store = getStore(mode, subTab)
		allIsMaxReachedStores[mode]![subTab] = derived(store, ($rows) => $rows.length >= MAX_ROWS)
	}

	return allIsMaxReachedStores[mode]![subTab]!
}

// 向後兼容：保留原來的 export（預設為 49 模式，第 1 頁）
export const rowStore = stores['49']
export const isMaxReached = isMaxReachedStores['49']
