<script lang="ts">
  import CodeSnippet from './code-snippet.svelte';

  export let packages: string | string[];

  function transform(code: string) {
    return code.replace('{PACKAGES}', typeof packages === 'string' ? packages : packages.join(' '));
  }
</script>

{#key packages}
  <CodeSnippet id="npm-install" title="terminal" {transform} copy />
{/key}
