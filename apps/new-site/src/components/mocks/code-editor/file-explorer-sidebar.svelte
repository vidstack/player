<script lang="ts">
  import clsx from 'clsx';

  import { onMount } from 'svelte';

  import AnimatedPanelIcon from '../../../icons/animated/animated-panel-icon.svelte';
  import { ariaBool } from '../../../utils/aria';
  import { IS_BROWSER } from '../../../utils/env';
  import { isKeyboardPress } from '../../../utils/keyboard';
  import { isUndefined } from '../../../utils/unit';

  const OPEN_PREF_KEY = 'vidstack::editor-sidebar-open';

  const userPrefersOpen =
    IS_BROWSER && localStorage[OPEN_PREF_KEY] && localStorage[OPEN_PREF_KEY] === 'true';

  let isOpen = userPrefersOpen;

  onMount(() => {
    if (isUndefined(localStorage[OPEN_PREF_KEY])) {
      isOpen = true;
    }
  });

  function toggle() {
    isOpen = !isOpen;
    localStorage[OPEN_PREF_KEY] = isOpen;
  }
</script>

<div
  class={clsx(
    'flex flex-col z-[60] transition-[width] duration-300 border-r border-border',
    'bg-elevate',
    isOpen ? 'w-[200px]' : 'w-[44px] justify-center',
  )}
>
  <div class="flex items-center w-full pt-2 bg-elevate">
    <span
      class={clsx(
        'font-semibold text-[11px] uppercase text-soft pl-2 transition-[width,opacity,flex]',
        !isOpen ? 'w-0 opacity-0 invisible' : 'flex-1',
      )}
    >
      Explorer
    </span>
    <button
      type="button"
      class={clsx(
        'group flex items-center rounded-sm border-0 px-2 py-1 text-soft z-10',
        'hocus:text-inverse hocus:bg-brand/10 transition-transform duration-300',
        !isOpen ? '-translate-x-1' : '-translate-x-0.5',
      )}
      aria-label="File Explorer"
      aria-pressed={ariaBool(isOpen)}
      on:pointerup={toggle}
      on:keydown={(e) => isKeyboardPress(e) && toggle()}
    >
      <AnimatedPanelIcon size={18} open={isOpen} />
    </button>
  </div>

  <div
    class={clsx(
      'flex-1 z-50 mt-1 pt-1 px-1 transition-opacity duration-300 overflow-y-auto scrollbar',
      isOpen ? 'opacity-100' : 'invisible opacity-0',
    )}
  >
    <slot />
  </div>
</div>
