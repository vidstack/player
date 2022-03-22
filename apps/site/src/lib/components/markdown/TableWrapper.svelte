<script>
	import clsx from 'clsx';

	let __class = '';
	export { __class as class };
</script>

<div
	class={clsx(
		'table-wrapper overflow-auto scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent',
		'scrollbar-track:!bg-gray-divider scrollbar-thumb:!rounded scrollbar-thumb:!bg-gray-300',
		'scrollbar-track:!rounded my-[2em]',
		__class
	)}
	style="scrollbar-width: thin;"
>
	<slot />
</div>
