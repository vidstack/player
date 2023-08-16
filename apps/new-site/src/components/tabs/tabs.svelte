<script lang="ts">
  import clsx from 'clsx';
  import { useARIATabs } from '../../aria/tabs';

  export let label: string;
  export let tabs: string[] = [];

  const { tabsRoot, tabList, tab, selectedTab, tabRefs } = useARIATabs();

  $: isReady = $tabRefs.length;
  $: selectedTabWidth = isReady ? $tabRefs[$selectedTab].offsetWidth + 'px' : 0;
  $: selectedTabLeft = isReady ? $tabRefs[$selectedTab].offsetLeft + 'px' : 0;
</script>

<div use:tabsRoot>
  <div class="flex relative w-full" use:tabList={label}>
    {#each tabs as title}
      <button
        class={clsx(
          'flex items-center justify-center outline-none px-12 py-1.5 text-[15px] font-semibold group',
          'border-b-2 border-brand/10 hocus:border-brand/30 aria-selected:text-brand',
          'transition-colors duration-300',
        )}
        use:tab
      >
        {title}
      </button>
    {/each}

    <div
      class={clsx(
        'absolute top-9 left-0 bg-brand h-0.5 duration-200 transition-[left,opacity] ease-out',
        'pointer-events-none',
        isReady ? 'opacity-100' : 'opacity-0',
      )}
      style={`width: ${selectedTabWidth}; left: ${selectedTabLeft};`}
    ></div>
  </div>

  <div class={clsx('w-full max-h-[680px] overflow-auto scrollbar scrollbar-square pt-6')}>
    <slot />
  </div>
</div>
