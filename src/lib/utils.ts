/**
 * 通用輔助函數
 * 集中管理重複使用的邏輯
 */

import type { BoxMode } from './types'
import { MODE_CONFIGS } from './types'

/**
 * 獲取指定模式的配置
 * @param mode 模式
 * @returns 模式配置對象
 */
export function getModeConfig(mode: BoxMode) {
	return MODE_CONFIGS[mode]
}

/**
 * 計算 Box 的 X 座標位置
 * @param index Box 索引（從 0 開始）
 * @param labelWidth 標籤區域寬度
 * @param boxSize Box 尺寸
 * @returns X 座標
 */
export function calculateBoxX(index: number, labelWidth: number, boxSize: number): number {
	return labelWidth + index * boxSize
}

/**
 * 計算刪除按鈕的 X 座標位置
 * @param boxCount Box 數量
 * @param labelWidth 標籤區域寬度
 * @param boxSize Box 尺寸
 * @param gap 間距
 * @returns X 座標
 */
export function calculateDeleteButtonX(
	boxCount: number,
	labelWidth: number,
	boxSize: number,
	gap: number = 10
): number {
	return labelWidth + boxCount * boxSize + gap
}

/**
 * 計算垂直居中的 Y 座標
 * @param yOffset Y 軸偏移
 * @param containerHeight 容器高度
 * @param elementHeight 元素高度
 * @returns Y 座標
 */
export function calculateCenterY(
	yOffset: number,
	containerHeight: number,
	elementHeight: number
): number {
	return yOffset + (containerHeight - elementHeight) / 2
}
