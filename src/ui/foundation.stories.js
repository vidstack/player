import '../bundle/define.js';

import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import {
  VDS_MEDIA_CONTAINER_ELEMENT_STORYBOOK_ARG_TYPES,
  VDS_MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES
} from '../media/index.js';
import { VDS_VIDEO_ELEMENT_STORYBOOK_ARG_TYPES } from '../providers/video/index.js';

export default {
  title: 'UI/Foundation',
  argTypes: {
    ...VDS_VIDEO_ELEMENT_STORYBOOK_ARG_TYPES,
    ...VDS_MEDIA_CONTAINER_ELEMENT_STORYBOOK_ARG_TYPES,
    ...VDS_MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES
  }
};

/**
 * @typedef {import('../providers/video').VideoElementStorybookArgs & import('../media').MediaContainerElementStorybookArgs & import('../media').MediaControllerElementStorybookArgs} FoundationStorybookArgs
 */

/**
 * @param {FoundationStorybookArgs} args
 */
function Template({
  // Media Provider Properties
  width,
  height,
  src,
  poster,
  paused,
  volume,
  currentTime = 0,
  muted,
  playsinline,
  loop,
  controls,
  crossOrigin,
  preload,
  controlsList,
  autoPiP,
  disablePiP,
  disableRemotePlayback,
  // Media Container Properties
  aspectRatio,
  // Media Container Actions
  onVdsMediaContainerConnect,
  // Media Provider Actions
  onVdsAbort,
  onVdsCanPlay,
  onVdsCanPlayThrough,
  onVdsDurationChange,
  onVdsEmptied,
  onVdsEnded,
  onVdsError,
  onVdsFullscreenChange,
  onVdsLoadedData,
  onVdsLoadedMetadata,
  onVdsLoadStart,
  onVdsMediaTypeChange,
  onVdsMediaProviderConnect,
  onVdsPause,
  onVdsPlay,
  onVdsPlaying,
  onVdsProgress,
  onVdsSeeked,
  onVdsSeeking,
  onVdsStalled,
  onVdsStarted,
  onVdsSuspend,
  onVdsReplay,
  onVdsTimeUpdate,
  onVdsViewTypeChange,
  onVdsVolumeChange,
  onVdsWaiting,
  // Media Request Actions
  onVdsMuteRequest,
  onVdsUnmuteRequest,
  onVdsEnterFullscreenRequest,
  onVdsExitFullscreenRequest,
  onVdsPlayRequest,
  onVdsPauseRequest,
  onVdsSeekRequest,
  onVdsSeekingRequest,
  onVdsVolumeChangeRequest
}) {
  return html`
    <vds-media-controller
      @vds-enter-fullscreen-request=${onVdsEnterFullscreenRequest}
      @vds-exit-fullscreen-request=${onVdsExitFullscreenRequest}
      @vds-mute-request=${onVdsMuteRequest}
      @vds-pause-request=${onVdsPauseRequest}
      @vds-play-request=${onVdsPlayRequest}
      @vds-seek-request=${onVdsSeekRequest}
      @vds-seeking-request=${onVdsSeekingRequest}
      @vds-unmute-request=${onVdsUnmuteRequest}
      @vds-volume-change-request=${onVdsVolumeChangeRequest}
    >
      <vds-media-container
        aspect-ratio=${ifDefined(aspectRatio)}
        @vds-media-container-connect=${onVdsMediaContainerConnect}
      >
        <vds-video
          slot="media"
          aspect-ratio=${ifDefined(aspectRatio)}
          controlslist=${ifDefined(controlsList)}
          crossorigin=${ifDefined(crossOrigin)}
          current-time=${currentTime}
          height=${ifDefined(height)}
          poster=${ifDefined(poster)}
          preload=${ifDefined(preload)}
          src=${src}
          volume=${volume}
          width=${ifDefined(width)}
          ?autopictureinpicture=${autoPiP}
          ?controls=${controls}
          ?disablepictureinpicture=${disablePiP}
          ?disableremoteplayback=${disableRemotePlayback}
          ?loop=${loop}
          ?muted=${muted}
          ?paused=${paused}
          ?playsinline=${playsinline}
          @vds-abort=${onVdsAbort}
          @vds-can-play-through=${onVdsCanPlayThrough}
          @vds-can-play=${onVdsCanPlay}
          @vds-duration-change=${onVdsDurationChange}
          @vds-emptied=${onVdsEmptied}
          @vds-ended=${onVdsEnded}
          @vds-error=${onVdsError}
          @vds-fullscreen-change=${onVdsFullscreenChange}
          @vds-load-start=${onVdsLoadStart}
          @vds-loaded-data=${onVdsLoadedData}
          @vds-loaded-metadata=${onVdsLoadedMetadata}
          @vds-media-provider-connect=${onVdsMediaProviderConnect}
          @vds-media-type-change=${onVdsMediaTypeChange}
          @vds-pause=${onVdsPause}
          @vds-play=${onVdsPlay}
          @vds-playing=${onVdsPlaying}
          @vds-progress=${onVdsProgress}
          @vds-replay=${onVdsReplay}
          @vds-seeked=${onVdsSeeked}
          @vds-seeking=${onVdsSeeking}
          @vds-stalled=${onVdsStalled}
          @vds-started=${onVdsStarted}
          @vds-suspend=${onVdsSuspend}
          @vds-time-update=${onVdsTimeUpdate}
          @vds-view-type-change=${onVdsViewTypeChange}
          @vds-volume-change=${onVdsVolumeChange}
          @vds-waiting=${onVdsWaiting}
        ></vds-video>

        <vds-media-ui>
          <h2>Toggles</h2>

          <div style="display: flex;">
            <vds-play-button>
              <span slot="play">Play</span>
              <span slot="pause">Pause</span>
            </vds-play-button>

            <vds-mute-button>
              <span slot="mute">Mute</span>
              <span slot="unmute">Unmute</span>
            </vds-mute-button>

            <vds-fullscreen-button>
              <span slot="enter">Enter Fullscreen</span>
              <span slot="exit">Exit Fullscreen</span>
            </vds-fullscreen-button>
          </div>

          <h2>Scrubber</h2>

          <vds-scrubber pause-while-dragging></vds-scrubber>

          <h2>Time</h2>

          <h3>Current Time</h3>
          <vds-time-current></vds-time-current>
          <h3>Duration</h3>
          <vds-time-duration></vds-time-duration>
          <h3>Progress</h3>
          <vds-time-progress></vds-time-progress>

          <h2>Indicators</h2>

          <h3>Buffering</h3>
          <vds-buffering-indicator>
            <div class="buffering-indicator">
              <span>Buffering</span>
              <span>Not Buffering</span>
            </div>
          </vds-buffering-indicator>
        </vds-media-ui>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-media-ui {
        position: relative;
      }

      vds-video::part(video) {
        background-color: black;
      }

      h2 {
        font-size: 24px;
        margin: 24px 0;
        color: #9e9e9e;
      }

      h3 {
        margin: 8px 0;
        color: #9e9e9e;
        font-size: 16px;
        font-weight: regular;
      }

      span,
      vds-time-current,
      vds-time-duration,
      vds-time-progress {
        color: black;
      }

      *[hidden] {
        opacity: 0;
        visibility: hidden;
      }

      .buffering-indicator[hidden] {
        opacity: 1;
        visibility: visible;
        display: block;
      }

      .buffering-indicator > span {
        display: none;
      }

      .buffering-indicator:not([hidden]) > span:nth-child(1),
      .buffering-indicator[hidden] > span:nth-child(2) {
        display: block;
      }
    </style>
  `;
}

export const Foundation = Template.bind({});
