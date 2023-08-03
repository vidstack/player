<script lang="ts">
  import { isHighlightLine, resolveHighlightedLines } from '../highlight';

  export let id: string;
  export let lines: number;
  export let highlights: string | undefined;

  const toArray = (lines: number) => [...Array(lines).keys()].map((n) => n + 1);

  let lineNumbers = toArray(lines),
    highlightedLines = resolveHighlightedLines(lines, highlights);

  if (import.meta.hot) {
    import.meta.hot.on(':invalidate_code_snippet', async (payload) => {
      if (payload.id !== id) return;
      lineNumbers = toArray(payload.lines);
      highlightedLines = resolveHighlightedLines(payload.lines, payload.highlights);
    });
  }
</script>

{#if highlightedLines.length > 0}
  <div
    class="pointer-events-none absolute inset-0 h-full w-full leading-[var(--leading)]"
    aria-hidden="true"
  >
    {#each lineNumbers as lineNumber}
      {#if isHighlightLine(highlightedLines, lineNumber)}
        <div
          class="w-full border-l-[5px] h-[var(--leading)] font-mono text-transparent bg-brand/10 border-brand/20"
        >
          &nbsp;
        </div>
      {:else}
        <br class="h-[var(--leading)]" />
      {/if}
    {/each}
  </div>
{/if}
