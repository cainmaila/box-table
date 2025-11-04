<script lang="ts">
	import type { BoxMode, SubTab } from '$lib/types'
	import { MAX_SUBTABS } from '$lib/constants'

	interface Props {
		currentMode: BoxMode
		currentSubTab: SubTab
		onchange: (subTab: SubTab) => void
	}

	let { currentMode, currentSubTab, onchange }: Props = $props()

	// 生成 1-10 的 tab 陣列
	const tabs: SubTab[] = Array.from({ length: MAX_SUBTABS }, (_, i) => (i + 1) as SubTab)

	function handleTabClick(tab: SubTab) {
		onchange(tab)
	}
</script>

<div class="subtab-selector">
	<div class="subtab-label">第 {currentMode} 期：</div>
	<div class="subtab-tabs">
		{#each tabs as tab}
			<button
				class="subtab-btn"
				class:active={currentSubTab === tab}
				onclick={() => handleTabClick(tab)}
			>
				{tab}
			</button>
		{/each}
	</div>
</div>

<style>
	.subtab-selector {
		display: flex;
		align-items: center;
		height: 50px;
		background: #f5f5f5;
		border-bottom: 1px solid #e0e0e0;
		padding: 0 16px;
		overflow-x: auto;
		overflow-y: hidden;
		gap: 12px;
	}

	.subtab-label {
		font-size: 14px;
		color: #666;
		font-weight: 500;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.subtab-tabs {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		overflow-y: hidden;
		flex: 1;
		padding: 4px 0;
		/* 隱藏滾動條但保持功能 */
		scrollbar-width: thin;
	}

	.subtab-tabs::-webkit-scrollbar {
		height: 4px;
	}

	.subtab-tabs::-webkit-scrollbar-thumb {
		background: #ccc;
		border-radius: 2px;
	}

	.subtab-btn {
		min-width: 50px;
		height: 36px;
		padding: 0 16px;
		border: 1px solid #ddd;
		border-radius: 6px;
		background: white;
		color: #333;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		flex-shrink: 0;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.subtab-btn:hover {
		background: #f8f8f8;
		border-color: #999;
	}

	.subtab-btn:active {
		transform: scale(0.98);
	}

	.subtab-btn.active {
		background: #2196f3;
		color: white;
		border-color: #2196f3;
		font-weight: 600;
	}

	.subtab-btn.active:hover {
		background: #1976d2;
		border-color: #1976d2;
	}

	/* 移動端優化 */
	@media (max-width: 768px) {
		.subtab-selector {
			height: 45px;
			padding: 0 12px;
			gap: 8px;
		}

		.subtab-label {
			font-size: 13px;
		}

		.subtab-btn {
			min-width: 44px;
			height: 32px;
			padding: 0 12px;
			font-size: 13px;
		}
	}
</style>
