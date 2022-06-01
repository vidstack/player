<script>
  import clsx from 'clsx';
  import { route } from '@vitebook/svelte';

  import { addJSLibToPath, jsLib } from '$src/stores/js-lib';

  export let title;
  export let href;
  export let disabled = false;

  $: _href = disabled ? null : addJSLibToPath(href, $jsLib);
  $: isActive = !disabled && $route.url.pathname === _href;
</script>

<li>
  <h2>
    <a
      class={clsx(
        '-mb-px flex border-current pt-3 pb-2.5 leading-6 px-4 hover:border-b-2 cursor-pointer',
        isActive && 'text-brand font-semibold border-b-2',
        !isActive && !disabled && 'text-gray-soft hover:text-gray-inverse',
      )}
      href={_href}
      {disabled}
      data-prefetch
    >
      {title}
    </a>
  </h2>
</li>
