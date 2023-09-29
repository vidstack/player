<script>
  import clsx from 'clsx';

  import { onMount } from 'svelte';

  let _class = '';
  export { _class as class };

  export let duration = 400;
  export let delay = 0;
  export let skipInitial = false;

  let started = false;

  onMount(() => {
    if (!skipInitial) {
      setTimeout(onStart, delay);
    }
  });

  function onStart() {
    started = false;
    skipInitial = false;
    requestAnimationFrame(() => {
      setTimeout(() => {
        started = true;
      }, duration);
    });
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
  on:pointerenter={started || skipInitial ? onStart : null}
>
  <path
    d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
  />

  <path
    d="M9 18c-4.51 2-5-2-7-2"
    class={clsx('arm', started && 'animate')}
    style={`animation-duration: ${duration}ms;`}
  />
</svg>

<style>
  .arm.animate {
    animation-name: wave;
    animation-iteration-count: 3;
    animation-timing-function: linear;
    transform-origin: bottom right;
  }

  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-5deg);
    }
    75% {
      transform: rotate(6deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>
