<script lang="ts">
  import CodeBlockWrapper from './code-block-wrapper.svelte';
  import CodeSnippetLoader from './code-snippet-loader.svelte';
  import CopyCodeButton from './copy-code-button.svelte';

  let _class = '';
  export { _class as class };

  export let id: string;
  export let title = '';
  export let copy = false;
  export let flat = false;
  export let transform: ((code: string) => string) | undefined = undefined;
</script>

<CodeBlockWrapper class={_class} {title} {flat} showTopBar={!!title || copy}>
  <CopyCodeButton {id} class="ml-auto" slot="top-bar" {transform} />
  <CodeSnippetLoader {id} {transform} />
</CodeBlockWrapper>
