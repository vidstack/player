<script>
  import ReactAdapter from './ReactAdapter.svelte';
  import RootLayout from './RootLayout.svelte';
  import Layouts from './Layouts.svelte';

  const files = import.meta.glob('../src/**/*.{html,svelte,tsx}');

  const privateRouteRE = /\/_.*?\..*?$/;
  const stripQueryParamRE = /\?.*?/;

  const routes = Object.keys(files).reduce(
    (routes, file) => ({
      ...routes,
      [filePathToRoute(file)]: {
        file,
        loader: files[file],
        private: privateRouteRE.test(file),
      },
    }),
    {},
  );

  function filePathToRoute(filePath) {
    return filePath
      .replace('../src', '')
      .replace(/\[\d*?\]/g, '')
      .replace(/\.(html|tsx)$/, '_$1');
  }

  const rootLayout = {
    file: '__layout.svelte',
    loader: () => ({ default: RootLayout }),
  };

  function getLayouts(routePath) {
    const layouts = [rootLayout];

    if (!routePath) return layouts;

    const paths = Object.keys(routes).map((route) => route.replace(stripQueryParamRE, ''));
    const segments = routePath.split('/').slice(1);

    for (let i = 1; i < segments.length; i += 1) {
      const segment = segments.slice(0, i).join('/');
      const path = paths.find((path) => path === `/${segment}/__layout.svelte`);
      if (path) {
        const file = routes[path].file;
        layouts.push({
          file,
          loader: files[file],
        });
      }
    }

    return layouts;
  }

  $: activePath = Object.keys(routes).find(
    (path) => path === location.pathname && !routes[path].private,
  );

  $: activeRoute = routes[activePath];

  $: layouts = getLayouts(activePath);

  if (location.search.includes('theme=dark')) {
    document.documentElement.classList.add('dark');
  }
</script>

<main
  class="flex min-h-screen w-full flex-col items-center justify-center p-4"
  style="background-color: var(--bg-color);"
>
  {#if activeRoute}
    <Layouts {layouts}>
      {#await activeRoute.loader() then { default: component }}
        {#if activeRoute.file.endsWith('.tsx')}
          <ReactAdapter {component} />
        {:else}
          <svelte:component this={component} />
        {/if}
      {/await}
    </Layouts>
  {:else}
    <p class="text-xl font-medium">No page was found.</p>
  {/if}
</main>

<style>
  :global(:root) {
    --bg-color: hsl(0, 0%, 99%);
    --color-gray-soft: rgb(112, 112, 112);
    --color-gray-inverse: rgb(0, 0, 0);
  }

  :global(:root.dark) {
    color-scheme: dark;
    --bg-color: hsl(0, 0%, 18%);
    --color-gray-soft: rgb(175, 175, 175);
    --color-gray-inverse: rgb(255, 255, 255);
  }

  main {
    color: var(--color-gray-soft);
  }

  :global(code) {
    color: var(--color-gray-inverse);
  }

  :global(video) {
    height: 100%;
  }
</style>
