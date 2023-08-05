<script lang="ts" context="module">
  export interface SplitPaneContext {
    root: HTMLElement;
    orientation: string;
    instance: Split.Instance;
  }
</script>

<script lang="ts">
  import clsx from 'clsx';
  import Split from 'split.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { resize } from '../actions/resize';
  import { animationFrameThrottle } from '../utils/dom';

  const dispatch = createEventDispatcher<{
    init: SplitPaneContext;
    'drag-start': number[];
    'drag-end': number[];
  }>();

  export let sizes: [number, number] = [50, 50];
  export let minSize: [number, number] = [0, 0];

  let root: HTMLElement, instance: Split.Instance, orientation: 'horizontal' | 'vertical';

  function getOrientation() {
    return getComputedStyle(root).flexDirection === 'row' ? 'horizontal' : 'vertical';
  }

  onMount(() => {
    orientation = getOrientation();
    buildInstance();
    return () => instance.destroy();
  });

  function getPanes() {
    return Array.from(root.querySelectorAll('[data-pane]')) as HTMLElement[];
  }

  function buildInstance() {
    instance?.destroy();

    instance = Split(getPanes(), {
      sizes,
      direction: orientation,
      minSize,
      expandToMin: true,
      onDragStart() {
        dispatch('drag-start', sizes);
      },
      onDragEnd(sizes) {
        dispatch('drag-end', sizes);
      },
    });

    dispatch('init', { root, instance, orientation });
  }

  const onResize = animationFrameThrottle(() => {
    const newOrientation = getOrientation();
    if (orientation !== newOrientation) {
      orientation = newOrientation;
      buildInstance();
    }
  });
</script>

<div class="flex flex-col w-full h-full relative overflow-hidden">
  <slot name="top" />
  <div
    {...$$restProps}
    class={clsx('split-pane relative overflow-hidden', $$restProps.class)}
    use:resize={{
      onResize,
    }}
    bind:this={root}
  >
    <slot />
  </div>
</div>

<style>
  .split-pane :global(.gutter) {
    position: relative;
    background-repeat: no-repeat;
    background-position: 50%;
    background-color: rgb(var(--color-inverse) / 0.1);
    cursor: col-resize;
  }

  .split-pane :global(.gutter.gutter-vertical) {
    cursor: row-resize;
  }

  .split-pane :global(.gutter:after),
  .split-pane :global(.gutter:before) {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 6px;
    width: 2px;
    height: 24px;
    border-radius: 9999px;
    transform: translateY(-50%);
    background-color: rgb(var(--color-inverse) / 0.3);
  }

  .split-pane :global(.gutter.gutter-vertical:after),
  .split-pane :global(.gutter.gutter-vertical:before) {
    top: 6px;
    left: 50%;
    width: 24px;
    height: 2px;
    transform: translateX(-50%);
  }

  .split-pane :global(.gutter.gutter-vertical:before) {
    top: 2px;
  }

  .split-pane :global(.gutter:before) {
    left: 2px;
  }
</style>
