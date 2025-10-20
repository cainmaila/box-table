// Svelte store 管理列資料（使用傳統 writable store，相容 svelte-konva）

import { writable, derived } from 'svelte/store'
import { createRow } from '../types'
import type { Row } from '../types'
import { loadFromStorage, saveToStorage } from '../storage'

const MAX_ROWS = 1000

function createRowStore() {
	// 初始化資料
	const initialData = typeof window !== 'undefined' ? loadFromStorage() : { rows: [] }
	const { subscribe, set, update } = writable<Row[]>(initialData.rows)

	let nextId = initialData.rows.length > 0 ? Math.max(...initialData.rows.map((r) => r.id)) + 1 : 1

	function save(rows: Row[]) {
		saveToStorage({ rows })
	}

	return {
		subscribe,

		/**
		 * 新增列
		 * @returns 是否成功新增
		 */
		addRow: (startNumber: number): boolean => {
			let success = false
			update((rows) => {
				if (rows.length >= MAX_ROWS) {
					return rows
				}
				const newRow = createRow(nextId++, startNumber)
				const updatedRows = [newRow, ...rows] // 新列出現在最左方（陣列開頭）
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
				if (row && boxIndex >= 0 && boxIndex < 49) {
					row.boxes[boxIndex] = !row.boxes[boxIndex]
					save(rows)
				}
				return rows
			})
		}
	}
}

export const rowStore = createRowStore()

// 衍生 store：是否達到上限
export const isMaxReached = derived(rowStore, ($rows) => $rows.length >= MAX_ROWS)
