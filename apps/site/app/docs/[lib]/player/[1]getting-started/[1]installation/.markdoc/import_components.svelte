<script>
  import { jsLib } from '$lib/stores/js-lib';
  import { installMethod } from '$lib/stores/install-method';
  import { mediaProvider } from '$lib/stores/media-provider';

  import { styling } from './select_styling.svelte';
  import NPM_None from '../partials/import/none.js?highlight';
  import NPM_Headless from '../partials/import/headless.js?highlight';
  import NPM_Defaults from '../partials/import/defaults.js?highlight';
  import NPM_Defaults_Selective from '../partials/import/defaults-selective.js?highlight';
  import NPM_Community_Skin_Audio from '../partials/import/community-skin-audio.js?highlight';
  import NPM_Community_Skin_Video from '../partials/import/community-skin-video.js?highlight';
  import React_None from '../partials/import/react/none.js?highlight';
  import React_Headless from '../partials/import/react/headless.js?highlight';
  import React_Defaults from '../partials/import/react/defaults.js?highlight';
  import React_Defaults_Selective from '../partials/import/react/defaults-selective.js?highlight';
  import React_Community_Skin_Audio from '../partials/import/react/community-skin-audio.js?highlight';
  import React_Community_Skin_Video from '../partials/import/react/community-skin-video.js?highlight';
  import CDN_None from '../partials/import/cdn/none.html?highlight';
  import CDN_Headless from '../partials/import/cdn/headless.html?highlight';
  import CDN_Defaults from '../partials/import/cdn/defaults.html?highlight';
  import CDN_Defaults_Selective from '../partials/import/cdn/defaults-selective.html?highlight';
  import CDN_Community_Skin_Audio from '../partials/import/cdn/community-skin-audio.html?highlight';
  import CDN_Community_Skin_Video from '../partials/import/cdn/community-skin-video.html?highlight';
  import CodeFence from '../../../../../.markdoc/@node/fence.svelte';
  import { onMount, tick } from 'svelte';

  const Components = {
    npm: {
      none: NPM_None,
      headless: NPM_Headless,
      defaults: NPM_Defaults,
      'defaults-selective': NPM_Defaults_Selective,
      'community-skin-audio': NPM_Community_Skin_Audio,
      'community-skin-video': NPM_Community_Skin_Video,
    },
    cdn: {
      none: CDN_None,
      headless: CDN_Headless,
      defaults: CDN_Defaults,
      'defaults-selective': CDN_Defaults_Selective,
      'community-skin-audio': CDN_Community_Skin_Audio,
      'community-skin-video': CDN_Community_Skin_Video,
    },
    react: {
      none: React_None,
      headless: React_Headless,
      defaults: React_Defaults,
      'defaults-selective': React_Defaults_Selective,
      'community-skin-audio': React_Community_Skin_Audio,
      'community-skin-video': React_Community_Skin_Video,
    },
  };

  const highlight = {
    cdn: {
      none: '4',
      headless: '4-5',
      defaults: '4-5',
      'community-skin': '4-6',
    },
  };

  const selectiveHighlight = {
    cdn: {
      defaults: '4-9',
    },
  };

  function getTokens(lib, install, styling, provider) {
    const category = Components[lib] ?? Components[install];
    return (
      category?.[styling + `-${provider === 'audio' ? 'audio' : 'video'}`] ?? category?.[styling]
    );
  }

  $: tokens = getTokens($jsLib, $installMethod, $styling, $mediaProvider);

  $: highlights = highlight[$installMethod]?.[$styling];

  $: selectiveTokens = (Components[$jsLib] ?? Components[$installMethod])?.[
    $styling + '-selective'
  ];
  $: selectiveHighlights = selectiveHighlight[$installMethod]?.[$styling];

  onMount(async () => {
    if ($styling !== 'defaults') {
      tokens = undefined;
      await tick();
      tokens = getTokens($jsLib, $installMethod, $styling, $mediaProvider);
      selectiveTokens = (Components[$jsLib] ?? Components[$installMethod])?.[
        $styling + '-selective'
      ];
    }
  });
</script>

{#if tokens}
  <CodeFence copyHighlight highlight={highlights} {...tokens} />
  {#if selectiveTokens}
    <p>Individual styles can be imported like so:</p>
    <CodeFence copyHighlight highlight={selectiveHighlights} {...selectiveTokens} />
  {/if}
{:else}
  <bold>Not available.</bold>
{/if}
