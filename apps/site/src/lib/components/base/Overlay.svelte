<script lang="ts">
	import clsx from 'clsx';

	export let open = false;
</script>

<div
	class={clsx(
		'fixed top-0 left-0 bg-black/40 backdrop-blur-sm dark:bg-gray-700/80 transition-opacity duration-75 pointer-events-auto z-40',
		'w-screen h-screen',
		open ? 'opacity-100 visible' : 'opacity-0 invisible'
	)}
/>
