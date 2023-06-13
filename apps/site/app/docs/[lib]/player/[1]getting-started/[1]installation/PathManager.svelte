<script lang="ts">
  import { navigation, useRouter } from '@vessel-js/svelte';
  import { onMount } from 'svelte';

  import { env } from '$lib/env';
  import { installMethod, type InstallMethodType } from '$lib/stores/install-method';
  import { addJSLibToPath, jsLib, type JSLibType } from '$lib/stores/js-lib';
  import { mediaProvider, type MediaProviderType } from '$lib/stores/media-provider';

  let prevInstall = $installMethod;
  let prevLib = $jsLib;
  let prevProvider = $mediaProvider;

  const router = useRouter();

  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  async function onChange(lib: JSLibType, install: InstallMethodType, provider: MediaProviderType) {
    if (!mounted || ($navigation && !$navigation.to.pathname.startsWith('/docs'))) return;

    const url = new URL('/docs/player/getting-started/installation', location.href);

    const isCDN = install === 'cdn';
    const installPath = isCDN ? '/cdn' : '';
    const mediaProviderPath = `/${provider === 'video' ? '' : provider}`;

    if (install !== prevInstall) {
      prevInstall = install;
    } else if (lib !== prevLib) {
      prevLib = lib;
    } else if (provider !== prevProvider) {
      prevProvider = provider;
    }

    url.pathname = addJSLibToPath(
      `${url.pathname}${installPath}${mediaProviderPath}`.toLowerCase(),
      isCDN ? 'html' : lib,
    );

    await router.go(url, { scroll: () => false });
  }

  $: if (env.browser && router.url.pathname.includes('getting-started/installation')) {
    onChange($jsLib, $installMethod, $mediaProvider);
  }
</script>
