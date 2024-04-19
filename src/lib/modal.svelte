<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	export let onclose = () => {};
	export let onopen = () => {};
	export let show: boolean,
		heading: string = '';

	/**
	 * Opens Modal
	 */
	function openModal() {
		onopen();
		show = true;
	}

	/**
	 * Closes modal;
	 */
	function closeModal() {
		onclose();
		show = false;
	}
	function closeOnEscape(e: { key: string }) {
		if (e.key == 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={closeOnEscape} />

{#if show}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div
		class="absolute top-0 bottom-0 right-0 left-0 bg-stone-200 dark:bg-zinc-900 opacity-40 z-[51]"
		transition:fade
		on:click={closeModal}
		role="separator"
	/>
	<div
		class="absolute top-0 bottom-0 right-0 left-0 flex md:items-center items-end md:justify-center z-[52]"
	>
		<div
			class="bg-stone-200 dark:bg-zinc-700 rounded-0 md:rounded-2xl min-w-full md:min-w-[66.67%] lg:min-w-[33.33%] w-min shadow-xl opacity-100"
			transition:fly={{ y: 180, opacity: 0, duration: 400 }}
		>
			<div class="flex p-2 items-center">
				<div class="flex-1 pl-2 font-semibold">{heading}</div>
				<button
					class="px-4 py-2 hover:bg-primary hover:text-primary-content rounded-full"
					on:click={closeModal}>×</button
				>
			</div>
			<div class="px-8 pb-8">
				<slot />
			</div>
		</div>
	</div>
{/if}
