<script>
  import { elementTagName, isElementExperimental } from '$lib/stores/element';
  import { isApiPath } from '$lib/stores/path';

  import { kitDocs } from '@svelteness/kit-docs';
  import CodeInline from '$kitDocs/CodeInline.svelte';
  import ExperimentalWarning from '$kitDocs/ExperimentalWarning.svelte';

  import ComponentHeading from './_components/_ComponentHeading.svelte';
  import ComponentImport from './_components/_ComponentImport.svelte';
  import ComponentTabbedLinks from './_components/_ComponentTabbedLinks.svelte';

  $: hasImport = !!$kitDocs.meta?.frontmatter.component_imports;
</script>

<ComponentHeading />

{#if hasImport}
  <ComponentTabbedLinks />
{/if}

{#if $isElementExperimental && !$isApiPath}
  <ExperimentalWarning />
{/if}

{#if !$isApiPath && hasImport}
  <div>
    <h2 class="mt-10" id="import" tabindex="-1">
      <a class="header-anchor" href="#import" aria-hidden="true">#</a>
      Import
    </h2>
    <p>
      You can import the <CodeInline code={`<${$elementTagName}>`} /> component like so:
    </p>
    <ComponentImport />
  </div>
{/if}

<slot />
