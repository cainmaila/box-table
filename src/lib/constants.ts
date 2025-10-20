/**
 * 全域常數定義
 * 集中管理應用中使用的魔術數字
 */

/** Box 尺寸 (px) */
export const BOX_SIZE = 40

/** 列編號區域寬度 (px) */
export const LABEL_WIDTH = 60

/** 刪除按鈕區域寬度 (px) */
export const DELETE_BTN_WIDTH = 80

/** 最大列數限制 */
export const MAX_ROWS = 1000

/** localStorage key 前綴 */
export const STORAGE_KEY_PREFIX = 'box-table-'

/** 當前活動 Tab 的 localStorage key */
export const ACTIVE_TAB_KEY = 'box-table-active-tab'

/** 舊版本資料的 localStorage key（用於遷移） */
export const LEGACY_STORAGE_KEY = 'box-table-data'
