<script lang="ts">
  import { isApiPath, isReactPath } from '$lib/stores/path';

  export let href: string;

  $: path = href.split('#')[0];
  $: hash = href.split('#')[1];
  $: isComponentPath = /\/components\/?/.test(href);
  $: _href = isComponentPath && $isReactPath ? `${path}/react${hash ? `#${hash}` : ''}` : href;
</script>

<a href={_href} {...$$restProps}><slot /></a>
