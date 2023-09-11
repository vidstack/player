<script lang="ts">
  import { DisposalBin, onPress } from '~/utils/events';
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  import { selections } from './selection-stores';

  let root: HTMLElement,
    prevOption: HTMLElement | null = null;

  export let store: keyof typeof selections;
  export let param: string | undefined;

  onMount(() => {
    setTimeout(() => {
      const options = root.querySelectorAll<HTMLElement>('[data-option]'),
        url = new URL(location.href),
        disposal = new DisposalBin();

      for (const option of options) {
        const value = option.getAttribute('data-value');
        if (!value) continue;

        if (param) {
          const isActive = url.searchParams.get(param!) === value;
          if (isActive) updateParam(option);
        }

        disposal.add(
          onPress(option, () => {
            if (param) updateParam(option);
            (selections[store] as Writable<string>).set(value);
          }),
        );
      }

      return () => disposal.dispose();
    }, 50);
  });

  function updateParam(el: HTMLElement) {
    if (!param || prevOption === el) return;

    const url = new URL(location.href),
      value = el.getAttribute('data-value')!;

    el.setAttribute('data-active', '');
    prevOption?.removeAttribute('data-active');

    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);

    prevOption = el;
  }
</script>

<div class="contents" bind:this={root}>
  <slot />
</div>
