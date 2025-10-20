// localStorage 工具函式

import type { StorageData, Row } from './types'

const STORAGE_KEY = 'box-table-data'

/**
 * 從 localStorage 載入資料
 */
export function loadFromStorage(): StorageData {
	if (typeof window === 'undefined') {
		return { rows: [] }
	}

	try {
		const data = localStorage.getItem(STORAGE_KEY)
		if (!data) {
			return { rows: [] }
		}
		return JSON.parse(data) as StorageData
	} catch (error) {
		console.error('載入資料失敗:', error)
		return { rows: [] }
	}
}

/**
 * 儲存資料到 localStorage
 */
export function saveToStorage(data: StorageData): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	} catch (error) {
		console.error('儲存資料失敗:', error)
	}
}

/**
 * 清除 localStorage 資料
 */
export function clearStorage(): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		localStorage.removeItem(STORAGE_KEY)
	} catch (error) {
		console.error('清除資料失敗:', error)
	}
}
