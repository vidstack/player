<script context="module">
  export const __pageMeta = {
    title: 'PosterElement'
  };
</script>

<script>
  import { Variant } from '@vitebook/client';

  import { VideoPlayerElement } from '../../players/video';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { PosterElement } from './PosterElement';

  safelyDefineCustomElement('vds-video-player', VideoPlayerElement);
  safelyDefineCustomElement('vds-poster', PosterElement);

  let poster = 'https://media-files.vidstack.io/poster.png';
</script>

<Variant name="Default">
  <vds-video-player {poster}>
    <vds-poster slot="ui" alt="Media poster" />
  </vds-video-player>
</Variant>

<Variant name="Eager">
  <vds-video-player {poster}>
    <vds-poster slot="ui" loading="eager" />
  </vds-video-player>
</Variant>

<Variant name="Lazy">
  <vds-video-player {poster} class="lazy-video">
    <vds-poster slot="ui" loading="lazy" />
  </vds-video-player>
</Variant>

<style>
  vds-video-player {
    width: 400px;
    height: 225px;
  }

  .lazy-video {
    margin-top: 100vh;
    margin-bottom: 100vh;
  }

  vds-poster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
</style>
