// Box Table 資料型別定義

/**
 * 單一列的資料結構
 */
export interface Row {
	/** 列的唯一 ID */
	id: number
	/** 起始數字 (1-49) */
	startNumber: number
	/** 49個box的狀態，true=黑底白字，false=白底黑字 */
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
 * 產生從起始數字開始的49個數字陣列
 * 例如：startNumber=13 → [13,14,...,49,1,2,...,12]
 */
export function generateNumbers(startNumber: number): number[] {
	const numbers: number[] = []
	for (let i = 0; i < 49; i++) {
		const num = ((startNumber - 1 + i) % 49) + 1
		numbers.push(num)
	}
	return numbers
}

/**
 * 建立新列，所有box預設為白底黑字
 */
export function createRow(id: number, startNumber: number): Row {
	return {
		id,
		startNumber,
		boxes: new Array(49).fill(false)
	}
}
