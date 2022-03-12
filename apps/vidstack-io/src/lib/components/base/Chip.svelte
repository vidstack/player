<script>
	import clsx from 'clsx';

	let __class = '';
	export { __class as class };
</script>

<div
	class={clsx(
		'flex h-6 items-center justify-center rounded-full px-2.5 py-1 text-xs tracking-wide font-mono font-medium',
		'border border-gray-divider shadow-sm',
		__class
	)}
>
	<span class="mt-px">
		<slot />
	</span>
</div>
