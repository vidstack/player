<script lang="ts">
  import { comingSoonElement, elementTagName } from '$lib/stores/element';
  import { jsLib } from '$lib/stores/js-lib';
  import { kebabToPascalCase } from '$lib/utils/string';

  import CodeFence from '../../../../.markdoc/@node/fence.svelte';
  import {
    highlightedCode as cdnHlCode,
    code as cdnRawCode,
  } from '../.imports/import-component.html?highlight';
  import {
    highlightedCode as jsHlsCode,
    code as jsRawCode,
  } from '../.imports/import-component.js?highlight';
  import {
    highlightedCode as reactHlCode,
    code as reactRawCode,
  } from '../.imports/import-component.tsx?highlight';

  /* remove Import code snippets from buffering indicator and controls page */
  const invalidElements = new Set(['vds-buffering-indicator', 'vds-controls']);
  $: hideSnippets = invalidElements.has($elementTagName);

  $: js = [jsRawCode, jsHlsCode].map((s) => s.replace('{TAG_NAME}', $elementTagName));
  $: cdn = [cdnRawCode, cdnHlCode].map((s) => s.replace('{TAG_NAME}', $elementTagName));
  $: react = [reactRawCode, reactHlCode].map((s) =>
    s.replace('TagName', kebabToPascalCase($elementTagName.replace('vds-', ''))),
  );
</script>

{#if $comingSoonElement}
  <p>This component is not available yet.</p>
{:else if !hideSnippets && $jsLib === 'react'}
  <CodeFence lang="tsx" code={react[0]} highlightedCode={react[1]} copy />
{:else if !hideSnippets}
  <CodeFence lang="js" code={js[0]} highlightedCode={js[1]} copy />
  <CodeFence lang="html" title="cdn" code={cdn[0]} highlightedCode={cdn[1]} copy />
{/if}
