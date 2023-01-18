<script>
  import clsx from 'clsx';
  import { route } from '@vessel-js/svelte';

  import { addJSLibToPath, jsLib } from '$lib/stores/js-lib';

  export let title;
  export let href;
  export let disabled = false;

  $: _href = disabled ? null : addJSLibToPath(href, $jsLib);
  $: isActive = !disabled && $route.matchedURL.pathname === _href;
</script>

<li>
  <h2>
    <a
      class={clsx(
        '-mb-px flex cursor-pointer px-4 pt-3 pb-2.5 leading-6 hover:border-b-2',
        isActive ? 'text-brand border-brand border-b-2 font-semibold' : 'border-inverse',
        !isActive && !disabled && 'text-soft hover:text-inverse',
      )}
      href={_href}
      {disabled}
      data-prefetch
    >
      {title}
    </a>
  </h2>
</li>
