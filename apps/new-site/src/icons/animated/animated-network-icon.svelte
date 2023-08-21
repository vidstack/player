<script lang="ts">
  import clsx from 'clsx';

  import { onMount, tick } from 'svelte';

  let _class = '';
  export { _class as class };

  export let delay = 0;
  export let duration = 250;

  let active = true,
    animating = false;

  onMount(() => {
    setTimeout(() => {
      animating = true;
    }, delay);
  });

  $: transition = clsx(
    animating && 'transition-[opacity,transform] origin-center',
    !animating ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
  );

  function onRestart() {
    active = false;
    animating = false;
    tick().then(() => {
      active = true;
      setTimeout(() => {
        animating = true;
      }, 1);
    });
  }
</script>

{#if active}
  <svg
    role="img"
    class={_class}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    on:pointerenter={onRestart}
  >
    <rect
      class={transition}
      x="9"
      y="2"
      width="6"
      height="6"
      rx="1"
      style={`transition-duration: ${duration}ms`}
    />

    <path
      class={transition}
      d="M12 12V8"
      style={`transition-duration: ${duration}ms; transition-delay: ${duration}ms;`}
    />

    <path
      class={transition}
      d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"
      style={`transition-duration: ${duration}ms; transition-delay: ${duration * 2}ms;`}
    />

    <rect
      class={transition}
      x="16"
      y="16"
      width="6"
      height="6"
      rx="1"
      style={`transition-duration: ${duration}ms; transition-delay: ${duration * 3}ms;`}
    />

    <rect
      class={transition}
      x="2"
      y="16"
      width="6"
      height="6"
      rx="1"
      style={`transition-duration: ${duration}ms; transition-delay: ${duration * 3}ms;`}
    />
  </svg>
{/if}
