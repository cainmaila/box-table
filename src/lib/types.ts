// Box Table 資料型別定義

/**
 * Box 模式類型：49、39 或 38
 */
export type BoxMode = '49' | '39' | '38'

/**
 * 模式配置
 */
export interface ModeConfig {
	/** 模式標識 */
	mode: BoxMode
	/** 最大數字 */
	maxNumber: number
	/** box 數量 */
	boxCount: number
	/** 計算後的總寬度 (px) */
	totalWidth: number
	/** NumberPicker 網格佈局 */
	gridLayout: {
		cols: number
		rows: number
	}
}

/**
 * 每個模式的配置
 */
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

/**
 * 單一列的資料結構
 */
export interface Row {
	/** 列的唯一 ID */
	id: number
	/** 起始數字 (根據模式：1-49, 1-39, 1-38) */
	startNumber: number
	/** box的狀態陣列，true=黑底白字，false=白底黑字 */
	boxes: boolean[]
}

/**
 * localStorage 儲存的完整資料結構
 */
export interface StorageData {
	/** 所有列的陣列 */
	rows: Row[]
}

/**
 * 產生從起始數字開始的數字陣列
 * @param startNumber 起始數字
 * @param maxNumber 最大數字（根據模式：49, 39, 38）
 * @param count 需要產生的數字數量
 * @example startNumber=13, maxNumber=49, count=49 → [13,14,...,49,1,2,...,12]
 * @example startNumber=13, maxNumber=39, count=39 → [13,14,...,39,1,2,...,12]
 */
export function generateNumbers(startNumber: number, maxNumber: number, count: number): number[] {
	const numbers: number[] = []
	for (let i = 0; i < count; i++) {
		const num = ((startNumber - 1 + i) % maxNumber) + 1
		numbers.push(num)
	}
	return numbers
}

/**
 * 建立新列，所有box預設為白底黑字
 * @param id 列ID
 * @param startNumber 起始數字
 * @param boxCount box數量（根據模式：49, 39, 38）
 */
export function createRow(id: number, startNumber: number, boxCount: number): Row {
	return {
		id,
		startNumber,
		boxes: new Array(boxCount).fill(false)
	}
}
