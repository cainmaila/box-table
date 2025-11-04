<script lang="ts">
	/**
	 * Konva 單一列元件
	 * 包含：列編號 + N個box + 刪除按鈕（N根據模式而定）
	 */
	import { Rect, Text, Group } from 'svelte-konva'
	import type { Row, BoxMode, SubTab } from '../types'
	import { generateNumbers, MODE_CONFIGS } from '../types'
	import { getStore } from '../stores/rowStore.svelte'
	import { BOX_SIZE, LABEL_WIDTH, DELETE_BTN_WIDTH } from '../constants'
	import { calculateBoxX, calculateDeleteButtonX, calculateCenterY } from '../utils'

	interface Props {
		row: Row
		yOffset: number // 列的Y軸位置
		rowIndex: number // 列的索引（從0開始）
		mode: BoxMode // 當前模式
		subTab: SubTab // 當前 SubTab
		onDeleteClick: (rowId: number) => void // 刪除按鈕點擊回調
	}

	let { row, yOffset, rowIndex, mode, subTab, onDeleteClick }: Props = $props()

	// 取得當前模式的配置
	const config = $derived(MODE_CONFIGS[mode])

	// 產生該列的數字陣列
	const numbers = $derived(generateNumbers(row.startNumber, config.maxNumber, config.boxCount))

	// 取得當前模式和 subTab 的 store
	const rowStore = $derived(getStore(mode, subTab))

	// 處理 box 點擊（使用 tap 事件，自動區分點擊和拖曳）
	function handleBoxTap(index: number) {
		rowStore.toggleBox(row.id, index)
	}

	// 處理刪除按鈕點擊
	function handleDeleteClick() {
		onDeleteClick(row.id)
	}
</script>

<!-- 使用 Group 而不是 Layer -->
<Group>
	<!-- 列編號 -->
	<Text
		x={10}
		y={yOffset + BOX_SIZE / 2}
		text="#{row.id}"
		fontSize={14}
		fill="#666"
		align="left"
		verticalAlign="middle"
	/>

	<!-- 動態數量的 box -->
	{#each numbers as num, index}
		{@const isToggled = row.boxes[index]}
		{@const xPos = calculateBoxX(index, LABEL_WIDTH, BOX_SIZE)}

		<!-- Box 背景 -->
		<Rect
			x={xPos}
			y={yOffset}
			width={BOX_SIZE}
			height={BOX_SIZE}
			fill={isToggled ? 'black' : 'white'}
			preventDefault={false}
			ontap={() => handleBoxTap(index)}
		/>

		<!-- Box 數字 -->
		<Text
			x={xPos}
			y={yOffset}
			width={BOX_SIZE}
			height={BOX_SIZE}
			text={String(num)}
			fontSize={16}
			fill={isToggled ? 'white' : 'black'}
			align="center"
			verticalAlign="middle"
			listening={false}
		/>
	{/each}

	<!-- 刪除按鈕 (使用 Rect + Text 模擬按鈕) -->
	<Group preventDefault={false} ontap={handleDeleteClick}>
		{@const deleteX = calculateDeleteButtonX(config.boxCount, LABEL_WIDTH, BOX_SIZE)}
		{@const deleteY = calculateCenterY(yOffset, BOX_SIZE, 30)}
		<Rect
			x={deleteX}
			y={deleteY}
			width={DELETE_BTN_WIDTH}
			height={30}
			fill="#ef4444"
			cornerRadius={4}
		/>
		<Text
			x={deleteX}
			y={deleteY}
			width={DELETE_BTN_WIDTH}
			height={30}
			text="刪除"
			fontSize={14}
			fill="white"
			align="center"
			verticalAlign="middle"
			listening={false}
		/>
	</Group>
</Group>
