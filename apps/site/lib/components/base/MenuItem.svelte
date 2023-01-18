<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';

  import { wasEnterKeyPressed } from '$lib/utils/keyboard';

  const dispatch = createEventDispatcher();

  export let selected = false;

  function onSelect(event: KeyboardEvent) {
    if (wasEnterKeyPressed(event)) {
      event.stopPropagation();
      dispatch('select');
    }
  }
</script>

<li
  class={clsx(
    'duraiton-100 flex items-center px-4 py-2 text-base transition-colors hover:cursor-pointer',
    selected ? 'text-brand' : 'text-soft hover:text-inverse focus-visible:text-inverse',
  )}
  role="menuitem"
  tabindex="-1"
  on:keydown={onSelect}
  on:pointerup={() => dispatch('select')}
>
  {#if $$slots.icon}
    <div class="mr-3 h-5 w-5">
      <slot name="icon" />
    </div>
  {/if}

  <slot />
</li>
