<script lang="ts">
	/**
	 * Konva 主畫面元件
	 * 功能：虛擬滾動 + 縮放/平移
	 *
	 * 觸控滾動機制：
	 * - 使用 HTML 原生滾動（scroll-container）
	 * - Konva box 設定 preventDefault={false} 允許觸控滾動
	 * - 使用 tap 事件區分點擊和拖曳（Konva 自動處理）
	 */
	import { onMount } from 'svelte'
	import { Stage, Layer, Line } from 'svelte-konva'
	import BoxRow from './BoxRow.svelte'
	import ConfirmDialog from './ConfirmDialog.svelte'
	import { getStore } from '../stores/rowStore.svelte'
	import { MODE_CONFIGS, type BoxMode, type SubTab } from '../types'
	import { BOX_SIZE } from '../constants'

	interface Props {
		mode: BoxMode
		subTab: SubTab
	}

	let { mode, subTab }: Props = $props()

	let containerWidth = $state(0)
	let containerHeight = $state(0)
	let scrollTop = $state(0)
	let scrollLeft = $state(0)

	// 縮放狀態
	let scale = $state(1)

	// 刪除確認對話框狀態
	let showDeleteConfirm = $state(false)
	let deleteRowId = $state<number | null>(null)

	let containerEl: HTMLDivElement
	let scrollContainerEl: HTMLDivElement

	// 根據模式和 subTab 取得對應的 store 和配置
	const rowStore = $derived(getStore(mode, subTab))
	const config = $derived(MODE_CONFIGS[mode])

	// 取得 store 資料
	let rows = $state($rowStore)

	// 訂閱 store 更新
	$effect(() => {
		const unsubscribe = rowStore.subscribe((value) => {
			rows = value
		})
		return unsubscribe
	})

	// 虛擬滾動：計算可見列
	const visibleRows = $derived.by(() => {
		if (!rows) return []

		const buffer = 2 // 緩衝區（前後各渲染2列）
		const rowHeight = BOX_SIZE
		const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer)
		const endIndex = Math.min(
			rows.length,
			Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer
		)

		return rows.slice(startIndex, endIndex).map((row, idx) => ({
			row,
			yOffset: (startIndex + idx) * rowHeight,
			rowIndex: startIndex + idx // 列的實際索引（從0開始）
		}))
	})

	// 計算總內容高度與寬度
	const totalContentHeight = $derived(rows ? rows.length * BOX_SIZE : 0)
	// 根據模式動態計算寬度
	const totalContentWidth = $derived(config.totalWidth)

	// 計算 Stage 尺寸
	// Stage 的寬度和高度都應該匹配內容大小，這樣可以正確限制滾動範圍
	const stageWidth = $derived(totalContentWidth)
	const stageHeight = $derived(Math.max(containerHeight, totalContentHeight))

	onMount(() => {
		// 初始化容器尺寸
		updateSize()
		window.addEventListener('resize', updateSize)

		return () => {
			window.removeEventListener('resize', updateSize)
		}
	})

	function updateSize() {
		if (containerEl) {
			containerWidth = containerEl.clientWidth
			containerHeight = containerEl.clientHeight
		}
	}

	function handleScroll(e: Event) {
		const target = e.target as HTMLDivElement
		scrollTop = target.scrollTop
		scrollLeft = target.scrollLeft
	}

	// 縮放功能（滾輪縮放）
	function handleWheel(e: WheelEvent) {
		if (!e.ctrlKey && !e.metaKey) return // 只在按住 Ctrl/Cmd 時縮放

		e.preventDefault()

		const scaleBy = 1.1
		const oldScale = scale

		// 計算新縮放比例
		const newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
		scale = Math.max(0.5, Math.min(2, newScale)) // 限制在 0.5x - 2x
	}

	// 處理刪除按鈕點擊
	function handleDeleteClick(rowId: number) {
		deleteRowId = rowId
		showDeleteConfirm = true
	}

	// 確認刪除
	function confirmDelete() {
		if (deleteRowId !== null) {
			rowStore.deleteRow(deleteRowId)
			deleteRowId = null
		}
		showDeleteConfirm = false
	}

	// 取消刪除
	function cancelDelete() {
		deleteRowId = null
		showDeleteConfirm = false
	}
</script>

<div class="canvas-container" bind:this={containerEl}>
	<div
		class="scroll-container"
		bind:this={scrollContainerEl}
		onscroll={handleScroll}
		onwheel={handleWheel}
	>
		<!-- 內容容器，固定寬度以限制滾動範圍 -->
		<div
			class="content-wrapper"
			style:height="{totalContentHeight}px"
			style:width="{totalContentWidth}px"
		>
			<!-- Konva Stage -->
			<Stage width={stageWidth} height={stageHeight} scaleX={scale} scaleY={scale}>
				<!-- 主要內容 Layer（包含所有 BoxRow） -->
				<Layer>
					{#each visibleRows as { row, yOffset, rowIndex } (row.id)}
						<BoxRow {row} {yOffset} {rowIndex} {mode} {subTab} onDeleteClick={handleDeleteClick} />
					{/each}
				</Layer>

				<!-- 紅色分隔線 Layer（每5列） -->
				<Layer>
					{#each visibleRows as { yOffset, rowIndex }}
						{#if (rowIndex + 1) % 5 === 0}
							<Line
								points={[0, yOffset + BOX_SIZE, totalContentWidth, yOffset + BOX_SIZE]}
								stroke="#ef4444"
								strokeWidth={2}
								listening={false}
							/>
						{/if}
					{/each}
				</Layer>
			</Stage>
		</div>
	</div>
</div>

<!-- 刪除確認對話框 -->
{#if showDeleteConfirm && deleteRowId !== null}
	<ConfirmDialog
		message="確定要刪除列 #{deleteRowId} 嗎？此操作無法復原。"
		onconfirm={confirmDelete}
		oncancel={cancelDelete}
	/>
{/if}

<style>
	.canvas-container {
		position: relative;
		width: 100%;
		height: calc(100vh - 45px); /* 扣除頂部按鈕高度 */
		overflow: hidden;
	}

	.scroll-container {
		width: 100%;
		height: 100%;
		overflow: auto;
		position: relative;
	}

	.content-wrapper {
		position: relative;
		/* 寬度和高度由 style 屬性動態設定 */
	}
</style>
