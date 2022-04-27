<script lang="ts">
  import { isComponentsPath, isReactPath } from '$lib/stores/path';
  import { kebabToCamelCase, kebabToPascalCase } from '@vidstack/foundation';

  export let code: string;

  function jsxComponentName(code: string) {
    return code.replace(/<vds-(.*?)>/, (...x) => `<${kebabToPascalCase(x[1])}>`);
  }

  function jsxPropertyorEventName(code: string) {
    const isEvent = code.startsWith('vds-');
    return /[a-z]-[a-z]/.test(code)
      ? isEvent
        ? `on${kebabToPascalCase(code.replace('vds-', ''))}`
        : kebabToCamelCase(code)
      : code;
  }

  $: ignore = code.endsWith(':ignore');

  $: codeCleaned = code.replace(/:ignore$/, '');

  $: translatedCode =
    ignore || !$isComponentsPath || !$isReactPath
      ? codeCleaned
      : jsxPropertyorEventName(jsxComponentName(codeCleaned));
</script>

<code>
  {translatedCode}
</code>
