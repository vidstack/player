import { tick } from 'svelte';
import { get, readonly, writable } from 'svelte/store';

import { ariaBool } from '../utils/aria';
import { DisposalBin, listenEvent } from '../utils/events';
import { isKeyboardClick } from '../utils/keyboard';

let globalId = 0;

export interface AriaTabsOptions {
  onSelect?(tab: number, trigger?: Event): void;
}

export function useARIATabs({ onSelect }: AriaTabsOptions = {}) {
  let selectedTab = writable(0),
    focusedTab = writable(0),
    tabRefs = writable<HTMLButtonElement[]>([]),
    panelRefs = writable<HTMLElement[]>([]);

  function getTabs(root: HTMLElement) {
    return [...root.querySelectorAll<HTMLButtonElement>('button[role="tab"]')];
  }

  function getPanels(root: HTMLElement) {
    return [...root.querySelectorAll<HTMLElement>('div[role="tabpanel"]')];
  }

  function select(index: number, trigger?: Event) {
    const currentIndex = get(selectedTab),
      prevTab = get(tabRefs)[currentIndex],
      nextTab = get(tabRefs)[index],
      prevPanel = get(panelRefs)[currentIndex],
      nextPanel = get(panelRefs)[index];

    if (prevTab) selectTab(prevTab, false);
    if (nextPanel) selectTab(nextTab, true);

    if (prevPanel) selectPanel(prevPanel, false);
    if (nextPanel) selectPanel(nextPanel, true);

    selectedTab.set(index);
    onSelect?.(index, trigger);
  }

  function selectTab(tab: HTMLButtonElement, isSelected: boolean) {
    tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    tab.setAttribute('aria-selected', ariaBool(isSelected));
  }

  function selectPanel(pane: HTMLElement, isSelected: boolean) {
    if (isSelected) pane.removeAttribute('hidden');
    else pane.setAttribute('hidden', '');
    pane.style.display = isSelected ? 'contents' : 'none';
  }

  function onKeyDown(event: KeyboardEvent) {
    const isLeft = event.key === 'ArrowLeft',
      isRight = event.key === 'ArrowRight';

    if (isLeft || isRight) {
      let tabs = get(tabRefs),
        focusedIndex = get(focusedTab);

      if (isLeft) focusedIndex--;
      else if (isRight) focusedIndex++;

      if (focusedIndex < 0) focusedIndex = tabs.length - 1;
      else if (focusedIndex >= tabs.length) focusedIndex = 0;

      const nextTab = tabs[focusedIndex];
      if (!nextTab) return;

      focusedTab.set(focusedIndex);
      nextTab.focus();
    }
  }

  return {
    selectedTab: readonly(selectedTab),
    focusedTab: readonly(focusedTab),
    tabRefs: readonly(tabRefs),
    panelRefs: readonly(panelRefs),
    selectTab: select,
    tabsRoot(el: HTMLElement) {
      const disposal = new DisposalBin();

      tick().then(() => {
        const tabs = getTabs(el),
          panels = getPanels(el);

        tabRefs.set(tabs);
        panelRefs.set(panels);

        for (let i = 0; i < tabs.length; i++) {
          const tab = tabs[i],
            panel = panels[i],
            id = ++globalId,
            tabId = `tab-${id}`,
            tabPanelId = `tab-panel-${id}`;

          tab.setAttribute('id', tabId);
          tab.setAttribute('aria-controls', tabPanelId);
          selectTab(tab, i === 0);

          disposal.add(
            listenEvent(tab, 'pointerup', (e) => select(i, e)),
            listenEvent(tab, 'keydown', (e) => isKeyboardClick(e) && select(i, e)),
          );

          if (panel) {
            panel.setAttribute('id', tabPanelId);
            panel.setAttribute('aria-labelledby', tabId);
            selectPanel(panel, i === 0);
          }
        }

        disposal.add(listenEvent(el, 'keydown', onKeyDown));
      });

      return {
        destroy() {
          disposal.dispose();
        },
      };
    },
    tabList(el: HTMLElement, label: string) {
      el.setAttribute('aria-label', label);
      el.setAttribute('role', 'tablist');
      el.setAttribute('tabindex', '-1');
    },
    tab(el: HTMLButtonElement) {
      el.setAttribute('role', 'tab');
      el.setAttribute('type', 'button');
      selectTab(el, false);
    },
    tabPanel(el: HTMLButtonElement) {
      el.setAttribute('role', 'tabpanel');
      selectPanel(el, false);
    },
  };
}
