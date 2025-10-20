// localStorage 工具函式

import type { StorageData, BoxMode } from './types'
import { STORAGE_KEY_PREFIX, ACTIVE_TAB_KEY, LEGACY_STORAGE_KEY } from './constants'

/**
 * 取得指定模式的 storage key
 */
export function getStorageKey(mode: BoxMode): string {
	return `${STORAGE_KEY_PREFIX}-${mode}`
}

/**
 * 從 localStorage 載入指定模式的資料
 */
export function loadFromStorage(mode: BoxMode): StorageData {
	if (typeof window === 'undefined') {
		return { rows: [] }
	}

	try {
		const key = getStorageKey(mode)
		const data = localStorage.getItem(key)
		if (!data) {
			return { rows: [] }
		}
		return JSON.parse(data) as StorageData
	} catch (error) {
		console.error(`載入資料失敗 (${mode} 模式):`, error)
		return { rows: [] }
	}
}

/**
 * 儲存資料到 localStorage（指定模式）
 */
export function saveToStorage(mode: BoxMode, data: StorageData): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		const key = getStorageKey(mode)
		localStorage.setItem(key, JSON.stringify(data))
	} catch (error) {
		console.error(`儲存資料失敗 (${mode} 模式):`, error)
	}
}

/**
 * 清除指定模式的 localStorage 資料
 */
export function clearStorage(mode: BoxMode): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		const key = getStorageKey(mode)
		localStorage.removeItem(key)
	} catch (error) {
		console.error(`清除資料失敗 (${mode} 模式):`, error)
	}
}

/**
 * 取得當前選中的 Tab
 */
export function getActiveTab(): BoxMode {
	if (typeof window === 'undefined') {
		return '49'
	}

	try {
		const tab = localStorage.getItem(ACTIVE_TAB_KEY) as BoxMode
		if (tab === '49' || tab === '39' || tab === '38') {
			return tab
		}
		return '49' // 預設值
	} catch (error) {
		console.error('讀取 active tab 失敗:', error)
		return '49'
	}
}

/**
 * 設定當前選中的 Tab
 */
export function setActiveTab(mode: BoxMode): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		localStorage.setItem(ACTIVE_TAB_KEY, mode)
	} catch (error) {
		console.error('設定 active tab 失敗:', error)
	}
}

/**
 * 遷移舊版本資料到新格式
 * 將 'box-table-data' 遷移到 'box-table-data-49'
 */
export function migrateOldData(): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		// 檢查是否有舊資料
		const oldData = localStorage.getItem(LEGACY_STORAGE_KEY)
		const newKey = getStorageKey('49')

		// 如果有舊資料且新格式還沒有資料，則遷移
		if (oldData && !localStorage.getItem(newKey)) {
			localStorage.setItem(newKey, oldData)
			localStorage.setItem(ACTIVE_TAB_KEY, '49')
			console.log('資料已從舊格式遷移到新格式 (49 模式)')

			// 可選：刪除舊資料（暫時保留以防萬一）
			// localStorage.removeItem(OLD_STORAGE_KEY)
		}
	} catch (error) {
		console.error('遷移舊資料失敗:', error)
	}
}
