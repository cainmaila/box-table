<script lang="ts">
	/**
	 * 確認對話框
	 */

	interface Props {
		message: string
		onconfirm: () => void
		oncancel: () => void
	}

	let { message, onconfirm, oncancel }: Props = $props()
</script>

<div class="overlay" onclick={oncancel} role="presentation">
	<div class="dialog" onclick={(e) => e.stopPropagation()} role="dialog">
		<p class="message">{message}</p>
		<div class="buttons">
			<button class="btn btn-cancel" onclick={oncancel} type="button">取消</button>
			<button class="btn btn-confirm" onclick={onconfirm} type="button">確定刪除</button>
		</div>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.dialog {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		max-width: 400px;
		width: 90%;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
	}

	.message {
		margin: 0 0 1.5rem;
		font-size: 1rem;
		color: #333;
		text-align: center;
		line-height: 1.5;
	}

	.buttons {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.5rem 1.25rem;
		border: none;
		border-radius: 4px;
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-cancel {
		background: #f3f4f6;
		color: #374151;
	}

	.btn-cancel:hover {
		background: #e5e7eb;
	}

	.btn-confirm {
		background: #ef4444;
		color: white;
	}

	.btn-confirm:hover {
		background: #dc2626;
	}

	.btn:active {
		transform: scale(0.95);
	}
</style>
