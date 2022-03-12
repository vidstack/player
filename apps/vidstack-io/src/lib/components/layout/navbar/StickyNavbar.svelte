<script lang="ts">
	import clsx from 'clsx';

	import Navbar from './Navbar.svelte';

	let isNavPopoverOpen = false;
</script>

<div
	class={clsx(
		'border-b border-gray-divider top-0 z-30 w-full flex-none fixed',
		isNavPopoverOpen
			? 'bg-gray-100 dark:bg-gray-800'
			: 'bg-gray-200/95 dark:bg-gray-800/60 backdrop-blur supports-backdrop-blur:bg-white/60'
	)}
>
	<Navbar
		on:open-popover={() => {
			isNavPopoverOpen = true;
		}}
		on:close-popover={() => {
			isNavPopoverOpen = false;
		}}
	>
		<svelte:fragment slot="left">
			<slot name="left" />
		</svelte:fragment>
		<svelte:fragment slot="bottom">
			<slot name="bottom" />
		</svelte:fragment>
	</Navbar>
</div>
