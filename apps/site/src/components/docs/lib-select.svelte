<script lang="ts">
  import HtmlIcon from '../../icons/html-icon.svelte';
  import ReactLogo from '../../icons/logos/react-logo.svelte';
  import { currentJSLibrary, jsLibraries, type JSLibrary } from '../../stores/libraries';
  import { kebabToTitleCase } from '../../utils/string';
  import Select from '../select.svelte';

  let _class: string | undefined = undefined;
  export { _class as class };

  const options = jsLibraries.map((value) => ({ label: kebabToTitleCase(value), value }));

  function onChange({ detail: [value] }: CustomEvent<string[]>) {
    if ($currentJSLibrary === value) return;

    $currentJSLibrary = value as JSLibrary;

    if ($currentJSLibrary === 'react') {
      location.href = location.href.replace('/wc', '');
    } else {
      location.href = location.href.replace('/docs', '/docs/wc');
    }
  }
</script>

<Select
  class={_class}
  label="JS Library"
  {options}
  defaultValue={$currentJSLibrary}
  on:change={onChange}
>
  <div slot="icon">
    {#if $currentJSLibrary === 'web-components'}
      <HtmlIcon class="w-4 h-4 mr-1" />
    {:else}
      <ReactLogo class="w-4 h-4 mr-1.5" />
    {/if}
  </div>
</Select>
