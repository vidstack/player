<script lang="ts">
  import Select, { type Option } from '~/components/select.svelte';
  import {
    cssLibraries,
    currentCSSLibrary,
    currentJSLibrary,
    jsLibraries,
    type CSSLibrary,
    type JSLibrary,
  } from '~/stores/libraries';
  import { kebabToTitleCase } from '~/utils/string';

  let _class: string | undefined = undefined;
  export { _class as class };

  const options: Option[] = [
    ...jsLibraries.map((value) => ({ label: kebabToTitleCase(value), value, group: 'JS' })),
    ...cssLibraries.map((value) => ({
      label: kebabToTitleCase(value.replace('-css', '').replace('css', 'CSS')),
      value,
      group: 'CSS',
    })),
  ];

  function onChange({ detail: [jsLib, cssLib] }: CustomEvent<string[]>) {
    if ($currentJSLibrary !== jsLib) {
      $currentJSLibrary = jsLib as JSLibrary;
      if ($currentJSLibrary === 'react') {
        location.href = location.href.replace('/wc', '');
      } else {
        location.href = location.href.replace('/docs', '/docs/wc');
      }
    }

    if ($currentCSSLibrary !== cssLib) {
      $currentCSSLibrary = cssLib as CSSLibrary;
      const url = new URL(location.href);
      url.searchParams.set('styling', cssLib);
      window.history.pushState({}, '', url);
    }
  }
</script>

<Select
  class={_class}
  label="Libraries"
  {options}
  value={[$currentJSLibrary, $currentCSSLibrary]}
  multiple
  on:change={onChange}
/>
