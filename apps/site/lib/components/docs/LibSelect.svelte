<script lang="ts">
  import { useRouter } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-line';

  import { addJSLibToPath, currentJSLibTitle, jsLib, type JSLibType } from '$lib/stores/js-lib';

  let value = $currentJSLibTitle;

  const router = useRouter();

  function onChange() {
    $jsLib = value.toLowerCase() as JSLibType;
    router.go(new URL(addJSLibToPath(location.href, $jsLib)));
  }

  $: value = $currentJSLibTitle;
</script>

<label
  class={clsx(
    'relative flex items-center justify-center pl-2 pr-0.5 border-[1.5px] rounded-md border-indigo-500 dark:border-indigo-400 py-px',
    'font-medium text-indigo-600 bg-indigo-500/20 dark:bg-indigo-400/20 dark:text-indigo-400 ml-2',
  )}
>
  <div class="flex w-full items-center h-full justify-center">
    <span class="sr-only">JS Library</span>

    <span class="h-full items-center text-[12px]">
      {value}
    </span>

    <ArrowDropDownIcon width="20" height="20" class="pointer-events-none -ml-px" />
  </div>

  <select
    class="absolute inset-0 cursor-pointer appearance-none px-4 py-6 opacity-0"
    bind:value
    on:change={onChange}
  >
    <option>HTML</option>
    <option>React</option>
  </select>
</label>
