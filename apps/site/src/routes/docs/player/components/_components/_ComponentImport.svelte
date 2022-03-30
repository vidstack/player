<script lang="ts">
  import {
    code as jsRawCode,
    hlCode as jsHlsCode,
  } from './_snippets/_import-component.js?highlight';
  import {
    code as cdnRawCode,
    hlCode as cdnHlCode,
  } from './_snippets/_import-component.html?highlight';
  import {
    code as reactRawCode,
    hlCode as reactHlCode,
  } from './_snippets/_import-component.jsx?highlight';

  import { kebabToPascalCase } from '@vidstack/foundation';
  import { isReactPath } from '$lib/stores/path';
  import { elementTagName } from '$lib/stores/element';
  import CodeFence from '$lib/components/markdown/CodeFence.svelte';

  $: js = [jsRawCode, jsHlsCode].map((s) => s.replace('{TAG_NAME}', $elementTagName));
  $: cdn = [cdnRawCode, cdnHlCode].map((s) => s.replace('{TAG_NAME}', $elementTagName));
  $: react = [reactRawCode, reactHlCode].map((s) =>
    s.replace('TagName', kebabToPascalCase($elementTagName.replace('vds-', ''))),
  );
</script>

{#if $isReactPath}
  <CodeFence ext="jsx" rawCode={react[0]} code={react[1]} showCopyCode />
{:else}
  <CodeFence ext="js" rawCode={js[0]} code={js[1]} showCopyCode />
  <CodeFence ext="html" title="CDN" rawCode={cdn[0]} code={cdn[1]} showCopyCode />
{/if}
