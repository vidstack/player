<script context="module">
  export const __pageMeta = {
    title: 'PosterElement'
  };
</script>

<script>
  import { Variant } from '@vitebook/client';

  import { VideoPlayerElement } from '../../players/video';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { PlayButtonElement } from '../play-button';
  import { PosterElement } from './PosterElement';
  import { MediaUiElement } from '../../media';

  safelyDefineCustomElement('vds-video-player', VideoPlayerElement);
  safelyDefineCustomElement('vds-play-button', PlayButtonElement);
  safelyDefineCustomElement('vds-poster', PosterElement);
  safelyDefineCustomElement('vds-media-ui', MediaUiElement);

  const src = 'https://media-files.vidstack.io/720p.mp4';
  let poster = 'https://media-files.vidstack.io/poster.png';
</script>

<Variant name="Default">
  <vds-video-player {src} {poster}>
    <vds-media-ui slot="ui">
      <vds-poster alt="Large alien ship hovering over New York." />

      <div class="big-play-button">
        <vds-play-button>
          <svg class="play-icon" aria-hidden="true" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
            />
          </svg>
        </vds-play-button>
      </div>
    </vds-media-ui>
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
    z-index: 0;
  }

  /* Hide poster if it fails to load. */
  /* It'd be better if we replaced it with something else. */
  vds-poster:global([img-error]) {
    display: none;
  }

  .big-play-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 300ms ease-in;
    z-index: 1; /** Above `vds-poster`. */
  }

  .big-play-button .play-icon {
    color: white;
    width: 56px;
    height: 56px;
  }

  /* Show when media is ready. */
  :global(vds-media-ui[media-can-play]) .big-play-button {
    opacity: 1;
  }

  /* Hide when playback starts. */
  :global(vds-media-ui[media-started]) vds-poster,
  :global(vds-media-ui[media-started]) .big-play-button {
    opacity: 0;
    pointer-events: none;
  }
</style>
