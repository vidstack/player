<script lang="ts">
	import HTMLIcon from '~icons/ri/html5-fill';
	import ReactIcon from '~icons/ri/reactjs-fill';

	import Select from '$components/base/Select.svelte';
	import { framework, type FrameworkType } from '$stores/framework';
	import { isApiPath, isReactPath } from '$stores/path';
	import { goto } from '$app/navigation';

	$: value = $isReactPath ? 'React' : 'HTML';

	function onChange() {
		$framework = value.toLowerCase() as FrameworkType;

		const url = new URL(location.href);
		const path = url.pathname;

		if ($framework === 'react') {
			goto($isApiPath ? `${path.replace(/\/api\/?/, '')}/react/api` : `${path}/react`);
		} else {
			goto(path.replace(/\/react/, ''));
		}
	}
</script>

<Select title="Current Framework" bind:value on:change={onChange}>
	<div slot="before-title" class="mr-1 h-6 w-6" aria-hidden="true">
		{#if $isReactPath}
			<ReactIcon />
		{:else}
			<HTMLIcon />
		{/if}
	</div>

	<option>HTML</option>
	<option>React</option>
</Select>
