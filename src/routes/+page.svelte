<script lang="ts">
	/**
	 * Box Table 主頁面
	 * 支援三種模式：49/39/38
	 */
	import { onMount } from 'svelte'
	import TabSwitcher from '$lib/components/TabSwitcher.svelte'
	import AddRowButton from '$lib/components/AddRowButton.svelte'
	import { getActiveTab, migrateOldData } from '$lib/storage'
	import type { BoxMode } from '$lib/types'

	// 當前選中的模式
	let currentMode = $state<BoxMode>('49')

	// 動態載入 Canvas 元件（避免 SSR 問題）
	let BoxCanvas = $state<any>(null)

	onMount(async () => {
		// 執行資料遷移（將舊格式資料遷移到新格式）
		migrateOldData()

		// 載入上次選中的 Tab
		currentMode = getActiveTab()

		// 動態載入 Canvas 組件
		const module = await import('$lib/components/BoxCanvas.svelte')
		BoxCanvas = module.default
	})

	// 切換 Tab 的處理函式
	function handleTabSwitch(mode: BoxMode) {
		currentMode = mode
	}
</script>

<div class="app-container">
	<!-- 頂部 Header：新增按鈕（左）+ Tab 切換器（右） -->
	<header class="app-header">
		<div class="header-left">
			<AddRowButton mode={currentMode} />
		</div>
		<div class="header-right">
			<TabSwitcher {currentMode} onSwitch={handleTabSwitch} />
		</div>
	</header>

	<!-- Konva 畫布區域 -->
	{#if BoxCanvas}
		<BoxCanvas mode={currentMode} />
	{:else}
		<div class="loading">載入中...</div>
	{/if}
</div>

<style>
	.app-container {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background: #f9fafb;
	}

	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: white;
		border-bottom: 1px solid #e5e7eb;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 0 0.5rem;
		min-height: 44px; /* 最小觸控區域 */
	}

	.header-left {
		flex-shrink: 0;
	}

	.header-right {
		display: flex;
		gap: 0.5rem;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 1.25rem;
		color: #6b7280;
	}
</style>
