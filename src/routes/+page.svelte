<script lang="ts">
	/**
	 * Box Table 主頁面
	 */
	import { onMount } from 'svelte';
	import AddRowButton from '$lib/components/AddRowButton.svelte';

	// 動態載入 Canvas 元件（避免 SSR 問題）
	let BoxCanvas: any;

	onMount(async () => {
		const module = await import('$lib/components/BoxCanvas.svelte');
		BoxCanvas = module.default;
	});
</script>

<div class="app-container">
	<!-- 頂部新增列按鈕 -->
	<AddRowButton />

	<!-- Konva 畫布區域 -->
	{#if BoxCanvas}
		<svelte:component this={BoxCanvas} />
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

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 1.25rem;
		color: #6b7280;
	}
</style>
