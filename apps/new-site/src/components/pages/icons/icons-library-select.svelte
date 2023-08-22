<script lang="ts">
  import Select from '../../select.svelte';
  import { currentIconLibrary, iconLibraryOptions, type IconLibrary } from './shared';

  function onChange({ detail: [value] }: CustomEvent<string[]>) {
    currentIconLibrary.set(value as IconLibrary);

    const url = new URL(location.href);

    if (value === 'react') url.searchParams.delete('lib');
    else url.searchParams.set('lib', value);

    window.history.pushState({}, '', url);
  }
</script>

<Select
  class="min-w-[120px]"
  label="Preferred SVG Library"
  options={iconLibraryOptions}
  defaultValue={$currentIconLibrary}
  on:change={onChange}
/>
