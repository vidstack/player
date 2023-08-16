<script lang="ts" context="module">
  export type CodePane = 'code' | 'split' | 'preview';
</script>

<script lang="ts">
  import clsx from 'clsx';
  import AppWindowIcon from '~icons/lucide/app-window';
  import CodeIcon from '~icons/lucide/code-2';
  import SplitHorizontalIcon from '~icons/lucide/split-square-horizontal';
  import SplitVerticalIcon from '~icons/lucide/split-square-vertical';
  import { writable } from 'svelte/store';
  import { IS_BROWSER } from '../../utils/env';
  import Switch from '../switch.svelte';
  import SplitPaneGutter from './split-pane-gutter.svelte';
  import SplitPane, { type SplitPaneOrientation } from './split-pane.svelte';

  const PANE_TYPE_PREF_KEY = 'vidstack::code-pane-type-pref',
    PANE_SPLIT_PREF_KEY = 'vidstack::code-pane-split-pref',
    SEEN_PANE_SWITCH_KEY = 'vidstack::code-pane-switch-seen';

  let orientation: string = 'horizontal',
    defaultPaneType = (IS_BROWSER && localStorage[PANE_TYPE_PREF_KEY]) || 'split',
    sizes: number[] = [35, 65],
    openPane = writable<CodePane>(defaultPaneType),
    userHasNotSeenPaneSwitch = !IS_BROWSER || localStorage[SEEN_PANE_SWITCH_KEY];

  if (defaultPaneType === 'code') {
    sizes = [100, 0];
  } else if (defaultPaneType === 'preview') {
    sizes = [0, 100];
  } else if (IS_BROWSER && localStorage[PANE_SPLIT_PREF_KEY]) {
    sizes = JSON.parse(localStorage[PANE_SPLIT_PREF_KEY]);
  }

  function onSelect(value: string) {
    switch (value) {
      case 'code':
        sizes = [100, 0];
        break;
      case 'preview':
        sizes = [0, 100];
        break;
      case 'split':
        sizes = [50, 50];
        storePaneSplitPreference([50, 50]);
        break;
    }

    localStorage[PANE_TYPE_PREF_KEY] = value;

    if (value !== defaultPaneType) {
      userHasNotSeenPaneSwitch = true;
      localStorage[SEEN_PANE_SWITCH_KEY] = true;
    }

    openPane.set(value as CodePane);
  }

  $: splitOptions = [
    { value: 'code', Icon: CodeIcon, iconClass: !userHasNotSeenPaneSwitch && 'animate-bounce' },
    {
      value: 'split',
      Icon: orientation === 'horizontal' ? SplitHorizontalIcon : SplitVerticalIcon,
    },
    { value: 'preview', Icon: AppWindowIcon },
  ];

  function storePaneSplitPreference(sizes: number[]) {
    localStorage[PANE_SPLIT_PREF_KEY] = JSON.stringify(sizes);
  }

  function onOrientationChange({ detail }: CustomEvent<SplitPaneOrientation>) {
    orientation = detail;
  }

  function onDragStart({ detail }: CustomEvent<number[]>) {
    localStorage[PANE_TYPE_PREF_KEY] = 'split';
    storePaneSplitPreference(detail);
    openPane.set('split');
  }

  function onDragEnd({ detail }: CustomEvent<number[]>) {
    storePaneSplitPreference(detail);
    if (detail[0] === 0) openPane.set('preview');
    else if (detail[0] === 100) openPane.set('code');
  }
</script>

<div
  class="flex flex-col w-full h-full relative overflow-hidden"
  style={clsx(orientation === 'vertical' && '--code-block-gutters: 10px;')}
>
  <!-- Top Bar -->
  <div class="flex items-center w-full sticky top-0 left-0 border-b border-border">
    <div class="flex-1"></div>

    <div class="relative">
      <Switch
        label="Editor Pane Setting"
        defaultValue={defaultPaneType}
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

  <SplitPane
    {...$$restProps}
    {sizes}
    on:drag-start={onDragStart}
    on:drag-end={onDragEnd}
    on:orientation-change={onOrientationChange}
  >
    <slot name="left" />
    <SplitPaneGutter />
    <slot name="right" />
  </SplitPane>
</div>
