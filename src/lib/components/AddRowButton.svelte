<script lang="ts">
	/**
	 * 新增列按鈕與浮動對話框
	 */
	import NumberPicker from './NumberPicker.svelte'
	import { getStore, getIsMaxReachedStore } from '../stores/rowStore.svelte'
	import type { BoxMode, SubTab } from '../types'

	interface Props {
		mode: BoxMode
		subTab: SubTab
	}

	let { mode, subTab }: Props = $props()

	// 根據模式和 subTab 取得對應的 store
	const rowStore = $derived(getStore(mode, subTab))
	const isMaxReached = $derived(getIsMaxReachedStore(mode, subTab))

	let showPicker = $state(false)

	function openPicker() {
		showPicker = true
	}

	function closePicker() {
		showPicker = false
	}

	function handleSelect(num: number) {
		const success = rowStore.addRow(num)
		if (success) {
			closePicker()
		} else {
			alert('已達到最多1000列的上限')
		}
	}
</script>

<div class="add-row-container">
	<button class="add-btn" onclick={openPicker} disabled={$isMaxReached} type="button">
		+ 新增列
	</button>

	{#if $isMaxReached}
		<span class="warning-text">已達到最多1000列的上限</span>
	{/if}
</div>

{#if showPicker}
	<div class="overlay" onclick={closePicker} role="presentation">
		<div class="picker-wrapper" onclick={(e) => e.stopPropagation()} role="dialog">
			<NumberPicker {mode} {subTab} onselect={handleSelect} />
			<button class="close-btn" onclick={closePicker} type="button">✕</button>
		</div>
	</div>
{/if}

<style>
	.add-row-container {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.add-btn {
		padding: 0.5rem 1rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.add-btn:hover:not(:disabled) {
		background: #2563eb;
		box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
	}

	.add-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.add-btn:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}

	.warning-text {
		color: #ef4444;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.picker-wrapper {
		position: relative;
	}

	.close-btn {
		position: absolute;
		top: -0.5rem;
		right: -0.5rem;
		width: 2rem;
		height: 2rem;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 50%;
		font-size: 1.25rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		background: #dc2626;
		transform: scale(1.1);
	}
</style>
