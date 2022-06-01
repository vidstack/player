<script lang="ts">
  import { unescapeHTML } from '@vitebook/core';

  import clsx from 'clsx';

  import CopyFileIcon from '~icons/ri/file-copy-line';

  export let lang: string | null = null;
  export let code: string | null = null;
  export let highlightedCode: string | null = null;

  export let title: string | null = null;
  export let copyHighlight = false;
  export let copySteps = false;
  export let copy = copyHighlight || copySteps;
  export let nums = false;
  export let highlight: string | null = null;
  export let style: string = ''; // ignore
  style = '';

  $: highlightLines = (highlight?.split(',').map((item) => {
    const range = item.split('-');
    if (range.length === 1) range.push(range[0]);
    return range.map((str) => Number.parseInt(str, 10));
  }) ?? []) as [number, number][];

  let currentStep = 1;
  let stepHighlightLines: [number, number][] = [];

  $: if (copySteps) {
    stepHighlightLines = [highlightLines[currentStep - 1] ?? [currentStep, currentStep]];
  }

  $: currentHighlightedLines = copySteps ? stepHighlightLines : highlightLines;

  const isHighlightLine = (lineNumber: number, _?: any): boolean =>
    currentHighlightedLines.some(([start, end]) => lineNumber >= start && lineNumber <= end);

  $: linesCount = (highlightedCode?.match(/"line"/g) ?? ['']).length;

  // `linesCount-1` since last line is always empty (prettier)
  $: lines = [...Array(linesCount - 1).keys()].map((n) => n + 1);

  $: unescapedRawCode = unescapeHTML(code ?? '') ?? '';

  let showCopiedCodePrompt = false;
  async function copyCodeToClipboard() {
    try {
      const copiedCode =
        currentHighlightedLines.length > 0 && (copyHighlight || copySteps)
          ? unescapedRawCode
              .split('\n')
              .filter((_, i) => isHighlightLine(i + 1))
              .join('\n')
          : unescapedRawCode;

      await navigator.clipboard.writeText(copiedCode);
    } catch (e) {
      // no-op
    }

    showCopiedCodePrompt = true;
    if (copySteps) {
      const nextStep = currentStep + 1;
      const maxSteps = highlightLines.length > 0 ? highlightLines.length : lines.length;
      currentStep = nextStep > maxSteps ? 1 : nextStep;
    }
  }

  $: if (showCopiedCodePrompt) {
    setTimeout(() => {
      showCopiedCodePrompt = false;
    }, 400);
  }

  $: showTopBar = title || copy;
  $: hasTopbarTitle = title || lang;
  $: topbarTitle = title ?? (lang === 'bash' ? 'terminal' : lang);
</script>

<div
  class={clsx(
    'code-fence overflow-y-auto relative max-h-[60vh] 576:max-h-[32rem] my-8 rounded-md shadow-lg mx-auto',
    'border border-gray-outline prefers-dark-scheme scrollbar scroll-contain',
    lang && `lang-${lang}`,
  )}
  style="background-color: var(--code-fence-bg);"
>
  {#if showTopBar}
    <div
      class="code-fence-top-bar sticky top-0 left-0 z-10 flex items-center pt-2 py-1 backdrop-filter backdrop-blur"
      style="background-color: var(--code-fence-top-bar-bg);"
    >
      {#if hasTopbarTitle}
        <span class="code-fence-title ml-3.5 font-mono text-sm text-gray-300">{topbarTitle}</span>
      {/if}

      <div class="flex-1" />

      {#if copy}
        <button
          type="button"
          class="mr-2 px-2 py-1 hover:text-white"
          on:click={copyCodeToClipboard}
        >
          <div
            class={clsx(
              'text-gray-current absolute top-2.5 right-4 transition-opacity z-10 duration-300 px-2 py-1 rounded-md ease-out text-sm font-mono',
              showCopiedCodePrompt ? 'opacity-100' : 'hidden opacity-0',
            )}
            aria-hidden="true"
            style="background-color: var(--code-copied-bg-color);"
          >
            Copied
          </div>

          <CopyFileIcon
            width="24"
            height="24"
            class={clsx(
              showCopiedCodePrompt
                ? 'opacity-0'
                : 'opacity-100 transition-opacity duration-600 ease-in',
            )}
          />
          <span class="sr-only">Copy</span>
        </button>
      {/if}
    </div>
  {/if}

  <div class="code relative z-0 overflow-hidden">
    <div class={clsx(nums && '992:pl-10')}>
      <pre class={clsx('scrollbar', nums && lines.length >= 100 ? 'pl-6' : 'pl-3')}>
        {@html highlightedCode}
      </pre>
    </div>

    {#if nums}
      <pre
        class="hidden 992:flex absolute top-3.5 left-0 m-0 flex-col text-sm leading-[27px]"
        style="border-radius: 0; padding-top: 0;">
			  <div
          class="hidden flex-none select-none text-right text-gray-300 992:block"
          aria-hidden="true">{lines.join('\n')}</div>
		  </pre>
    {/if}

    {#if currentHighlightedLines.length > 0}
      <div
        class="pointer-events-none absolute inset-0 mt-[0.7em] h-full w-full leading-[27px]"
        aria-hidden="true"
      >
        {#each lines as lineNumber}
          {#if isHighlightLine(lineNumber, currentHighlightedLines)}
            <div
              class="w-full border-l-[5px] font-mono text-transparent"
              style="border-color: var(--code-highlight-border); background-color: var(--code-highlight-color);"
            >
              &nbsp;
            </div>
          {:else}
            <br />
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>
