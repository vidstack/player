<script lang="ts">
  import clsx from 'clsx';

  export let url = '';
</script>

<div class={clsx('px-2 border-b border-border/90 flex items-center', url ? 'py-1' : 'py-2')}>
  <div class="flex items-center space-x-1">
    <div class="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full"></div>
    <div class="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full"></div>
    <div class="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
  </div>

  {#if url}
    <div class="flex flex-1 items-center justify-center">
      <div
        class="bg-inverse/10 rounded-sm flex-1 font-medium px-2 py-0.5 max-w-[160px] text-center text-xs text-soft"
      >
        {url}
      </div>
    </div>
  {/if}

  <slot />
</div>
