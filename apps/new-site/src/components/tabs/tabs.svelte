<script lang="ts">
  import clsx from 'clsx';

  import { useARIATabs } from '../../aria/tabs';

  export let label: string;
  export let tabs: string[] = [];
  export let color: 'brand' | 'orange' = 'brand';

  const { tabsRoot, tabList, tab, selectedTab, tabRefs } = useARIATabs();

  $: isReady = $tabRefs.length;
  $: selectedTabWidth = isReady ? $tabRefs[$selectedTab].offsetWidth + 'px' : 0;
  $: selectedTabLeft = isReady ? $tabRefs[$selectedTab].offsetLeft + 'px' : 0;
</script>

<div class="w-full" use:tabsRoot>
  <div
    class="flex items-center relative w-full overflow-x-auto no-scrollbar p-0.5"
    use:tabList={label}
  >
    {#each tabs as title}
      <button
        class={clsx(
          'flex items-center justify-center outline-none px-6 py-2.5 mx-1 first:ml-0 last:mr-0 text-[15px] font-semibold group',
          'border-b-2 border-transparent z-10 transition-colors duration-300 text-soft rounded-sm',
          color === 'brand' && 'hocus:border-brand/30 aria-selected:text-brand',
        )}
        use:tab
      >
        {title}
      </button>
    {/each}

    <div
      class={clsx(
        'absolute top-[44px] left-0 right-0 h-0.5 w-full z-0',
        color === 'orange' && 'bg-[#f9700b]/10',
        color === 'brand' && 'bg-brand/10',
      )}
    ></div>

    <div
      class={clsx(
        'absolute top-[44px] left-0 h-0.5 duration-200 transition-[left,opacity] ease-out',
        'pointer-events-none z-20',
        isReady ? 'opacity-100' : 'opacity-0',
        color === 'orange' && 'bg-[#f9700b]',
        color === 'brand' && 'bg-brand',
      )}
      style={`width: ${selectedTabWidth}; left: ${selectedTabLeft};`}
    ></div>
  </div>

  <div class={clsx('w-full max-h-[680px] overflow-auto scrollbar scrollbar-square mt-8')}>
    <slot />
  </div>
</div>
