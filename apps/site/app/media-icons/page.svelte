<script context="module">
  export async function staticLoader() {
    const path = await import('node:path');
    const fs = await import('node:fs/promises');
    const iconsDir = path.resolve(process.cwd(), 'node_modules/media-icons/raw');
    const files = await fs.readdir(iconsDir);
    const { tags } = await import('./tags.js');
    const ignore = new Set(['.DS_Store']);

    const icons = {};
    for (const file of files) {
      const name = path.basename(file, path.extname(file));
      if (ignore.has(name)) continue;
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
  import DownloadIcon from '~icons/ri/file-download-fill';

  import { focusTrap } from '$lib/actions/focus-trap';
  import MetaTags from '$lib/components/base/MetaTags.svelte';
  import Overlay from '$lib/components/base/Overlay.svelte';
  import SearchInput from '$lib/components/base/SearchInput.svelte';
  import Select from '$lib/components/base/Select.svelte';
  import { env } from '$lib/env';
  import Footer from '$lib/layouts/Footer.svelte';
  import MainLayout from '$lib/layouts/MainLayout.svelte';
  import { ariaBool } from '$lib/utils/aria';
  import { isKeyboardClick } from '$lib/utils/keyboard';
  import { hideDocumentScrollbar } from '$lib/utils/scroll';
  import { kebabToPascalCase, kebabToTitleCase, lowercaseFirstLetter } from '$lib/utils/string';

  import CodeFence from '../docs/.markdoc/@node/fence.svelte';
  import reactTemplate from './.code/icon.jsx?highlight';
  import svgImportTemplate from './.code/svg-import.js?highlight';
  import svgTemplate from './.code/svg.html?highlight';
  import wcTemplate from './.code/wc.html?highlight';
  import Icon from './Icon.svelte';
  import IconGrid from './IconGrid.svelte';

  const router = useRouter();

  let searchText = '',
    libs = ['SVG', 'HTML', 'React'],
    currentLib = getLibFromQuery(),
    currentIcon = getIconFromQuery(),
    prevIcons: string[] = [],
    closeDialogButton: HTMLButtonElement,
    isDialogOpen = false,
    dialog: HTMLElement,
    dialogId = 'icon-preview-dialog';

  if (env.browser && currentIcon) {
    onSelectIcon({
      icon: currentIcon,
      keyboard: true,
    });
  }

  onMount(() => {
    const off = router.afterNavigate(() => {
      currentLib = getLibFromQuery();
      currentIcon = getIconFromQuery();
      off();
    });
  });

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

  const fuzzy = new uFuzzy(),
    icons = Object.keys($staticData.icons),
    tags = icons.map((name) => name + '-' + $staticData.icons[name].tags);

  $: indicies = fuzzy.filter(tags, normalizeSearchText(searchText));
  $: filteredIcons = indicies?.map((i) => icons[i]) || icons;

  $: currentTags = [
    ...currentIcon.split('-'),
    ...($staticData.icons[currentIcon]?.tags.split('-') || []),
  ];
  $: relatedIndicies = Array.from(
    new Set(
      currentTags.flatMap((searchTag) =>
        Object.keys(tags).filter((i) => tags[i].includes(searchTag)),
      ),
    ),
  );
  $: relatedIcons = relatedIndicies.map((i) => icons[i]).filter((i) => i !== currentIcon);

  $: svgSnippet = createSVGSnippet(currentIcon);
  $: rawImportSnippet = createRawImportSnippet(currentIcon);
  $: unpluginImportSnippet = createUnpluginImportSnippet(currentIcon);
  $: wcSnippet = createWCSnippet(currentIcon);
  $: reactSnippet = createReactSnippet(currentIcon);

  $: downloadURL = env.browser
    ? URL.createObjectURL(new Blob([svgSnippet.code], { type: 'text/plain;charset=utf-8' }))
    : '';

  $: env.browser && hideDocumentScrollbar(isDialogOpen);

  onMount(() => {
    if (isDialogOpen) hideDocumentScrollbar(true);
  });

  const upperCharRE = /[A-Z]/g;
  function normalizeSearchText(text: string) {
    return lowercaseFirstLetter(text.replace(/\s+/, '-')).replace(
      upperCharRE,
      (x) => '-' + x.toLowerCase(),
    );
  }

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

  function onSelectIcon(detail: { icon: string; keyboard?: boolean }) {
    const { icon, keyboard } = detail;
    updateSearchParams((params) => params.set('icon', icon));
    prevIcons = [...prevIcons, currentIcon];
    currentIcon = icon;
    isDialogOpen = true;
    tick().then(() => {
      dialog?.scrollTo(0, 0);
    });
    if (keyboard) {
      tick().then(() => {
        closeDialogButton.focus();
      });
    }
  }

  function onSelectPreviousIcon(keyboard?: boolean) {
    currentIcon = prevIcons.pop() ?? currentIcon;
    if (keyboard) {
      tick().then(() => {
        closeDialogButton.focus();
      });
    }
  }

  function onCloseDialog(keyboard?: boolean) {
    isDialogOpen = false;
    prevIcons = [];

    if (keyboard) {
      const button = document.querySelector(
        `[role="option"][aria-label="${kebabToTitleCase(currentIcon) + ' Icon'}"]`,
      ) as HTMLButtonElement | null;
      button?.focus();
    }

    tick().then(() => {
      currentIcon = '';
      updateSearchParams((params) => params.delete('icon'));
    });
  }

  function onSelectLibrary(event: Event) {
    currentLib = (event.target as HTMLSelectElement).value.toLowerCase();
    updateSearchParams((params) => params.set('lib', currentLib));
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
        href="https://github.com/vidstack/media-icons"
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

  <div class="mb-24 px-4 768:px-12 max-w-[1440px] mx-auto">
    <section
      class="my-16 992:my-20 flex items-center justify-center max-w-xl mx-auto"
      aria-label="Search"
    >
      <div class="mr-4 mt-2">
        <Select
          title="Preferred SVG Library"
          block
          options={libs}
          value={libs.find((lib) => lib.toLowerCase() === currentLib)}
          on:change={onSelectLibrary}
        />
      </div>
      <SearchInput
        placeholder="Search all icons..."
        shortcutKey="k"
        shortcutSlash
        bind:value={searchText}
      />
    </section>

    <IconGrid
      {currentIcon}
      {currentLib}
      {dialogId}
      icons={$staticData.icons}
      filter={filteredIcons}
      on:select={(e) => onSelectIcon(e.detail)}
    />
  </div>

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
          id={dialogId}
          class={clsx(
            'bg-body mt-0 768:-mt-4 rounded-md border-border border pointer-events-auto',
            'max-w-[95vw] 768:min-w-[700px] 768:max-w-[700px]',
            'max-h-[90vh] 768:min-h-[700px] 768:max-h-[700px] overflow-auto scrollbar relative',
          )}
          role="dialog"
          tabindex="-1"
          aria-hidden={ariaBool(!isDialogOpen)}
          bind:this={dialog}
          on:pointerup|stopPropagation
          on:keydown={(e) => {
            if (e.key !== 'Escape') e.stopPropagation();
            else onCloseDialog(true);
          }}
          use:focusTrap
        >
          <div
            class="z-20 flex items-center sticky top-0 left-0 right-0 w-full bg-body blur-bg text-soft"
          >
            <button
              class={clsx(
                'hover:text-inverse p-4 rounded-md mt-[0.125rem]',
                !open && 'pointer-events-none',
                prevIcons.length === 0 ||
                  (prevIcons.length === 1 &&
                    (!prevIcons[0] || prevIcons[0] === currentIcon) &&
                    'hidden'),
              )}
              on:pointerup={() => onSelectPreviousIcon()}
              on:keydown={(e) => isKeyboardClick(e) && onSelectPreviousIcon(true)}
            >
              <Icon paths={$staticData.icons['arrow-left'].paths} />
              <span class="sr-only">Previous Icon</span>
            </button>
            <div class="flex-1" />
            <button
              class={clsx(
                'hover:text-inverse p-4 rounded-md mt-[0.125rem] mr-[0.125rem]',
                !open && 'pointer-events-none',
              )}
              on:pointerup={() => onCloseDialog()}
              on:keydown={(e) => isKeyboardClick(e) && onCloseDialog(true)}
              bind:this={closeDialogButton}
            >
              <Icon paths={$staticData.icons['x-mark'].paths} />
              <span class="sr-only">Close</span>
            </button>
          </div>

          <div class="flex flex-col prose dark:prose-invert docs px-6 pb-4">
            <div class="flex flex-col items-center justify-center not-prose">
              <div
                class="flex flex-col items-center border border-border justify-center text-inverse w-[120px] h-[120px] rounded-sm graph-paper bg-elevate"
              >
                {#if currentIcon}
                  <Icon width="64" height="64" paths={$staticData.icons[currentIcon].paths} />
                {/if}
              </div>
              <h1 class="mt-4 mb-2 text-xl font-medium text-inverse">
                {currentLib === 'react' ? kebabToPascalCase(currentIcon) + 'Icon' : currentIcon}
              </h1>
              <a
                class="px-4 py-2 hover:text-brand rounded-md"
                href={downloadURL}
                download={`${currentIcon}.svg`}
                aria-label="download svg"
              >
                <div class="flex flex-row items-center text-sm">
                  <DownloadIcon class="mr-1" width="18" height="18" />
                  Download
                </div>
              </a>
            </div>

            <div class="py-4 mt-6">
              <div class="max-w-3xl">
                {#if currentLib === 'svg'}
                  <CodeFence lang="html" {...svgSnippet} copy />
                  <div class="mt-8">
                    <h2 class="font-medium m-0 p-0 text-base mb-6">Raw Import</h2>
                    <CodeFence lang="js" {...rawImportSnippet} copy />
                  </div>
                  <div class="mt-8">
                    <h2 class="font-medium m-0 p-0 text-base mb-6">Unplugin Import</h2>
                    <CodeFence lang="js" {...unpluginImportSnippet} copy />
                  </div>
                {:else if currentLib === 'html'}
                  <CodeFence lang="html" {...wcSnippet} copy />
                {:else if currentLib === 'react'}
                  <CodeFence lang="jsx" {...reactSnippet} copyHighlight highlight="3" />
                {/if}
              </div>
              {#if relatedIcons.length > 0}
                <div class="mt-8">
                  <h2 class="font-medium m-0 p-0 text-base mb-6">Related Icons</h2>
                  <IconGrid
                    compact
                    {currentIcon}
                    {currentLib}
                    icons={$staticData.icons}
                    filter={relatedIcons}
                    on:select={(e) => onSelectIcon(e.detail)}
                  />
                </div>
              {/if}
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
    max-width: 100%;
  }
</style>
