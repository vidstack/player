<script lang="ts">
  import { onMount } from 'svelte';

  import { createFocusTrap } from '../../../aria/focus-trap';
  import { ariaBool } from '../../../utils/aria';
  import { isKeyboardPress } from '../../../utils/keyboard';
  import { isUndefined } from '../../../utils/unit';

  export let hash: string | undefined = undefined;

  const storageKey = hash ? `@vidstack/explorer::${hash}` : undefined;

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
    initFromStorage();
  });

  function initFromStorage() {
    if (!storageKey) return;

    const path = window.localStorage.getItem(storageKey);
    if (!path) return;

    if (activeItem) {
      const oldPath = activeItem.getAttribute('data-path');
      if (oldPath) togglePath(oldPath, false);
    }

    togglePath(path, true);
  }

  function togglePath(path: string, isOpen: boolean) {
    let currentPath = '/',
      folders = path.split('/').slice(0, -1);

    for (const folder of folders) {
      currentPath += folder;
      const el = root.querySelector<HTMLElement>(`[data-path="${currentPath}"]`);
      if (el) toggleFolder(el, isOpen);
    }

    const fileEl = root.querySelector<HTMLElement>(`[data-path="${path}"]`);
    if (fileEl) selectFile(fileEl);
  }

  function toggleFolder(target: HTMLElement, force?: boolean) {
    const el = target.hasAttribute('data-folder') ? target.parentElement! : target,
      expanded = el.getAttribute('aria-expanded') === 'true';
    el.setAttribute('aria-expanded', ariaBool(isUndefined(force) ? !expanded : force));
  }

  function selectFile(target: HTMLElement) {
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

    if (storageKey) {
      const path = target.getAttribute('data-path');
      if (path && !path.endsWith('.css')) window.localStorage.setItem(storageKey, path);
    }

    activeItem = target;
  }

  function onSelect(event: Event) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    if (target.hasAttribute('aria-expanded') || target.hasAttribute('data-folder')) {
      toggleFolder(target);
      return;
    }

    if (target.hasAttribute('aria-selected')) {
      selectFile(target);
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
    if (isKeyboardPress(event)) {
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
