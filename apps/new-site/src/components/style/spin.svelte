<script lang="ts">
  import clsx from 'clsx';

  import { onMount } from 'svelte';

  import { visible } from '../../actions/visible';
  import { shuffleArray } from '../../utils/array';
  import { isAstroSlot } from '../../utils/dom';

  export let duration: number;
  export let spins: number;
  export let delay = 0;
  export let initialDelay = 0;

  let _class = '';
  export { _class as class };

  let rootRef: HTMLElement,
    doorRef: HTMLElement,
    boxesRef: HTMLElement,
    boxes: HTMLElement[] = [],
    times = 1,
    spinTimerId = -1,
    isPaused = true,
    isVisible = true;

  onMount(() => {
    const root = isAstroSlot(boxesRef.firstChild) ? boxesRef.firstChild : boxesRef;
    boxes = [...root.children].filter((e) => e.nodeType === 1) as HTMLElement[];
    boxesRef.textContent = '';

    const pool = setup();
    setTimeout(() => spin(pool), initialDelay);
  });

  function setup() {
    if (!boxesRef) return [];

    let pool = [...boxes, ...boxes, ...boxes].map((box) => box.cloneNode(true) as HTMLElement),
      prevResult = boxesRef.firstChild as HTMLElement | null;

    if (times > 1) {
      pool = shuffleArray(pool);
    }

    const boxWidth = getBoxWidth(),
      boxHeight = getBoxHeight();

    for (let i = pool.length - 1; i >= 0; i--) {
      const box = pool[i];

      Object.assign(box.style, {
        width: boxWidth + 'px',
        height: boxHeight + 'px',
        opacity: '0',
      });

      boxesRef.appendChild(box);
    }

    if (prevResult) {
      prevResult.style.opacity = '1';
      pool.unshift(prevResult);
    } else pool[pool.length - 1].style.opacity = '1';

    return pool;
  }

  function getBoxWidth() {
    const inlinePadding = parseFloat(getComputedStyle(doorRef).paddingInline) * 2;
    return doorRef.clientWidth - inlinePadding;
  }

  function getBoxHeight() {
    const blockPadding = parseFloat(getComputedStyle(doorRef).paddingBlock) * 2;
    return doorRef.clientHeight - blockPadding;
  }

  function spin(pool: HTMLElement[]) {
    setTimeout(() => {
      for (const child of pool) {
        Object.assign(child.style, {
          filter: 'blur(1px)',
          opacity: '1',
        });
      }

      isPaused = false;
      Object.assign(boxesRef.style, {
        transform: `translateY(-${getBoxHeight() * (pool.length - 1)}px)`,
        transitionDuration: `${duration}ms`,
      });
    }, delay);
  }

  function onTransitionEnd() {
    isPaused = true;
    boxesRef.style.transform = 'translateY(0px)';
    boxesRef.style.transitionDuration = '0ms';

    const children = [...boxesRef.children];
    for (let i = children.length - 2; i >= 0; i--) children[i].remove();

    const current = boxesRef.firstChild as HTMLElement;
    current.style.filter = '';

    const titlePart = rootRef.querySelector('[data-part="title"]');
    if (titlePart && current) {
      titlePart.textContent = current.getAttribute('data-title');
    }

    times++;
    nextSpin();
  }

  function nextSpin() {
    if (!isVisible || times > spins) return;
    spinTimerId = window.setTimeout(() => spin(setup()), delay);
  }

  function onVisibleChange(visible: boolean) {
    isVisible = visible;
    if (times === 1) return;
    if (visible) nextSpin();
    else window.clearTimeout(spinTimerId);
  }
</script>

<div
  class="group flex flex-col w-full"
  data-spinning={!isPaused ? '' : null}
  use:visible={{
    onChange: onVisibleChange,
  }}
  bind:this={rootRef}
>
  <div class={clsx('overflow-hidden', _class)} bind:this={doorRef}>
    <div
      class={clsx(
        'transition-transform ease-in-out w-full h-full',
        !boxesRef ? 'opacity-0' : 'opacity-100',
      )}
      on:transitionend={onTransitionEnd}
      bind:this={boxesRef}
    >
      <slot name="boxes" />
    </div>
  </div>

  <slot />
</div>
