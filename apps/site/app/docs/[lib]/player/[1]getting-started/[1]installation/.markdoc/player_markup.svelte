<script>
  import { jsLib } from '$lib/stores/js-lib';
  import { mediaProvider } from '$lib/stores/media-provider';

  import { styling } from './select_styling.svelte';
  import HTML_Audio from '../partials/markup/audio.html?highlight';
  import HTML_Video from '../partials/markup/video.html?highlight';
  import HTML_HLS from '../partials/markup/hls.html?highlight';
  import React_Audio from '../partials/markup/react/audio.jsx?highlight';
  import React_Video from '../partials/markup/react/video.jsx?highlight';
  import React_HLS from '../partials/markup/react/hls.jsx?highlight';
  import CodeFence from '../../../../../.markdoc/@node/fence.svelte';

  const Components = {
    html: {
      audio: HTML_Audio,
      video: HTML_Video,
      hls: HTML_HLS,
    },
    react: {
      audio: React_Audio,
      video: React_Video,
      hls: React_HLS,
    },
  };

  $: tokens = Components[$jsLib]?.[$mediaProvider];
</script>

{#if tokens && !$styling.includes('-skin')}
  <CodeFence copy {...tokens} />
{:else}
  <bold>Not available.</bold>
{/if}
