<script lang="ts">
  import clsx from 'clsx';
  import Split from 'split.js';
  import { onMount } from 'svelte';
  import { resize } from '../actions/resize';
  import { animationFrameThrottle, isAstroSlot } from '../utils/dom';

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

  function buildInstance() {
    instance?.destroy();

    const children = isAstroSlot(root.firstChild) ? root.firstChild.children : root.children,
      elements = Array.from(children) as HTMLElement[],
      panes = elements.filter((el) => !el.classList.contains('gutter'));

    instance = Split(panes, {
      sizes,
      direction: orientation,
      minSize,
      expandToMin: true,
    });
  }

  const onResize = animationFrameThrottle(() => {
    const newOrientation = getOrientation();
    if (orientation !== newOrientation) {
      orientation = newOrientation;
      buildInstance();
    }
  });
</script>

<div
  {...$$restProps}
  class={clsx('split-pane overflow-hidden', $$restProps.class)}
  use:resize={{
    onResize,
  }}
  bind:this={root}
>
  <slot />
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
