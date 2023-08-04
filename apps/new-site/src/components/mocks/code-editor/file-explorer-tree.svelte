<script lang="ts">
  import { onMount } from 'svelte';
  import { createFocusTrap } from '../../../aria/focus-trap';
  import { ariaBool } from '../../../utils/aria';
  import { isKeyboardClick } from '../../../utils/keyboard';

  let root: HTMLElement,
    activeItem: HTMLElement | null = null,
    focusTrap = createFocusTrap({
      selectors: ['[role="treeitem"]'],
      onEscape() {
        root?.focus();
      },
    });

  onMount(() => {
    activeItem = root.querySelector('li[aria-selected="true"]');
  });

  function onSelect(event: Event) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    if (target.hasAttribute('aria-expanded') || target.hasAttribute('data-folder')) {
      const el = target.hasAttribute('data-folder') ? target.parentElement! : target,
        expanded = el.getAttribute('aria-expanded') === 'true';
      el.setAttribute('aria-expanded', ariaBool(!expanded));
      return;
    }

    if (target.hasAttribute('aria-selected')) {
      const prevPopupId = activeItem?.getAttribute('data-popup'),
        nextPopupId = target.getAttribute('data-popup');

      if (prevPopupId) {
        const popup = document.getElementById(prevPopupId);
        if (popup) popup.style.display = 'none';
      }

      if (nextPopupId) {
        const popup = document.getElementById(nextPopupId);
        if (popup) popup.style.display = '';
      }

      activeItem?.setAttribute('aria-selected', 'false');
      target.setAttribute('aria-selected', 'true');

      activeItem = target;
    }
  }
</script>

<ul
  class="w-full flex flex-col"
  role="tree"
  aria-label="Mock Editor File Explorer"
  tabindex="0"
  on:pointerup={onSelect}
  on:keydown={(event) => {
    if (isKeyboardClick(event)) {
      if (event.target === root) {
        focusTrap(root);
        return;
      }

      onSelect(event);
    }
  }}
  bind:this={root}
>
  <slot />
</ul>
