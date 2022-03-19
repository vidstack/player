<script lang="ts">
	import clsx from 'clsx';

	import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-fill';

	export let title: string;
	export let options: string[] = [];
	export let value: string = options[0];
	export let disabled = false;
</script>

<div class="inline-block shadow-sm">
	<label
		class={clsx(
			'relative flex items-center px-4 py-1 border border-gray-divider',
			disabled
				? 'text-gray-300'
				: 'text-gray-inverse focus-within:ring-2 bg-gray-elevate hover:bg-gray-hover shadow-sm'
		)}
	>
		<slot name="before-title" />
		<span class="sr-only">{title}</span>
		{value}
		<ArrowDropDownIcon width="20" height="20" class="ml-1" />
		<select
			class="absolute inset-0 cursor-pointer appearance-none opacity-0"
			bind:value
			on:change
			{disabled}
		>
			{#each options as value (value)}
				<option {value}>{value}</option>
			{/each}
			<slot />
		</select>
	</label>
</div>
