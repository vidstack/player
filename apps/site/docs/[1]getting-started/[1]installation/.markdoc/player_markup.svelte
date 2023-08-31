<script>
  import { jsLib } from '$lib/stores/js-lib';
  import { mediaProvider } from '$lib/stores/media-provider';

  import { styling } from './select_styling.svelte';
  import HTML_Audio from '../partials/markup/audio.html?highlight';
  import HTML_Video from '../partials/markup/video.html?highlight';
  import HTML_HLS from '../partials/markup/hls.html?highlight';
  import HTML_CS_Audio from '../partials/markup/default-skin-audio.html?highlight';
  import HTML_CS_Video from '../partials/markup/default-skin-video.html?highlight';
  import HTML_CS_HLS from '../partials/markup/default-skin-hls.html?highlight';
  import React_Audio from '../partials/markup/react/audio.jsx?highlight';
  import React_Video from '../partials/markup/react/video.jsx?highlight';
  import React_HLS from '../partials/markup/react/hls.jsx?highlight';
  import React_CS_Audio from '../partials/markup/react/default-skin-audio.jsx?highlight';
  import React_CS_Video from '../partials/markup/react/default-skin-video.jsx?highlight';
  import React_CS_HLS from '../partials/markup/react/default-skin-hls.jsx?highlight';
  import CodeFence from '../../../../../.markdoc/@node/fence.svelte';

  const Components = {
    html: {
      audio: HTML_Audio,
      video: HTML_Video,
      hls: HTML_HLS,
      'default-skin-audio': HTML_CS_Audio,
      'default-skin-video': HTML_CS_Video,
      'default-skin-hls': HTML_CS_HLS,
    },
    react: {
      audio: React_Audio,
      video: React_Video,
      hls: React_HLS,
      'default-skin-audio': React_CS_Audio,
      'default-skin-video': React_CS_Video,
      'default-skin-hls': React_CS_HLS,
    },
  };

  $: tokens =
    Components[$jsLib]?.[$styling + '-' + $mediaProvider] ?? Components[$jsLib]?.[$mediaProvider];
</script>

{#if tokens && $styling !== 'plyr-skin'}
  <CodeFence copy {...tokens} />
{:else}
  <bold>Not available.</bold>
{/if}
