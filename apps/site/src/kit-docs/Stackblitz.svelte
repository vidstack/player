<script lang="ts">
  import clsx from 'clsx';
  import { onMount, tick } from 'svelte';

  import { isDarkColorScheme } from '@svelteness/kit-docs';
  import { isString } from '@vidstack/foundation';

  let loaded = false;
  let _class = '';

  export let src: string | null = null;
  export let title: string;
  export let project: string;
  export let file: string | string[] = '';
  export let hideDevTools = false;
  export let devtoolsHeight = 0;
  export let hideNavigation = false;
  export let hideExplorer = false;
  export let clickToLoad = false;
  export let initialPath = '/';
  export let view: 'editor' | 'preview' | 'both' = 'both';

  export { _class as class };

  $: devtools = `hidedevtools=${Number(hideDevTools)}`;
  $: devtoolsheight = `devtoolsheight=${Math.max(0, Math.min(1000, devtoolsHeight))}`;
  $: navigation = `hideNavigation=${Number(hideNavigation)}`;
  $: explorer = `hideExplorer=${Number(hideExplorer)}`;
  $: load = `ctl=${Number(clickToLoad)}`;
  $: theme = `theme=${!$isDarkColorScheme ? 'light' : 'dark'}`;
  $: files = (isString(file) ? [file] : file).map((file) => `file=${encodeURIComponent(file)}`);
  $: initialpath = `initialpath=/${encodeURIComponent(initialPath.replace(/^\//, ''))}`;
  $: params = `embed=1&${initialpath}&${devtools}&${devtoolsheight}&${navigation}&${explorer}&${load}&${theme}&${files}&view=${view}`;

  let canLoad = false;
  let ref: HTMLIFrameElement;

  onMount(() => {
    const idleCallback = requestIdleCallback ?? requestAnimationFrame;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        idleCallback(() => {
          canLoad = true;
        });
      }
    });

    observer.observe(ref);
    return () => observer.disconnect();
  });

  async function onIFrameLoad() {
    await tick();
    loaded = true;
  }
</script>

<svelte:head>
  {#key project}
    <link rel="preconnect" href={`https://stackblitz.com/${project}`} crossorigin="" />
  {/key}
</svelte:head>

<div
  class={clsx(
    'stackblitz border-gray-divider relative overflow-hidden rounded-md border shadow-lg',
    _class,
  )}
  style="width: var(--sb-width); height: var(--sb-height);"
>
  <div
    class={clsx(
      'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-150 ease-out',
      !loaded ? 'z-20 opacity-100' : 'z-0 opacity-0',
    )}
    style="background-color: var(--sb-bg-color);"
  >
    <svg
      class="spinner-icon ease mb-8 h-24 w-24 animate-spin text-white transition-opacity duration-200"
      fill="none"
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="60" cy="60" r="54" stroke="currentColor" stroke-width="6" />
      <circle
        class="spinner-track-fill opacity-75"
        cx="60"
        cy="60"
        r="54"
        stroke="currentColor"
        stroke-width="8"
        pathLength="100"
      />
    </svg>
  </div>

  <iframe
    class="absolute inset-0 z-10 h-full w-full bg-transparent"
    title={`${title} on StackBlitz`}
    src={canLoad ? src ?? `https://stackblitz.com/${project.replace(/^\//, '')}?${params}` : null}
    bind:this={ref}
    on:load={onIFrameLoad}
    allowfullscreen
  />
</div>

<style>
  .spinner-track-fill {
    stroke-dasharray: 100;
    stroke-dashoffset: 50;
  }
</style>
