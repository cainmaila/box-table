// localStorage 工具函式

import type { StorageData, BoxMode, SubTab } from './types'
import {
	STORAGE_KEY_PREFIX,
	ACTIVE_MODE_KEY,
	ACTIVE_SUBTAB_PREFIX,
	DEFAULT_SUBTAB,
	LEGACY_STORAGE_KEY
} from './constants'

/**
 * 取得指定模式和 subTab 的 storage key
 * 向後兼容：第 1 頁使用舊格式鍵 'box-table-49'
 * 新格式：第 2-10 頁使用 'box-table-49-2' 格式
 */
export function getStorageKey(mode: BoxMode, subTab: SubTab = DEFAULT_SUBTAB): string {
	// 第 1 頁使用舊格式（向後兼容）
	if (subTab === 1) {
		return `${STORAGE_KEY_PREFIX}${mode}`
	}
	// 第 2-10 頁使用新格式
	return `${STORAGE_KEY_PREFIX}${mode}-${subTab}`
}

/**
 * 從 localStorage 載入指定模式和 subTab 的資料
 */
export function loadFromStorage(mode: BoxMode, subTab: SubTab = DEFAULT_SUBTAB): StorageData {
	if (typeof window === 'undefined') {
		return { rows: [] }
	}

	try {
		const key = getStorageKey(mode, subTab)
		const data = localStorage.getItem(key)
		if (!data) {
			return { rows: [] }
		}
		return JSON.parse(data) as StorageData
	} catch (error) {
		console.error(`載入資料失敗 (${mode} 模式 - 第 ${subTab} 頁):`, error)
		return { rows: [] }
	}
}

/**
 * 儲存資料到 localStorage（指定模式和 subTab）
 */
export function saveToStorage(
	mode: BoxMode,
	data: StorageData,
	subTab: SubTab = DEFAULT_SUBTAB
): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		const key = getStorageKey(mode, subTab)
		localStorage.setItem(key, JSON.stringify(data))
	} catch (error) {
		console.error(`儲存資料失敗 (${mode} 模式 - 第 ${subTab} 頁):`, error)
	}
}

/**
 * 清除指定模式和 subTab 的 localStorage 資料
 */
export function clearStorage(mode: BoxMode, subTab: SubTab = DEFAULT_SUBTAB): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		const key = getStorageKey(mode, subTab)
		localStorage.removeItem(key)
	} catch (error) {
		console.error(`清除資料失敗 (${mode} 模式 - 第 ${subTab} 頁):`, error)
	}
}

/**
 * 取得當前選中的主模式
 */
export function getActiveMode(): BoxMode {
	if (typeof window === 'undefined') {
		return '49'
	}

	try {
		const mode = localStorage.getItem(ACTIVE_MODE_KEY) as BoxMode
		if (mode === '49' || mode === '39' || mode === '38') {
			return mode
		}
		return '49' // 預設值
	} catch (error) {
		console.error('讀取 active mode 失敗:', error)
		return '49'
	}
}

/**
 * 設定當前選中的主模式
 */
export function setActiveMode(mode: BoxMode): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		localStorage.setItem(ACTIVE_MODE_KEY, mode)
	} catch (error) {
		console.error('設定 active mode 失敗:', error)
	}
}

/**
 * 取得指定模式的當前 SubTab
 */
export function getActiveSubTab(mode: BoxMode): SubTab {
	if (typeof window === 'undefined') {
		return DEFAULT_SUBTAB
	}

	try {
		const key = `${ACTIVE_SUBTAB_PREFIX}${mode}`
		const stored = localStorage.getItem(key)
		if (stored) {
			const subTab = parseInt(stored, 10)
			if (subTab >= 1 && subTab <= 10) {
				return subTab as SubTab
			}
		}
		return DEFAULT_SUBTAB
	} catch (error) {
		console.error(`讀取 active subTab 失敗 (${mode} 模式):`, error)
		return DEFAULT_SUBTAB
	}
}

/**
 * 設定指定模式的當前 SubTab
 */
export function setActiveSubTab(mode: BoxMode, subTab: SubTab): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		const key = `${ACTIVE_SUBTAB_PREFIX}${mode}`
		localStorage.setItem(key, subTab.toString())
	} catch (error) {
		console.error(`設定 active subTab 失敗 (${mode} 模式):`, error)
	}
}

/**
 * 向後兼容：取得當前選中的 Tab（別名）
 * @deprecated 使用 getActiveMode() 代替
 */
export function getActiveTab(): BoxMode {
	return getActiveMode()
}

/**
 * 向後兼容：設定當前選中的 Tab（別名）
 * @deprecated 使用 setActiveMode() 代替
 */
export function setActiveTab(mode: BoxMode): void {
	setActiveMode(mode)
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
			localStorage.setItem(ACTIVE_MODE_KEY, '49')
			console.log('資料已從舊格式遷移到新格式 (49 模式)')

			// 可選：刪除舊資料（暫時保留以防萬一）
			// localStorage.removeItem(OLD_STORAGE_KEY)
		}
	} catch (error) {
		console.error('遷移舊資料失敗:', error)
	}
}
