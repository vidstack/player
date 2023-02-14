<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';

  import { ariaBool } from '$lib/utils/aria';
  import { isKeyboardClick } from '$lib/utils/keyboard';
  import { kebabToPascalCase, kebabToTitleCase } from '$lib/utils/string';

  import Icon from './Icon.svelte';

  const dispatch = createEventDispatcher();

  export let compact = false;
  export let label: string = 'Icons Collection';
  export let currentIcon: string = '';
  export let currentLib: string = '';
  export let icons: { paths: string }[] = [];
  export let filter: string[] = [];
  export let dialogId: string | null = null;
</script>

<section
  class={clsx(
    'grid gap-4 grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]',
    compact ? '768:gap-6' : '768:gap-10',
  )}
  role="listbox"
  aria-label={label}
>
  {#each filter as icon (icon)}
    <button
      class={clsx('flex flex-col items-center group justify-center cursor-pointer p-2 rounded-sm')}
      role="option"
      aria-controls={dialogId}
      aria-haspopup={dialogId ? 'dialog' : null}
      aria-label={kebabToTitleCase(icon) + ' Icon'}
      aria-selected={ariaBool(icon === currentIcon)}
      on:pointerup|stopPropagation={() => dispatch('select', { icon })}
      on:keydown={(e) => {
        if (isKeyboardClick(e)) {
          e.stopPropagation();
          dispatch('select', { icon, keyboard: true });
        }
      }}
    >
      <div
        class={clsx(
          'flex flex-col items-center justify-center text-inverse w-full border border-border',
          'hover:bg-elevate hover:border-2 group-focus:border-2 group-focus:bg-elevate',
          'h-[120px] rounded-md transition-colors duration-150',
          currentIcon === icon && 'bg-elevate border-2',
        )}
      >
        <Icon paths={icons[icon].paths} />
      </div>
      <div class="text-center text-soft text-sm mt-4 w-full">
        {currentLib === 'react' ? kebabToPascalCase(icon) + 'Icon' : icon}
      </div>
    </button>
  {/each}
</section>
