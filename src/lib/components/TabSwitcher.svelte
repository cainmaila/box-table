<script lang="ts">
	/**
	 * Tab 切換器元件
	 * 用於在 49/39/38 三種模式之間切換
	 */
	import { setActiveTab } from '../storage'
	import type { BoxMode } from '../types'

	interface Props {
		/** 當前選中的模式 */
		currentMode: BoxMode
		/** 切換模式的回調函式 */
		onSwitch: (mode: BoxMode) => void
	}

	let { currentMode, onSwitch }: Props = $props()

	function handleTabClick(mode: BoxMode) {
		if (mode !== currentMode) {
			setActiveTab(mode)
			onSwitch(mode)
		}
	}
</script>

<div class="tab-switcher">
	<button
		class="tab-button"
		class:active={currentMode === '49'}
		onclick={() => handleTabClick('49')}
		type="button"
	>
		49
	</button>
	<button
		class="tab-button"
		class:active={currentMode === '39'}
		onclick={() => handleTabClick('39')}
		type="button"
	>
		39
	</button>
	<button
		class="tab-button"
		class:active={currentMode === '38'}
		onclick={() => handleTabClick('38')}
		type="button"
	>
		38
	</button>
</div>

<style>
	.tab-switcher {
		display: flex;
		gap: 0.25rem;
		background: transparent;
	}

	.tab-button {
		min-width: 52px;
		height: 36px;
		padding: 0 1rem;
		background: transparent;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab-button:hover:not(.active) {
		background: #f9fafb;
		color: #374151;
		border-color: #d1d5db;
	}

	.tab-button.active {
		color: white;
		background: #3b82f6;
		border-color: #3b82f6;
	}

	.tab-button:active {
		transform: scale(0.96);
	}

	/* 響應式：小螢幕優化 */
	@media (max-width: 640px) {
		.tab-button {
			min-width: 48px;
			padding: 0 0.75rem;
			font-size: 0.875rem;
		}
	}
</style>
