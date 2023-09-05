<script lang="ts">
  import clsx from 'clsx';

  import { onMount } from 'svelte';

  let _class = '';
  export { _class as class };

  export let duration = 800;
  export let delay = 0;

  let started = false;

  onMount(() => {
    setTimeout(onStart, delay);
  });

  function onStart() {
    started = false;
    setTimeout(() => {
      started = true;
    }, duration);
  }
</script>

<svg
  class={_class}
  role="img"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  aria-hidden="true"
  on:pointerenter={started ? onStart : null}
>
  <path
    class={clsx('heart origin-center', started && 'animate')}
    style={`animation-duration: ${duration}ms;`}
    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
  />

  <g
    class={clsx('transition-opacity', !started ? 'opacity-0' : 'opacity-100')}
    style={`transition-duration: ${!started ? 0 : 250}ms; transition-delay: ${
      !started ? 0 : duration * 3.5
    }ms`}
  >
    <path
      d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"
    />
    <path d="m18 15-2-2" />
    <path d="m15 18-2-2" />
  </g>
</svg>

<style>
  .heart.animate {
    animation-name: heartbeat;
    animation-iteration-count: 3;
  }

  @keyframes heartbeat {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(0.85);
    }
    40% {
      transform: scale(0.95);
    }
    60% {
      transform: scale(0.85);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
