<script lang="ts">
  import clsx from 'clsx';
  import Split from 'split.js';
  import { onMount } from 'svelte';
  import { isAstroSlot } from '../utils/dom';

  export let sizes: [number, number] = [50, 50];
  export let minSize: [number, number] = [375, 375];

  let root: HTMLElement;

  onMount(() => {
    const children = isAstroSlot(root.firstChild) ? root.firstChild.children : root.children,
      elements = Array.from(children) as HTMLElement[],
      panes = elements.filter((el) => !el.classList.contains('gutter'));
    Split(panes, {
      sizes,
      minSize,
      expandToMin: true,
    });
  });
</script>

<div
  {...$$restProps}
  class={clsx('flex w-full flex-row split-pane', $$restProps.class)}
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

  .split-pane :global(.gutter:before) {
    left: 2px;
  }
</style>
