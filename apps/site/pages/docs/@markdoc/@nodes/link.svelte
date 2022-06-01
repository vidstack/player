<script>
  import { jsLib, addJSLibToPath } from '$src/stores/js-lib';

  export let href;

  $: _href = addJSLibToPath(href, $jsLib);
</script>

<a href={_href} {...$$restProps}><slot /></a>
