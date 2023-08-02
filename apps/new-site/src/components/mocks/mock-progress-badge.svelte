<script lang="ts" context="module">
  function getMockProgressColor(percent: number) {
    if (percent < 50) {
      return 'bg-red-600/30 dark:bg-red-300/30';
    } else if (percent < 80) {
      return 'bg-amber-600/30 dark:bg-amber-300/30';
    } else {
      return 'bg-green-600/30 dark:bg-green-300/30';
    }
  }
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { mockEncodeProgress } from './mock-encode';

  export let index = 0;

  $: progress = $mockEncodeProgress[index] || { upload: 0, encode: 0 };
  $: isEncoding = index > 0 && progress.upload === 100;
  $: percent = isEncoding ? Math.round(progress.encode) : 0;
</script>

<div
  class={clsx(
    'text-inverse flex items-center px-1 rounded-sm text-[10px]',
    getMockProgressColor(percent),
  )}
>
  {#if isEncoding && percent < 100}
    <span class="font-medium mr-1">Encoding</span>
    <span>{percent}%</span>
  {/if}
</div>
