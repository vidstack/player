<script>
  import { elementTagName, isElementExperimental } from '$lib/stores/element';
  import { isApiPath } from '$lib/stores/path';

  import { CodeInline, kitDocs } from '@svelteness/kit-docs';
  import ExperimentalWarning from '$kitDocs/ExperimentalWarning.svelte';

  import ComponentHeading from './_components/_ComponentHeading.svelte';
  import ComponentImport from './_components/_ComponentImport.svelte';
  import ComponentTabbedLinks from './_components/_ComponentTabbedLinks.svelte';
  import FrameworkSelect from './_components/_FrameworkSelect.svelte';

  $: hasImport = !!$kitDocs.meta?.frontmatter.component_imports;
  $: hasFrameworks = !!$kitDocs.meta?.frontmatter.component_frameworks;
</script>

<ComponentHeading />

{#if hasFrameworks}
  <FrameworkSelect />
{/if}

{#if hasImport}
  <ComponentTabbedLinks />
{/if}

{#if $isElementExperimental}
  <ExperimentalWarning />
{/if}

{#if !$isApiPath && hasImport}
  <div>
    <h2 id="import" tabindex="-1">
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
