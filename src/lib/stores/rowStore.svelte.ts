// Svelte store 管理列資料（使用傳統 writable store，相容 svelte-konva）

import { writable, derived } from 'svelte/store'
import { createRow, MODE_CONFIGS } from '../types'
import type { Row, BoxMode } from '../types'
import { loadFromStorage, saveToStorage } from '../storage'
import { MAX_ROWS } from '../constants'

/**
 * 創建指定模式的 row store（工廠函式）
 */
function createRowStore(mode: BoxMode) {
	const config = MODE_CONFIGS[mode]

	// 初始化資料
	const initialData = typeof window !== 'undefined' ? loadFromStorage(mode) : { rows: [] }
	const { subscribe, update } = writable<Row[]>(initialData.rows)

	let nextId = initialData.rows.length > 0 ? Math.max(...initialData.rows.map((r) => r.id)) + 1 : 1

	function save(rows: Row[]) {
		saveToStorage(mode, { rows })
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

// 為每個模式創建獨立的 store
export const stores = {
	'49': createRowStore('49'),
	'39': createRowStore('39'),
	'38': createRowStore('38')
}

// 為每個模式創建 isMaxReached 衍生 store
export const isMaxReachedStores = {
	'49': derived(stores['49'], ($rows) => $rows.length >= MAX_ROWS),
	'39': derived(stores['39'], ($rows) => $rows.length >= MAX_ROWS),
	'38': derived(stores['38'], ($rows) => $rows.length >= MAX_ROWS)
}

// 向後兼容：保留原來的 export（預設為 49 模式）
export const rowStore = stores['49']
export const isMaxReached = isMaxReachedStores['49']
