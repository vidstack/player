<script lang="ts" context="module">
  export type SplitPaneOrientation = 'horizontal' | 'vertical';

  export interface SplitPaneContext {
    orientation: Readable<SplitPaneOrientation>;
  }

  const CTX_KEY = Symbol();
  export function getSplitPaneContext(): SplitPaneContext {
    return getContext(CTX_KEY);
  }
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher, getContext, onMount, setContext } from 'svelte';
  import { readonly, writable, type Readable } from 'svelte/store';
  import { resize } from '../../actions/resize';
  import { animationFrameThrottle } from '../../utils/dom';
  import { IS_BROWSER } from '../../utils/env';

  const dispatch = createEventDispatcher<{
    resize: number[];
    'drag-start': number[];
    'drag-end': number[];
    'orientation-change': SplitPaneOrientation;
  }>();

  export let sizes: number[];

  let root: HTMLElement,
    orientation = writable<SplitPaneOrientation>('horizontal'),
    hasMounted = false,
    isHorizontal = true,
    dimension: 'width' | 'height' = 'width',
    isDragging = false,
    draggedGutter: HTMLElement | null = null,
    draggedGutterIndex = -1,
    dragStartEvent: PointerEvent | null = null;

  setContext<SplitPaneContext>(CTX_KEY, {
    orientation: readonly(orientation),
  });

  function getOrientation(): SplitPaneOrientation {
    return getComputedStyle(root).flexDirection === 'row' ? 'horizontal' : 'vertical';
  }

  function getPanes() {
    return [...root.querySelectorAll('[data-pane]')] as HTMLElement[];
  }

  function getGutters() {
    return [...root.querySelectorAll('[data-gutter]')] as HTMLElement[];
  }

  onMount(() => {
    $orientation = getOrientation();
    dispatch('orientation-change', $orientation);
    requestAnimationFrame(() => {
      for (const gutter of getGutters()) gutter.style.display = '';
      hasMounted = true;
    });
  });

  function getDimensionSize(el?: HTMLElement) {
    return el?.getBoundingClientRect()[dimension] || 0;
  }

  function update(newSizes: number[]) {
    newSizes = newSizes.map((size) => Math.max(0, Math.min(100, size)));

    if (!root) return newSizes;

    requestAnimationFrame(() => {
      const panes = getPanes(),
        gutters = getGutters();

      for (let i = 0; i < panes.length; i++) {
        const pane = panes[i],
          size = newSizes[i],
          prevGutterSize = getDimensionSize(gutters[i - 1]) / 2,
          nextGutterSize = getDimensionSize(gutters[i]) / 2;

        pane.style[dimension] = `calc(${size}% - ${prevGutterSize + nextGutterSize}px)`;
        pane.style[dimension === 'width' ? 'height' : 'width'] = '100%';

        if (Math.round(size) === 0) {
          pane.style.display = 'none';
        } else {
          pane.style.display = '';
        }

        newSizes[i] = size;
      }
    });

    dispatch('resize', newSizes);
    return newSizes;
  }

  function calcPointerMove(event: PointerEvent) {
    if (!dragStartEvent) return sizes;

    const newSizes = [...sizes],
      clientAxis = isHorizontal ? 'clientX' : 'clientY',
      rootSize = getDimensionSize(root),
      movedPercentage = Math.max(
        -100,
        Math.min(100, ((event[clientAxis] - dragStartEvent[clientAxis]) / rootSize) * 100),
      );

    newSizes[draggedGutterIndex] += movedPercentage;
    newSizes[draggedGutterIndex + 1] -= movedPercentage;

    return newSizes;
  }

  function setUserSelect(select: '' | 'none') {
    root.style.userSelect = select;
  }

  function onDragStart(event: PointerEvent) {
    const target = event.target as HTMLElement;
    if (isDragging || !target.hasAttribute('data-gutter')) return;
    setUserSelect('none');
    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
    draggedGutter = target;
    draggedGutterIndex = getGutters().indexOf(target);
    dragStartEvent = event;
    update(calcPointerMove(event));
    dispatch('drag-start', sizes);
    isDragging = true;
  }

  const onDrag = animationFrameThrottle((event: PointerEvent) => {
    update(calcPointerMove(event));
  });

  function onDragEnd(event: PointerEvent) {
    if (!isDragging) return;
    sizes = update(calcPointerMove(event));
    isDragging = false;
    dragStartEvent = null;
    draggedGutter = null;
    setUserSelect('');
    document.body.style.cursor = '';
    dispatch('drag-end', sizes);
  }

  const onResize = animationFrameThrottle(() => {
    $orientation = getOrientation();
  });

  function onOrientationChange() {
    dispatch('orientation-change', $orientation);
    if (IS_BROWSER) update(sizes);
  }

  $: {
    isHorizontal = $orientation === 'horizontal';
    dimension = isHorizontal ? 'width' : 'height';
    onOrientationChange();
  }

  $: if (IS_BROWSER && hasMounted) update(sizes);
</script>

<svelte:window
  on:pointermove={isDragging ? onDrag : null}
  on:pointerup={isDragging ? onDragEnd : null}
/>

<div
  {...$$restProps}
  class={clsx('relative overflow-hidden', $$restProps.class)}
  style={clsx('contain: style;', $$restProps.style)}
  on:pointerdown={onDragStart}
  use:resize={{ onResize }}
  bind:this={root}
>
  <slot />
</div>
