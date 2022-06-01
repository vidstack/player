<script lang="ts">
  import { jsLib, type JSLibType } from '$src/stores/js-lib';
  import { kebabToCamelCase, kebabToPascalCase } from '@vidstack/foundation';

  export let code: string = '';

  $: tag = code.startsWith('$tag:');
  $: attr = code.startsWith('$attr:');
  $: event = code.startsWith('$event:');
  $: cleanCode = code.replace(/^(\$tag|\$attr|\$event):/, '');
  $: translatedCode = translate($jsLib, cleanCode);

  function toComponentName(tagName: string) {
    return `&lt;${kebabToPascalCase(tagName.replace(/^vds-/, '').replace(/>$/, ''))}&gt;`;
  }

  function toPropertyName(attrName: string) {
    return kebabToCamelCase(attrName);
  }

  function toJSXEventName(eventName: string) {
    return `on${kebabToPascalCase(eventName.replace('vds-', ''))}`;
  }

  function translate(lib: JSLibType, code: string) {
    if (tag) {
      return lib === 'html' ? `&lt;${code}&gt;` : toComponentName(code);
    } else if (attr) {
      return lib === 'html' ? code : toPropertyName(code);
    } else if (event) {
      return lib !== 'react' ? code : toJSXEventName(code);
    }

    return code;
  }
</script>

<code>
  {@html translatedCode}
</code>
