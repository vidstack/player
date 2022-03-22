<script lang="ts">
	import clsx from 'clsx';
	import NoteIcon from '~icons/ri/sticky-note-fill';
	import InfoIcon from '~icons/ri/information-fill';
	import TipIcon from '~icons/ri/lightbulb-flash-fill';
	import WarningIcon from '~icons/ri/error-warning-fill';
	import DangerIcon from '~icons/ri/skull-2-fill';
	import ExperimentalIcon from '~icons/ri/test-tube-fill';

	export let type: 'note' | 'info' | 'tip' | 'warning' | 'danger' | 'experimental';
	export let title: string | null = null;

	const icons = {
		note: NoteIcon,
		info: InfoIcon,
		tip: TipIcon,
		warning: WarningIcon,
		danger: DangerIcon,
		experimental: ExperimentalIcon
	};

	$: heading = title ?? type.toUpperCase();
</script>

<div
	class={clsx(
		'admonition my-8 border-2 border-l-8 p-4 rounded-md mx-auto shadow-xl',
		type === 'note' && 'border-pink-400 bg-pink-300/10',
		type === 'info' && 'border-blue-400 bg-blue-300/10',
		type === 'tip' && 'border-green-400 bg-green-300/10',
		type === 'warning' && 'border-yellow-400 bg-yellow-400/10',
		type === 'danger' && 'border-red-400 bg-red-300/10',
		type === 'experimental' && 'border-indigo-400 bg-indigo-300/10'
	)}
>
	<div
		class={clsx(
			'flex h-full items-center font-bold',
			type === 'note' && 'text-pink-400',
			type === 'info' && 'text-blue-400',
			type === 'tip' && 'text-green-400',
			type === 'warning' && 'text-yellow-400',
			type === 'danger' && 'text-red-400',
			type === 'experimental' && 'text-indigo-400'
		)}
	>
		<svelte:component this={icons[type]} class="mr-1.5 text-xl" />
		<span class="flex items-center">
			{heading}
		</span>
	</div>

	<div class="pl-1 text-lg text-gray-inverse">
		<slot />
	</div>
</div>
