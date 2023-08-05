<script lang="ts">
  import AppWindowIcon from '~icons/lucide/app-window';
  import CodeIcon from '~icons/lucide/code-2';
  import SplitHorizontalIcon from '~icons/lucide/split-square-horizontal';
  import SplitVerticalIcon from '~icons/lucide/split-square-vertical';
  import clsx from 'clsx';
  import { writable } from 'svelte/store';
  import { IS_BROWSER } from '../utils/env';
  import SplitPane, { type SplitPaneContext } from './split-pane.svelte';
  import Switch from './switch.svelte';

  const PANE_TYPE_PREF_KEY = 'vidstack::code-pane-type-pref',
    PANE_SPLIT_PREF_KEY = 'vidstack::code-pane-split-pref',
    SEEN_PANE_SWITCH_KEY = 'vidstack::code-pane-switch-seen';

  let root: HTMLElement,
    orientation: string = 'horizontal',
    instance: Split.Instance,
    defaultValue = (IS_BROWSER && localStorage[PANE_TYPE_PREF_KEY]) || 'split',
    openPane = writable<'code' | 'split' | 'preview'>(defaultValue),
    userHasNotSeenPaneSwitch = !IS_BROWSER || localStorage[SEEN_PANE_SWITCH_KEY];

  function onSelect(value: string) {
    const panes = root.querySelectorAll<HTMLElement>('[data-pane]');

    switch (value) {
      case 'code':
        instance.setSizes([100, 0]);
        panes[0].style.display = '';
        panes[1].style.display = 'none';
        break;
      case 'preview':
        instance.setSizes([0, 100]);
        panes[0].style.display = 'none';
        panes[1].style.display = '';
        break;
      case 'split':
        let prefSplit = localStorage[PANE_SPLIT_PREF_KEY];
        instance.setSizes((prefSplit && JSON.parse(prefSplit)) || [50, 50]);
        for (const pane of panes) pane.style.display = '';
        break;
    }

    localStorage[PANE_TYPE_PREF_KEY] = value;

    if (value !== defaultValue) {
      userHasNotSeenPaneSwitch = true;
      localStorage[SEEN_PANE_SWITCH_KEY] = true;
    }

    openPane.set(value as any);
  }

  $: splitOptions = [
    { value: 'code', Icon: CodeIcon, iconClass: !userHasNotSeenPaneSwitch && 'animate-bounce' },
    {
      value: 'split',
      Icon: orientation === 'horizontal' ? SplitHorizontalIcon : SplitVerticalIcon,
    },
    { value: 'preview', Icon: AppWindowIcon },
  ];

  function onInit({ detail }: CustomEvent<SplitPaneContext>) {
    root = detail.root;
    orientation = detail.orientation;
    instance = detail.instance;
    onSelect(defaultValue);
  }

  function storePaneSplitPreference(sizes: number[]) {
    localStorage[PANE_SPLIT_PREF_KEY] = JSON.stringify(sizes);
  }

  function onDragStart({ detail }: CustomEvent<number[]>) {
    localStorage[PANE_TYPE_PREF_KEY] = 'split';
    storePaneSplitPreference(detail);
    openPane.set('split');
  }

  function onDragEnd({ detail }: CustomEvent<number[]>) {
    storePaneSplitPreference(detail);
  }
</script>

<SplitPane
  id="code-split-pane"
  {...$$restProps}
  on:init={onInit}
  on:drag-start={onDragStart}
  on:drag-end={onDragEnd}
>
  <div class="flex items-center w-full sticky top-0 left-0 border-b border-border" slot="top">
    <div class="flex-1"></div>

    <div class="relative">
      <Switch
        label="Editor Pane Setting"
        {defaultValue}
        value={openPane}
        options={splitOptions}
        square
        compact
        on:select={(e) => onSelect(e.detail)}
      />

      <div
        class={clsx(
          'fixed top-6 right-[78px] z-50 pointer-events-none',
          userHasNotSeenPaneSwitch && 'hidden',
        )}
      >
        <span class="relative flex h-6 w-6">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand/70"
          ></span>
        </span>
      </div>
    </div>
  </div>

  <slot />
</SplitPane>
