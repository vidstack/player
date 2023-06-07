<script lang="ts">
  import clsx from 'clsx';
  import CopyFileIcon from '~icons/ri/file-copy-line';

  import { decodeHTML } from '$lib/utils/html';

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
    if (range[1] === '') range[1] = linesCount - 1 + '';
    else if (range.length === 1) range.push(range[0]);
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

  $: unescapedRawCode = decodeHTML(code ?? '') ?? '';

  let showCopiedCodePrompt = false;
  async function copyCodeToClipboard() {
    try {
      let copiedCode =
        currentHighlightedLines.length > 0 && (copyHighlight || copySteps)
          ? unescapedRawCode
              .split('\n')
              .filter((_, i) => isHighlightLine(i + 1))
              .join('\n')
          : unescapedRawCode;

      if (lang && /[j|t]sx/.test(lang)) {
        copiedCode = copiedCode.replace(/;\n?$/, '');
      }

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
    'code-fence 576:max-h-[32rem] relative my-8 mx-auto max-h-[60vh] overflow-y-auto rounded-md',
    'prefers-dark-scheme scrollbar scroll-contain shadow-xl border-border border',
    lang && `lang-${lang}`,
  )}
  style="background-color: var(--code-fence-bg);"
>
  {#if showTopBar}
    <div
      class="code-fence-top-bar sticky top-0 left-0 z-10 flex items-center py-1 pt-2"
      style="background-color: var(--code-fence-bg);"
    >
      {#if hasTopbarTitle}
        <span class="code-fence-title ml-3.5 font-mono text-sm text-soft">{topbarTitle}</span>
      {/if}

      <div class="flex-1" />

      {#if copy}
        <button
          type="button"
          class={clsx(
            'mr-2 px-2 py-1 hover:text-inverse',
            showCopiedCodePrompt ? 'text-inverse' : 'text-soft',
          )}
          on:click={copyCodeToClipboard}
        >
          <div
            class={clsx(
              'absolute top-2.5 right-4 z-10 rounded-md px-2 py-1 font-mono text-sm transition-opacity duration-300 ease-out',
              showCopiedCodePrompt ? 'opacity-100' : 'hidden opacity-0',
            )}
            aria-hidden="true"
            style="background-color: var(--code-copied-bg-color);"
          >
            Copied
          </div>

          <CopyFileIcon
            width="20"
            height="20"
            class={clsx(
              showCopiedCodePrompt
                ? 'opacity-0'
                : 'duration-600 opacity-100 transition-opacity ease-in',
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
        class="992:flex absolute top-3.5 left-0 m-0 hidden flex-col text-sm leading-[24px]"
        style="border-radius: 0; padding-top: 0;">
			  <div
          class="992:block hidden flex-none select-none text-right text-soft"
          aria-hidden="true">{lines.join('\n')}</div>
		  </pre>
    {/if}

    {#if currentHighlightedLines.length > 0}
      <div
        class="pointer-events-none absolute inset-0 mt-[0.7em] h-full w-full leading-[24px]"
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
