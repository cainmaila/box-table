<script lang="ts">
	/**
	 * 7x7 網格數字選擇器 (1-49)
	 */

	interface Props {
		onselect: (number: number) => void
	}

	let { onselect }: Props = $props()

	// 產生 1-49 的數字陣列
	const numbers = Array.from({ length: 49 }, (_, i) => i + 1)

	function handleSelect(num: number) {
		onselect(num)
	}
</script>

<div class="number-picker">
	<h3>選擇起始數字 (1-49)</h3>
	<div class="grid">
		{#each numbers as num}
			<button class="number-button" onclick={() => handleSelect(num)} type="button">
				{num}
			</button>
		{/each}
	</div>
</div>

<style>
	.number-picker {
		padding: 1rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		max-width: 400px;
	}

	h3 {
		margin: 0 0 1rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: #333;
		text-align: center;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
	}

	.number-button {
		aspect-ratio: 1;
		border: 1px solid #ddd;
		background: #f9f9f9;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		border-radius: 4px;
	}

	.number-button:hover {
		background: #e0f2fe;
		border-color: #0ea5e9;
		transform: scale(1.05);
	}

	.number-button:active {
		transform: scale(0.95);
	}
</style>
