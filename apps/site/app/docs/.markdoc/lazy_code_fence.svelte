<script lang="ts">
  import clsx from 'clsx';

  import { intersectionObserver } from '$lib/actions/intersection-observer';
  import IndeterminateLoading from '$lib/components/base/IndeterminateLoading.svelte';
  import { ariaBool } from '$lib/utils/aria';

  import CodeFence from './@node/fence.svelte';

  export let title: string | null = null;
  export let lines: number = 0;
  export let scrollX: number = 0;
  export let loader:
    | (() => Promise<{
        default: {
          lang: string;
          code: string;
          highlightedCode: string;
        };
      }>)
    | undefined = undefined;

  $: estimatedCodeHeight = (lines || 0) * 24;
  $: lineNums = $$restProps.nums ? [...Array(lines).keys()].map((n) => n + 1) : [];

  let tokens;
  let hasLoaded = false;
  let isVisible = false;

  $: if (isVisible && loader) loadSnippet(loader);

  async function loadSnippet(loader) {
    hasLoaded = false;
    tokens = (await loader()).default;
    hasLoaded = true;
  }

  const onIntersect: IntersectionObserverCallback = (entries) => {
    if (entries[0].isIntersecting) {
      isVisible = true;
    }
  };
</script>

{#if !hasLoaded}
  <div
    class="code-fence scrollbar 576:max-h-[32rem] border-border prefers-dark-scheme relative my-8 mx-auto max-h-[60vh] overflow-y-auto rounded-md border shadow-xl"
    style="background-color: var(--code-fence-bg);"
    aria-busy={ariaBool(!hasLoaded)}
    use:intersectionObserver={{ callback: onIntersect }}
  >
    <IndeterminateLoading />

    {#if $$restProps.copy}
      <div style="height: 44px;" />
    {:else if title}
      <div style="height: 28px;" />
    {/if}

    <div class="code relative z-0 overflow-hidden">
      <div class={clsx($$restProps.nums && '992:pl-10')}>
        <pre
          class={clsx(
            'scrollbar m-0',
            $$restProps.nums && lineNums.length >= 100 ? 'pl-6' : 'pl-3',
          )}>
          <code style={clsx(`width: ${scrollX * 9.48}px;`, `height: ${estimatedCodeHeight}px;`)} />
        </pre>
      </div>

      {#if $$restProps.nums}
        <pre
          class="992:flex absolute top-3.5 left-0 m-0 hidden flex-col text-sm leading-[24px]"
          style="border-radius: 0; padding-top: 0;">
          <div
            class="text-300 992:block hidden flex-none select-none text-right"
            aria-hidden="true">{lineNums.join('\n')}</div>
		    </pre>
      {/if}
    </div>
  </div>
{:else}
  <CodeFence {title} {...$$restProps} {...tokens} />
{/if}
