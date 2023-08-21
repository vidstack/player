<script lang="ts">
  import clsx from 'clsx';

  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let _class = '';
  export { _class as class };

  export let delay = 0;
  export let duration = 1500;

  let started = false,
    ended = false;

  onMount(() => {
    setTimeout(onStart, delay);
  });

  function onStart() {
    started = false;
    ended = false;
    requestAnimationFrame(() => {
      started = true;
      setTimeout(() => {
        ended = true;
      }, duration * 2);
    });
  }
</script>

<svg
  role="img"
  class={_class}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  on:pointerenter={started ? onStart : null}
>
  {#if !ended}
    <g class={clsx('closed-box', started && 'animate')} style={`animation-duration: ${duration}ms`}>
      <path
        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
      />

      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </g>
  {:else}
    <g>
      <path
        d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"
      />
      <line x1="12" x2="12" y1="22" y2="13" />
      <path
        d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"
      />
      <path
        d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"
      />
    </g>
  {/if}
</svg>

<style>
  .closed-box.animate {
    animation-name: shake;
    animation-fill-mode: both;
    animation-iteration-count: 2;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    animation-timing-function: cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-0.5px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(0.8px, 1px, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-1px, -1px, 0);
    }

    40%,
    60% {
      transform: translate3d(1px, 0.5px, 0);
    }
  }
</style>
