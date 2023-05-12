<script>
  import { addJSLibToPath, jsLib } from '$lib/stores/js-lib';

  export let href;

  $: _href = href.startsWith('https://') ? href : addJSLibToPath(href, $jsLib);
</script>

<a href={_href} {...$$restProps}><slot /></a>
