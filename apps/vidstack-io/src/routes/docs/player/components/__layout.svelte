<script>
	import { elementTagName, isElementExperimental } from '$stores/element';
	import { isApiPath } from '$stores/path';

	import CodeInline from '$components/markdown/CodeInline.svelte';
	import ExperimentalWarning from '$components/markdown/ExperimentalWarning.svelte';

	import ComponentHeading from './_components/_ComponentHeading.svelte';
	import ComponentImport from './_components/_ComponentImport.svelte';
	import ComponentTabbedLinks from './_components/_ComponentTabbedLinks.svelte';
	import FrameworkSelect from './_components/_FrameworkSelect.svelte';

	const ignoreSelect = new Set(['vds-youtube', 'vds-vimeo']);

	const ignoreImports = new Set([
		'vds-youtube',
		'vds-vimeo',
		'vds-controls',
		'vds-buffering-indicator'
	]);
</script>

<ComponentHeading />

{#if !ignoreSelect.has($elementTagName)}
	<FrameworkSelect />
{/if}

{#if !ignoreImports.has($elementTagName)}
	<ComponentTabbedLinks />
{/if}

{#if $isElementExperimental}
	<ExperimentalWarning />
{/if}

{#if !$isApiPath && !ignoreImports.has($elementTagName)}
	<div>
		<h2>Import</h2>
		<p>
			You can import the <CodeInline code={`<${$elementTagName}>`} /> component like so:
		</p>
		<ComponentImport />
	</div>
{/if}

<slot />
