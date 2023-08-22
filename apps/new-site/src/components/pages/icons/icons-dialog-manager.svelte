<script lang="ts" context="module">
  let iconId = 0;
</script>

<script lang="ts">
  import path from 'path';
  import clsx from 'clsx';

  import DownloadIcon from '~icons/lucide/download';

  import { onMount } from 'svelte';

  import { createAriaDialog } from '../../../aria/dialog';
  import { IS_BROWSER } from '../../../utils/env';
  import { DisposalBin, onPress } from '../../../utils/events';
  import { isKeyboardEvent } from '../../../utils/keyboard';
  import { kebabToPascalCase } from '../../../utils/string';
  import CodeSnippet from '../../code-snippet/code-snippet.svelte';
  import DialogPopup from '../../dialog-popup.svelte';
  import TabPanel from '../../tabs/tab-panel.svelte';
  import Tabs from '../../tabs/tabs.svelte';
  import { currentIconLibrary, formatIconName, getIconTypeFromSearchParams } from './shared';

  let currentIconName: string = '',
    currentIconSVGText: string = '',
    currentIconButton: HTMLElement | null = null;

  const { menuId, menu, openMenu, closeMenu, isMenuOpen, isMenuVisible } = createAriaDialog({
    onClose(event) {
      currentIconButton?.setAttribute('aria-expanded', 'false');

      const menu = document.getElementById(menuId)!;
      menu.removeAttribute('aria-describedby');

      if (isKeyboardEvent(event)) {
        currentIconButton?.focus();
      }

      currentIconName = '';
      currentIconSVGText = '';
      currentIconButton = null;
      updateIconSearchParam('');
    },
  });

  onMount(() => {
    const disposal = new DisposalBin();

    setTimeout(() => {
      const iconsGrid = document.querySelector('.icons-grid')!,
        icons = [...document.querySelectorAll<HTMLElement>('.icons-grid button[data-icon]')];

      for (const icon of icons) {
        icon.setAttribute('id', `media-icon-${++iconId}`);
        icon.setAttribute('aria-controls', menuId);
      }

      disposal.add(onPress(iconsGrid, onSelection));

      const icon = getIconTypeFromSearchParams();
      if (icon) {
        const button = document.querySelector<HTMLElement>(
          `.icons-grid button[data-icon="${icon}"]`,
        );
        // if (button) onSelectIcon(button);
      }
    }, 100);

    return () => {
      disposal.dispose();
    };
  });

  function onSelection(event: Event) {
    const target = event.target as Element,
      button = target.closest<HTMLElement>('button[data-icon]');
    if (!button) return;
    onSelectIcon(button, event);
  }

  function onSelectIcon(button: HTMLElement, event?: Event) {
    event?.stopPropagation();

    const id = button.getAttribute('id')!,
      iconName = button.getAttribute('data-icon')!,
      menu = document.getElementById(menuId)!;

    button.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-describedby', id);

    currentIconName = iconName;
    currentIconSVGText = button.querySelector('svg')!.outerHTML;
    currentIconButton = button;
    updateIconSearchParam(iconName);

    openMenu(event);
  }

  function updateIconSearchParam(iconName: string) {
    const url = new URL(location.href);
    if (iconName) url.searchParams.set('icon', iconName);
    else url.searchParams.delete('icon');
    window.history.pushState({}, '', url);
  }

  $: downloadURL = IS_BROWSER
    ? URL.createObjectURL(new Blob([currentIconSVGText], { type: 'text/plain;charset=utf-8' }))
    : '';

  export function transformSVGSnippet(code: string) {
    const paths = currentIconSVGText
      .replace(/<svg.*?\n/, '')
      .replace('\n</svg>', '')
      .trim()
      .split('<path')
      .slice(1);

    for (const path of paths) {
      // const d = path.match(/d="(.*?)"/)![1];
      // pathLines.push(line.replace('__define__', d));
    }

    return code;
  }

  function transformRawImportSnippet(code: string) {
    return code
      .replace('ICON', kebabToPascalCase(currentIconName) + 'Icon')
      .replace('__path__', `media-icons/raw/${currentIconName}.svg`);
  }

  function transformUnpluginImportSnippet(code: string) {
    return code
      .replace('ICON', kebabToPascalCase(currentIconName) + 'Icon')
      .replace('__path__', `~icons/media/${currentIconName}`);
  }

  function transformWCSnippet(code: string) {
    return code.replace('__type__', currentIconName);
  }

  function transformReactSnippet(code: string) {
    const componentName = kebabToPascalCase(currentIconName) + 'Icon';
    return code.replace(/ICON/g, componentName);
  }
</script>

<slot />

<DialogPopup
  stretch
  open={$isMenuOpen}
  visible={$isMenuVisible}
  action={menu}
  on:pointerup={closeMenu}
>
  <div class="flex flex-col px-6 pb-4" on:pointerup|stopPropagation>
    <div class="flex flex-col items-center justify-center">
      <div
        class={clsx(
          'flex flex-col items-center border border-border justify-center text-inverse',
          'w-[120px] h-[120px] rounded-sm graph-paper bg-elevate shadow-md',
        )}
      >
        <svg
          role="img"
          width="56"
          height="56"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {@html currentIconSVGText}
        </svg>
      </div>

      <h1 class="mt-4 mb-1 text-xl font-semibold text-inverse">
        {formatIconName(currentIconName, $currentIconLibrary)}
      </h1>

      <a
        class="px-4 py-2 hover:text-brand rounded-md"
        href={downloadURL}
        download={`${currentIconName}.svg`}
        aria-label="download svg"
      >
        <div class="flex flex-row items-center text-sm">
          <DownloadIcon class="mr-1.5 w-4.5 h-4.5" />
          Download
        </div>
      </a>
    </div>

    <div class="py-4 mt-2 flex justify-center">
      <Tabs label="Icon Formats" color="brand" tabs={['Component', 'SVG', 'Raw', 'Unplugin']}>
        <TabPanel>
          {#if $currentIconLibrary === 'html'}
            <CodeSnippet title="html" id="media-icons/wc" copy transform={transformWCSnippet} />
          {:else}
            <CodeSnippet
              title="jsx"
              id="media-icons/react"
              copy
              transform={transformReactSnippet}
            />
          {/if}
        </TabPanel>
        <TabPanel>
          <CodeSnippet title="html" id="media-icons/svg" copy transform={transformSVGSnippet} />
        </TabPanel>
        <TabPanel>
          <CodeSnippet
            title="js"
            id="media-icons/svg-import"
            copy
            transform={transformRawImportSnippet}
          />
        </TabPanel>
        <TabPanel>
          <CodeSnippet
            title="js"
            id="media-icons/svg-import"
            copy
            transform={transformUnpluginImportSnippet}
          />
        </TabPanel>
      </Tabs>
    </div>
  </div>
</DialogPopup>

<style>
  .graph-paper {
    --line-color-1: rgb(var(--color-border) / 0.6);
    --line-color-2: rgb(var(--color-border) / 0.6);
    background-image: conic-gradient(
        at calc(100% - 2px) calc(100% - 2px),
        var(--line-color-1) 270deg,
        #0000 0
      ),
      conic-gradient(at calc(100% - 1px) calc(100% - 1px), var(--line-color-2) 270deg, #0000 0);
    background-size:
      30px 30px,
      15px 15px;
  }
</style>
