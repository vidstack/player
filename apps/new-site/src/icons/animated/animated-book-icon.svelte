<script lang="ts">
  import clsx from 'clsx';

  import { onMount } from 'svelte';

  let _class = '';
  export { _class as class };

  export let delay = 0;
  export let duration = 300;

  let started = false;

  onMount(() => {
    setTimeout(() => {
      started = true;
    }, delay);
  });

  $: transition = clsx(
    'transition-[opacity,transform]',
    !started ? 'scale-x-[.25] opacity-0' : 'scale-x-100 opacity-100',
  );

  function onStart() {
    started = false;
    setTimeout(() => {
      started = true;
    }, duration);
  }
</script>

<svg
  role="img"
  class={_class}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  on:pointerenter={started ? onStart : null}
>
  <path
    class={clsx(transition, 'origin-bottom')}
    d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
    style={`transition-duration: ${duration}ms`}
  />
  <path
    class={clsx(transition, 'origin-bottom')}
    d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
    style={`transition-duration: ${duration}ms`}
  />
</svg>
