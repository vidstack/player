<script>
  import { jsLib } from '$lib/stores/js-lib';
  import { installMethod } from '$lib/stores/install-method';

  import { styling } from './select_styling.svelte';
  import NPM_None from '../partials/import/none.js?highlight';
  import NPM_Headless from '../partials/import/headless.js?highlight';
  import NPM_Defaults from '../partials/import/defaults.js?highlight';
  import NPM_Defaults_Selective from '../partials/import/defaults-selective.js?highlight';
  import React_None from '../partials/import/react/none.js?highlight';
  import React_Headless from '../partials/import/react/headless.js?highlight';
  import React_Defaults from '../partials/import/react/defaults.js?highlight';
  import React_Defaults_Selective from '../partials/import/react/defaults-selective.js?highlight';
  import CDN_None from '../partials/import/cdn/none.html?highlight';
  import CDN_Headless from '../partials/import/cdn/headless.html?highlight';
  import CDN_Defaults from '../partials/import/cdn/defaults.html?highlight';
  import CDN_Defaults_Selective from '../partials/import/cdn/defaults-selective.html?highlight';
  import CodeFence from '../../../../../.markdoc/@node/fence.svelte';
  import { onMount, tick } from 'svelte';

  const Components = {
    npm: {
      none: NPM_None,
      headless: NPM_Headless,
      defaults: NPM_Defaults,
      defaultsSelective: NPM_Defaults_Selective,
    },
    cdn: {
      none: CDN_None,
      headless: CDN_Headless,
      defaults: CDN_Defaults,
      defaultsSelective: CDN_Defaults_Selective,
    },
    react: {
      none: React_None,
      headless: React_Headless,
      defaults: React_Defaults,
      defaultsSelective: React_Defaults_Selective,
    },
  };

  const highlight = {
    cdn: {
      none: '4',
      headless: '4-5',
      defaults: '4-5',
    },
  };

  const selectiveHighlight = {
    cdn: {
      defaults: '4-9',
    },
  };

  $: tokens = (Components[$jsLib] ?? Components[$installMethod])?.[$styling];
  $: highlights = highlight[$installMethod]?.[$styling];

  $: selectiveTokens = (Components[$jsLib] ?? Components[$installMethod])?.[$styling + 'Selective'];
  $: selectiveHighlights = selectiveHighlight[$installMethod]?.[$styling];

  onMount(async () => {
    if ($styling !== 'defaults') {
      tokens = undefined;
      await tick();
      tokens = (Components[$jsLib] ?? Components[$installMethod])?.[$styling];
      selectiveTokens = (Components[$jsLib] ?? Components[$installMethod])?.[
        $styling + 'Selective'
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
