<script context="module">
  export async function staticLoader() {
    const path = await import('node:path');
    const fs = await import('node:fs/promises');
    const iconsDir = path.resolve(process.cwd(), 'node_modules/media-icons/raw');
    const files = await fs.readdir(iconsDir);
    const { tags } = await import('./tags.js');

    const icons = {};
    for (const file of files) {
      const name = path.basename(file, path.extname(file));
      const content = await fs.readFile(path.resolve(iconsDir, file), 'utf-8');
      icons[name] = {
        paths: content
          .replace(/<svg.*?\n/, '')
          .replace('\n</svg>', '')
          .trim(),
        tags: (tags[name] || []).join('-'),
      };
    }

    return { data: { icons } };
  }
</script>

<script lang="ts">
  import uFuzzy from '@leeoniya/ufuzzy';
  import { staticData, useRouter } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import { onMount, tick } from 'svelte';
  import Transition from 'svelte-class-transition';
  import { listen } from 'svelte/internal';
  import CloseIcon from '~icons/ri/close-fill';
  import DownloadIcon from '~icons/ri/file-download-fill';

  import { focusTrap } from '$lib/actions/focus-trap';
  import MetaTags from '$lib/components/base/MetaTags.svelte';
  import Overlay from '$lib/components/base/Overlay.svelte';
  import { env } from '$lib/env';
  import Footer from '$lib/layouts/Footer.svelte';
  import MainLayout from '$lib/layouts/MainLayout.svelte';
  import { ariaBool } from '$lib/utils/aria';
  import { isKeyboardClick, isKeyboardEvent } from '$lib/utils/keyboard';
  import { hideDocumentScrollbar } from '$lib/utils/scroll';
  import { kebabToPascalCase, kebabToTitleCase } from '$lib/utils/string';

  import CodeFence from '../docs/.markdoc/@node/fence.svelte';
  import * as reactTemplate from './.code/icon.jsx?highlight';
  import * as svgImportTemplate from './.code/svg-import.js?highlight';
  import * as svgTemplate from './.code/svg.html?highlight';
  import * as wcTemplate from './.code/wc.html?highlight';
  import Icon from './Icon.svelte';

  const router = useRouter();

  let searchText = '',
    searchInput: HTMLInputElement,
    tabs = ['SVG', 'HTML', 'React'],
    currentTab = getLibFromQuery(),
    selectedIcon = getIconFromQuery(),
    closeDialogButton: HTMLButtonElement,
    isDialogOpen = false,
    menu: HTMLElement,
    menuId = 'icon-selection-menu';

  if (env.browser && selectedIcon) {
    onSelectIcon(selectedIcon, true);
  }

  onMount(() =>
    listen(document, 'keydown', (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if ((keyboardEvent.metaKey && keyboardEvent.key === 'k') || keyboardEvent.key === '/') {
        requestAnimationFrame(() => searchInput.focus());
      }
    }),
  );

  function getLibFromQuery() {
    if (!env.browser) return 'svg';
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('lib') ?? 'svg';
  }

  function getIconFromQuery() {
    if (!env.browser) return '';
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('icon') ?? '';
  }

  const search = new uFuzzy(),
    icons = Object.keys($staticData.icons),
    tags = icons.map((name) => name + '-' + $staticData.icons[name].tags);

  $: indicies = search.filter(tags, searchText.replace(/\s+/, '-'));
  $: filteredIcons = indicies.map((i) => icons[i]);

  $: svgSnippet = createSVGSnippet(selectedIcon);
  $: rawImportSnippet = createRawImportSnippet(selectedIcon);
  $: unpluginImportSnippet = createUnpluginImportSnippet(selectedIcon);
  $: wcSnippet = createWCSnippet(selectedIcon);
  $: reactSnippet = createReactSnippet(selectedIcon);
  $: downloadURL = env.browser
    ? URL.createObjectURL(new Blob([svgSnippet.code], { type: 'text/plain;charset=utf-8' }))
    : '';
  $: env.browser && hideDocumentScrollbar(isDialogOpen);

  const svgHighlight = svgTemplate.highlightedCode.split('\n');
  function createSVGSnippet(icon: string) {
    if (!icon) return { code: '', highlightedCode: '' };

    const paths = $staticData.icons[icon].paths.split('<path').slice(1);

    let pathsCode = '';
    for (const path of paths) {
      const d = path.match(/d="(.*?)"/)![1];
      pathsCode += '\n' + svgHighlight[1].replace('__define__', d);
    }

    return {
      code: svgTemplate.code.replace(
        '<path d="__define__" fill="currentColor" />',
        paths.map((path) => `<path` + path).join('  '),
      ),
      highlightedCode: svgHighlight[0] + pathsCode + '\n' + svgHighlight.slice(2).join(''),
    };
  }

  function createRawImportSnippet(icon: string) {
    if (!icon) return { code: '', highlightedCode: '' };

    const replace = (code: string) =>
      code
        .replace('ICON', kebabToPascalCase(icon) + 'Icon')
        .replace('__path__', `media-icons/raw/${icon}.svg`);

    return {
      code: replace(svgImportTemplate.code),
      highlightedCode: replace(svgImportTemplate.highlightedCode),
    };
  }

  function createUnpluginImportSnippet(icon: string) {
    if (!icon) return { code: '', highlightedCode: '' };

    const replace = (code: string) =>
      code
        .replace('ICON', kebabToPascalCase(icon) + 'Icon')
        .replace('__path__', `~icons/media/${icon}`);

    return {
      code: replace(svgImportTemplate.code),
      highlightedCode: replace(svgImportTemplate.highlightedCode),
    };
  }

  function createWCSnippet(icon: string) {
    const replace = (code: string) => code.replace('__type__', icon);
    return {
      code: replace(wcTemplate.code),
      highlightedCode: replace(wcTemplate.highlightedCode),
    };
  }

  function createReactSnippet(icon: string) {
    const reactName = kebabToPascalCase(icon) + 'Icon';
    const replace = (code: string) => code.replace(/ICON/g, reactName);
    return {
      code: replace(reactTemplate.code),
      highlightedCode: replace(reactTemplate.highlightedCode),
    };
  }

  function onSelectIcon(icon: string, keyboard?: boolean) {
    updateSearchParams((params) => params.set('icon', icon));
    selectedIcon = icon;
    isDialogOpen = true;
    if (keyboard) {
      tick().then(() => {
        closeDialogButton.focus();
      });
    }
  }

  function onCloseDialog(keyboard?: boolean) {
    isDialogOpen = false;

    if (keyboard) {
      const button = document.querySelector(
        `[role="option"][aria-label="${kebabToTitleCase(selectedIcon) + ' Icon'}"]`,
      ) as HTMLButtonElement | null;
      button?.focus();
    }

    tick().then(() => {
      selectedIcon = '';
      updateSearchParams((params) => params.delete('icon'));
    });
  }

  function onSelectTab(tab: string) {
    currentTab = tab;
    updateSearchParams((params) => params.set('lib', tab));
  }

  function updateSearchParams(callback: (params: URLSearchParams) => void) {
    const url = new URL(location.href);
    callback(url.searchParams);
    router.go(url, { replace: true, keepfocus: true, scroll: () => false });
  }
</script>

<MetaTags
  title="Vidstack: Media Icons"
  description="A beautifully hand-crafted collection of icons specifically designed for media interfaces."
/>

<svelte:window
  on:pointerup={() => onCloseDialog()}
  on:keydown={(e) => {
    if (isKeyboardClick(e) || e.key === 'Escape') onCloseDialog(true);
  }}
/>

<MainLayout --navbar-border-bottom="none" --main-padding-x="none" --main-overflow-x="hidden">
  <section class="px-4 768:px-12 text-center w-full" aria-label="Hero">
    <h1
      class="992:mt-6 768:text-5xl 768:leading-[3.5rem] 768:max-w-3xl mx-auto 992:text-6xl 992:leading-[4.5rem] 992:max-w-5xl mt-8 text-center text-4xl font-extrabold leading-[3rem]"
    >
      A bold, consistent, and clean collection of media icons
    </h1>
    <p
      class="text-soft 992:text-lg 576:text-xl mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed"
    >
      Media Icons is an open-source and beautifully hand-crafted collection of icons, designed by
      the Vidstack team specifically for building audio and video players. All of the icons are free
      for both personal and commercial use.
    </p>
    <div class="flex flex-row items-center justify-center w-full mt-6 text-soft">
      <a
        class="flex items-center hover:underline hover:text-brand"
        href="https://www.figma.com/@vidstack"
        target="_blank"
        rel="noreferrer"
      >
        <svg
          class="mr-px"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M13.9996 14.7147C13.9996 13.8896 14.3273 13.0982 14.9108 12.5148C15.4942 11.9313 16.2856 11.6036 17.1107 11.6036C17.9358 11.6036 18.7271 11.9313 19.3106 12.5148C19.894 13.0982 20.2218 13.8896 20.2218 14.7147C20.2218 15.5398 19.894 16.3311 19.3106 16.9146C18.7271 17.498 17.9358 17.8258 17.1107 17.8258C16.2856 17.8258 15.4942 17.498 14.9108 16.9146C14.3273 16.3311 13.9996 15.5398 13.9996 14.7147Z"
            fill="#1ABCFE"
          />
          <path
            d="M7.77734 20.9369C7.77734 20.1118 8.10512 19.3205 8.68857 18.737C9.27201 18.1536 10.0633 17.8258 10.8885 17.8258H13.9996V20.9369C13.9996 21.762 13.6718 22.5533 13.0883 23.1368C12.5049 23.7202 11.7136 24.048 10.8885 24.048C10.0633 24.048 9.27201 23.7202 8.68857 23.1368C8.10512 22.5533 7.77734 21.762 7.77734 20.9369Z"
            fill="#0ACF83"
          />
          <path
            d="M13.9996 5.38135V11.6036H17.1107C17.9358 11.6036 18.7271 11.2758 19.3106 10.6923C19.894 10.1089 20.2218 9.31758 20.2218 8.49246C20.2218 7.66734 19.894 6.87602 19.3106 6.29257C18.7271 5.70912 17.9358 5.38135 17.1107 5.38135H13.9996Z"
            fill="#FF7262"
          />
          <path
            d="M7.77734 8.49246C7.77734 9.31758 8.10512 10.1089 8.68857 10.6923C9.27201 11.2758 10.0633 11.6036 10.8885 11.6036H13.9996V5.38135H10.8885C10.0633 5.38135 9.27201 5.70912 8.68857 6.29257C8.10512 6.87602 7.77734 7.66734 7.77734 8.49246Z"
            fill="#F24E1E"
          />
          <path
            d="M7.77734 14.7147C7.77734 15.5398 8.10512 16.3311 8.68857 16.9146C9.27201 17.498 10.0633 17.8258 10.8885 17.8258H13.9996V11.6036H10.8885C10.0633 11.6036 9.27201 11.9313 8.68857 12.5148C8.10512 13.0982 7.77734 13.8896 7.77734 14.7147Z"
            fill="#A259FF"
          />
        </svg>
        Get Figma File
      </a>
      <a
        class="flex items-center hover:underline ml-6 hover:text-brand"
        href="https://github.com/vidstack/player/blob/main/packages/icons/README.md"
        target="_blank"
        rel="noreferrer"
      >
        <svg
          class="text-inverse mr-1.5"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0.666017 9.94515C0.666017 4.78848 4.84269 0.611816 9.99935 0.611816C15.156 0.611816 19.3327 4.78848 19.3327 9.94515C19.3322 11.9006 18.7184 13.8066 17.5779 15.395C16.4374 16.9834 14.8275 18.1742 12.9748 18.7997C12.5082 18.893 12.3327 18.6018 12.3327 18.3573C12.3327 18.2517 12.334 18.0692 12.3358 17.8262C12.3394 17.3431 12.3448 16.621 12.3448 15.7906C12.3448 15.0798 12.1522 14.5769 11.899 14.2571C11.8357 14.1773 11.8791 14.0448 11.98 14.031C13.9729 13.7582 15.9727 12.8851 15.9727 9.45515C15.9727 8.45681 15.6303 7.64645 15.0647 7.00176C15.0352 6.96817 15.0266 6.92151 15.0417 6.87945C15.1537 6.56687 15.389 5.6829 14.9427 4.52496C14.9303 4.4928 14.904 4.46803 14.87 4.46253C14.6698 4.43019 13.891 4.39756 12.4018 5.39873C12.3732 5.41794 12.3369 5.42426 12.3037 5.41516C11.5723 5.21486 10.7975 5.11515 10.0227 5.11515C9.25209 5.11364 8.48482 5.21497 7.74118 5.4164C7.70826 5.42532 7.6723 5.41909 7.64391 5.40019C6.15703 4.41004 5.37881 4.43247 5.17664 4.46215C5.14194 4.46724 5.11488 4.49228 5.10228 4.52501C4.65655 5.68246 4.89172 6.56602 5.00368 6.87851C5.01875 6.92057 5.01014 6.96723 4.98068 7.00084C4.41426 7.64697 4.07269 8.46765 4.07269 9.45515C4.07269 12.8741 6.06298 13.7575 8.05549 14.0311C8.15617 14.0449 8.19958 14.1768 8.13658 14.2565C7.95395 14.4876 7.80152 14.815 7.73322 15.2481C7.72698 15.2877 7.70204 15.322 7.66523 15.3378C7.09557 15.5817 5.81686 15.904 5.00602 14.5418C4.83055 14.2618 4.30602 13.573 3.57055 13.5851C2.78935 13.5963 3.25602 14.0285 3.58268 14.203C3.97935 14.4251 4.43389 15.253 4.53935 15.5218C4.72227 16.0367 5.30846 17.0105 7.5379 16.6428C7.60983 16.631 7.67721 16.6857 7.67734 16.7586C7.67815 17.2179 7.68272 17.6507 7.68598 17.9598C7.68789 18.1409 7.68935 18.2796 7.68935 18.3563C7.68935 18.6003 7.517 18.8783 7.0569 18.8021C7.05118 18.8012 7.04538 18.7997 7.03988 18.7979C5.18429 18.1784 3.57036 16.9911 2.42649 15.4039C1.28091 13.8144 0.66496 11.9045 0.666017 9.94515Z"
            fill="currentColor"
          />
        </svg>

        Documentation
      </a>
    </div>
  </section>

  <section class="my-20 px-4 768:px-12 max-w-[1440px] mx-auto" aria-label="Icons Collection">
    <div class="relative flex-auto group max-w-xl mx-auto">
      <input
        class="border-b-2 font-base text-base placeholder:text-slate border-border w-full p-2 pl-8 block appearance-none"
        type="search"
        placeholder="Search all icons..."
        bind:value={searchText}
        bind:this={searchInput}
        style="background: none;"
      />
      <svg
        class="pointer-events-none absolute inset-y-0 left-1 h-full w-5 text-border group-focus-within:text-brand transition-colors duration-300 -mt-px"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.1293 13.4711C11.0947 13.4365 11.0402 13.4321 11.0001 13.4601C9.86626 14.251 8.4873 14.7148 7 14.7148C3.13401 14.7148 0 11.5808 0 7.71484C0 3.84885 3.13401 0.714844 7 0.714844C10.866 0.714844 14 3.84885 14 7.71484C14 9.20245 13.536 10.5817 12.7447 11.7157C12.7167 11.7558 12.7212 11.8103 12.7558 11.8449L15.6463 14.7354C15.8416 14.9307 15.8416 15.2472 15.6463 15.4425L14.7271 16.3617C14.5318 16.557 14.2152 16.557 14.0199 16.3617L11.1293 13.4711ZM11.7012 7.71484C11.7012 10.3107 9.59682 12.415 7.00098 12.415C4.40513 12.415 2.30078 10.3107 2.30078 7.71484C2.30078 5.119 4.40513 3.01465 7.00098 3.01465C9.59682 3.01465 11.7012 5.119 11.7012 7.71484Z"
          fill="currentColor"
        />
      </svg>
      <div
        class="w-6 h-6 font-mono text-sm font-bold border border-border bg-elevate text-inverse flex items-center justify-center absolute right-1 top-2 rounded-sm"
      >
        /
      </div>
    </div>

    <div
      class="grid gap-4 768:gap-10 mt-12 grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]"
      role="listbox"
    >
      {#each filteredIcons as icon (icon)}
        <button
          class={clsx(
            'flex flex-col items-center group justify-center cursor-pointer p-2 rounded-sm',
          )}
          role="option"
          aria-controls={menuId}
          aria-haspopup="dialog"
          aria-label={kebabToTitleCase(icon) + ' Icon'}
          aria-selected={ariaBool(icon === selectedIcon)}
          on:pointerup|stopPropagation={() => onSelectIcon(icon)}
          on:keydown={(e) => {
            if (isKeyboardClick(e)) {
              e.stopPropagation();
              onSelectIcon(icon, true);
            }
          }}
        >
          <div
            class={clsx(
              'flex flex-col items-center justify-center text-inverse w-full border border-border',
              'hover:bg-elevate hover:border-2 group-focus:border-2 group-focus:bg-elevate',
              'h-[120px] rounded-md transition-colors duration-150',
              selectedIcon === icon && 'bg-elevate border-2',
            )}
          >
            <Icon paths={$staticData.icons[icon].paths} />
          </div>
          <div class="text-center text-soft text-sm mt-4 w-full">
            {currentTab === 'react' ? kebabToPascalCase(icon) + 'Icon' : icon}
          </div>
        </button>
      {/each}
    </div>
  </section>

  <Overlay open={isDialogOpen} />

  <Transition
    toggle={isDialogOpen}
    transitions="transition"
    inTransition="ease-out duration-0"
    inState="opacity-0"
    onState="opacity-100"
    outTransition="ease-in duration-75"
  >
    <div class="fixed inset-0 w-full h-full pointer-events-none z-50">
      <div class="flex w-full h-full items-center justify-center pointer-events-none">
        <ul
          id={menuId}
          class="bg-body mt-2 rounded-md border-border border pointer-events-auto max-w-[90vw] min-h-[70vh] max-h-[90vh] overflow-auto scrollbar relative"
          role="menu"
          tabindex="-1"
          aria-orientation="vertical"
          aria-hidden={ariaBool(!isDialogOpen)}
          bind:this={menu}
          on:pointerup|stopPropagation
          on:keydown={(e) => {
            if (e.key !== 'Escape') e.stopPropagation();
            else onCloseDialog(true);
          }}
          use:focusTrap
        >
          <div
            class="z-20 flex items-center justify-end sticky top-0 left-0 right-0 w-full bg-body blur-bg"
          >
            <button
              class={clsx(
                'text-soft hover:text-inverse p-4 rounded-md mt-[0.125rem] mr-[0.125rem]',
                !open && 'pointer-events-none',
              )}
              on:pointerup={() => onCloseDialog()}
              on:keydown={(e) => isKeyboardClick(e) && onCloseDialog(true)}
              bind:this={closeDialogButton}
            >
              <CloseIcon width="28" height="28" />
              <span class="sr-only">Close</span>
            </button>
          </div>

          <div class="flex flex-col prose dark:prose-invert docs px-6 pb-4">
            <div class="flex flex-col items-center justify-center not-prose">
              <div
                class="flex flex-col items-center border border-border justify-center text-inverse w-[120px] h-[120px] graph-paper bg-elevate"
              >
                {#if selectedIcon}
                  <Icon width="64" height="64" paths={$staticData.icons[selectedIcon].paths} />
                {/if}
              </div>
              <h1 class="mt-4 mb-2 text-xl font-medium text-inverse">
                {currentTab === 'react' ? kebabToPascalCase(selectedIcon) + 'Icon' : selectedIcon}
              </h1>
              <a
                class="px-4 py-2 hover:text-brand rounded-md"
                href={downloadURL}
                download={`${selectedIcon}.svg`}
                aria-label="download svg"
              >
                <div class="flex flex-row items-center text-sm">
                  <DownloadIcon class="mr-1" width="18" height="18" />
                  Download
                </div>
              </a>
            </div>

            <div class="tabbed-links mt-8 mb-4 -ml-1 flex w-full p-1">
              <div class="min-w-full flex-none p-1 max-w-full overflow-x-auto scrollbar">
                <ul
                  class="m-0 p-0 border-border flex space-x-5 whitespace-nowrap border-b"
                  role="tablist"
                >
                  {#each tabs as tab (tab)}
                    {@const id = tab.toLowerCase().replace(/\s/g, '-')}
                    <li
                      tabindex="0"
                      class={clsx(
                        '-mb-px flex font-medium cursor-pointer px-4 pt-3 pb-2.5 leading-6 hover:border-b-2 select-none',
                        currentTab === id
                          ? 'text-brand border-brand border-b-2 '
                          : 'border-inverse',
                        currentTab !== id && 'text-soft hover:text-inverse',
                      )}
                      id="${id}-tab"
                      role="tab"
                      aria-selected={ariaBool(currentTab === id)}
                      aria-controls={`${id}-panel`}
                      on:pointerup={() => onSelectTab(id)}
                      on:keydown={(e) => isKeyboardClick(e) && onSelectTab(id)}
                    >
                      {tab}
                    </li>
                  {/each}
                </ul>
              </div>
            </div>

            <div class="py-4">
              <div
                id="svg-panel"
                role="tabpanel"
                aria-labelledby="svg-tab"
                aria-hidden={ariaBool(currentTab !== 'svg')}
                class={clsx(currentTab !== 'svg' && 'hidden')}
              >
                <div class="max-w-3xl">
                  <div>
                    <h2 class="font-medium m-0 p-0 text-base mb-4">Code</h2>
                    <CodeFence lang="html" {...svgSnippet} copy />
                  </div>
                  <div class="mt-4">
                    <h2 class="font-medium m-0 p-0 text-base mb-4">Raw Import</h2>
                    <CodeFence lang="js" {...rawImportSnippet} copy />
                  </div>
                  <div class="mt-4">
                    <h2 class="font-medium m-0 p-0 text-base mb-4">Unplugin Import</h2>
                    <CodeFence lang="js" {...unpluginImportSnippet} copy />
                  </div>
                </div>
              </div>

              <div
                id="html-panel"
                role="tabpanel"
                aria-labelledby="html-tab"
                aria-hidden={ariaBool(currentTab !== 'html')}
                class={clsx(currentTab !== 'html' && 'hidden')}
              >
                <CodeFence lang="html" {...wcSnippet} copy />
                <p>
                  Follow the
                  <a href="/docs/player/getting-started/installation">installation</a>
                  guide to use this component.
                </p>
              </div>

              <div
                id="react-panel"
                role="tabpanel"
                aria-labelledby="react-tab"
                aria-hidden={ariaBool(currentTab !== 'react')}
                class={clsx(currentTab !== 'react' && 'hidden')}
              >
                <CodeFence lang="jsx" {...reactSnippet} copyHighlight highlight="3" />
                <p>
                  Follow the
                  <a href="/docs/react/player/getting-started/installation">installation</a>
                  guide to use this component.
                </p>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  </Transition>

  <Footer slot="after-main" />
</MainLayout>

<style>
  .graph-paper {
    --line-color-1: rgb(var(--color-border) / 0.6);
    --line-color-2: rgb(var(--color-border) / 0.4);
    background-image: conic-gradient(
        at calc(100% - 2px) calc(100% - 2px),
        var(--line-color-1) 270deg,
        #0000 0
      ),
      conic-gradient(at calc(100% - 1px) calc(100% - 1px), var(--line-color-2) 270deg, #0000 0);
    background-size: 30px 30px, 15px 15px;
  }

  .docs :global(.code-fence) {
    margin: 0;
  }

  div[role='tabpanel'][aria-hidden='true'] :global(*) {
    display: none;
  }
</style>
