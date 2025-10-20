<script lang="ts">
	/**
	 * Konva 單一列元件
	 * 包含：列編號 + 49個box + 刪除按鈕
	 */
	import { Layer, Rect, Text, Group } from 'svelte-konva'
	import type { Row } from '../types'
	import { generateNumbers } from '../types'
	import { rowStore } from '../stores/rowStore.svelte'

	interface Props {
		row: Row
		yOffset: number // 列的Y軸位置
		onDeleteClick: (rowId: number) => void // 刪除按鈕點擊回調
	}

	let { row, yOffset, onDeleteClick }: Props = $props()

	const BOX_SIZE = 40
	const LABEL_WIDTH = 60 // 列編號區域寬度
	const DELETE_BTN_WIDTH = 80 // 刪除按鈕區域寬度

	// 產生該列的數字陣列
	const numbers = $derived(generateNumbers(row.startNumber))

	function handleBoxClick(index: number) {
		rowStore.toggleBox(row.id, index)
	}

	function handleDeleteClick() {
		onDeleteClick(row.id)
	}
</script>

<Layer>
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

	<!-- 49個box -->
	{#each numbers as num, index}
		{@const isToggled = row.boxes[index]}
		{@const xPos = LABEL_WIDTH + index * BOX_SIZE}

		<!-- Box 背景 -->
		<Rect
			x={xPos}
			y={yOffset}
			width={BOX_SIZE}
			height={BOX_SIZE}
			fill={isToggled ? 'black' : 'white'}
			onpointerclick={() => handleBoxClick(index)}
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
	<Group onpointerclick={handleDeleteClick}>
		<Rect
			x={LABEL_WIDTH + 49 * BOX_SIZE + 10}
			y={yOffset + (BOX_SIZE - 30) / 2}
			width={DELETE_BTN_WIDTH}
			height={30}
			fill="#ef4444"
			cornerRadius={4}
		/>
		<Text
			x={LABEL_WIDTH + 49 * BOX_SIZE + 10}
			y={yOffset + (BOX_SIZE - 30) / 2}
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
</Layer>
