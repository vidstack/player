<script lang="ts">
  import clsx from 'clsx';
  import { getSplitPaneContext } from './split-pane.svelte';

  const { orientation } = getSplitPaneContext();
</script>

<div
  class={clsx(
    'flex bg-inverse/10 flex-col justify-center shrink-0',
    $orientation === 'horizontal'
      ? 'cursor-col-resize w-2.5 h-full'
      : 'cursor-row-resize w-full h-2.5',
  )}
  data-gutter
  style="display: none;"
>
  <div
    class={clsx(
      'flex items-center justify-center pointer-events-none',
      $orientation === 'horizontal' ? 'w-full' : 'h-full flex-col',
    )}
  >
    <div
      class={clsx(
        'rounded-full bg-inverse/30',
        $orientation === 'horizontal' ? 'w-0.5 h-6' : 'w-6 h-0.5',
      )}
    ></div>
    <div
      class={clsx(
        'rounded-full bg-inverse/30',
        $orientation === 'horizontal' ? 'w-0.5 h-6 ml-0.5' : 'w-6 h-0.5 mt-0.5',
      )}
    ></div>
  </div>
</div>
