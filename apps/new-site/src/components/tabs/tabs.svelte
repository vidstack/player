<script lang="ts">
  import clsx from 'clsx';
  import { useARIATabs } from '../../aria/tabs';

  export let label: string;
  export let tabs: string[] = [];
  export let color: 'orange';

  const { tabsRoot, tabList, tab, selectedTab, tabRefs } = useARIATabs();

  $: isReady = $tabRefs.length;
  $: selectedTabWidth = isReady ? $tabRefs[$selectedTab].offsetWidth + 'px' : 0;
  $: selectedTabLeft = isReady ? $tabRefs[$selectedTab].offsetLeft + 'px' : 0;
</script>

<div use:tabsRoot>
  <div class="flex relative w-full justify-center" use:tabList={label}>
    {#each tabs as title}
      <button
        class={clsx(
          'flex items-center justify-center outline-none px-12 py-1.5 text-[15px] font-semibold group',
          'border-b-2',
          'transition-colors duration-300',
          color === 'orange' &&
            'border-[#f9700b]/10 hocus:border-[#f9700b]/30 aria-selected:text-[#f9700b]',
        )}
        use:tab
      >
        {title}
      </button>
    {/each}

    <div
      class={clsx(
        'absolute top-[34px] left-0 h-0.5 duration-200 transition-[left,opacity] ease-out',
        'pointer-events-none',
        isReady ? 'opacity-100' : 'opacity-0',
        color === 'orange' && 'bg-[#f9700b]',
      )}
      style={`width: ${selectedTabWidth}; left: ${selectedTabLeft};`}
    ></div>
  </div>

  <div class={clsx('w-full max-h-[680px] overflow-auto scrollbar scrollbar-square mt-8')}>
    <slot />
  </div>
</div>
