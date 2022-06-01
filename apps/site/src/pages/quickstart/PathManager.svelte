<script lang="ts">
  import { getRouter } from '@vitebook/svelte';

  import { installMethod, type InstallMethodType } from '$src/stores/install-method';
  import { addJSLibToPath, jsLib, type JSLibType } from '$src/stores/js-lib';
  import { mediaProvider, type MediaProviderType } from '$src/stores/media-provider';
  import { env } from '$src/env';
  import { scrollTop } from '$src/stores/scroll';

  let prevInstall = $installMethod;
  let prevLib = $jsLib;
  let prevProvider = $mediaProvider;

  const router = getRouter();

  function onChange(lib: JSLibType, install: InstallMethodType, provider: MediaProviderType) {
    if (window.scrollY === 0) return;

    const url = new URL('/docs/player/getting-started/quickstart', location.href);
    const pathname = url.pathname;

    const isCDN = install === 'cdn';
    const installPath = isCDN ? '/cdn' : '';
    const mediaProviderPath = `/${provider === 'video' ? '' : provider}${
      provider !== 'video' ? '.html' : ''
    }`;

    if (install !== prevInstall) {
      url.hash = '#select-install-method';
      prevInstall = install;
    } else if (lib !== prevLib) {
      url.hash = '#select-js-library';
      prevLib = lib;
    } else if (provider !== prevProvider) {
      url.hash = '#select-media-provider';
      prevProvider = provider;
    }

    url.pathname = addJSLibToPath(
      `${pathname}${installPath}${mediaProviderPath}`.toLowerCase(),
      lib as JSLibType,
    );

    if (router.url.pathname !== url.pathname) {
      router.go(url);
    }
  }

  $: if (env.browser && router.url.pathname.includes('quickstart/')) {
    onChange($jsLib, $installMethod, $mediaProvider);
  }
</script>
