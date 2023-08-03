<script lang="ts">
  import { decodeHTML } from '../utils/html';

  $: unescapedSourceCode = decodeHTML(source ?? '') ?? '';

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
</script>

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
      showCopiedCodePrompt ? 'opacity-0' : 'duration-600 opacity-100 transition-opacity ease-in',
    )}
  />
  <span class="sr-only">Copy</span>
</button>
