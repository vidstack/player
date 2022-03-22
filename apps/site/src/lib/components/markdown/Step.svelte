<script lang="ts">
	import clsx from 'clsx';
	import { tick } from 'svelte';
	import { getStepsContext } from '../markdown/Steps.svelte';

	const { steps, register } = getStepsContext();

	let li: HTMLLIElement;
	let index = register();

	export let orientation: 'horizontal' | 'vertical' = 'horizontal';

	$: if ($steps > 0 && li) {
		tick().then(() => {
			index = Array.from(li.parentElement.children).indexOf(li) + 1;
		});
	}
</script>

<li
	class={clsx(
		'step relative pl-10 1200:grid before:content-[counter(step)] before:absolute',
		'before:left-0 before:flex before:items-center before:justify-center before:w-[calc(1.375rem+1px)]',
		'before:h-[calc(1.375rem+1px)] before:text-[0.7rem] before:font-bold before:text-white dark:before:text-black',
		'before:rounded-md before:shadow-md before:bg before:bg-gray-inverse before:border before:border-gray-soft',
		index !== $steps &&
			'pb-8 after:absolute after:top-[calc(1.875rem+1px)] after:bottom-0 after:left-[0.6875rem] after:w-px after:bg-gray-divider',
		orientation === 'horizontal' ? 'grid-cols-5 gap-10' : 'grid-cols-4 gap-4'
	)}
	style="counter-increment: step;"
	bind:this={li}
>
	<div class={clsx('mb-6 1200:mb-2', orientation === 'horizontal' ? 'col-span-2' : 'col-span-4')}>
		<span class="not-prose mb-4 text-base font-semibold leading-7 text-gray-inverse">
			<slot name="title" />
		</span>

		<div class="text-sm">
			<slot name="description" />
		</div>
	</div>

	<div class={clsx(orientation === 'horizontal' ? 'col-span-3' : 'col-span-4')}>
		<slot />
	</div>
</li>
