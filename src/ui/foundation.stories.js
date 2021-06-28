import '../bundle/define.js';

import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import {
  MEDIA_CONTAINER_ELEMENT_STORYBOOK_ARG_TYPES,
  MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES
} from '../media/index.js';
import { VIDEO_ELEMENT_STORYBOOK_ARG_TYPES } from '../providers/video/index.js';

export default {
  title: 'UI/Foundation',
  argTypes: {
    ...VIDEO_ELEMENT_STORYBOOK_ARG_TYPES,
    ...MEDIA_CONTAINER_ELEMENT_STORYBOOK_ARG_TYPES,
    ...MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES
  }
};

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
  onMediaContainerConnect,
  // Media Provider Actions
  onAbort,
  onCanPlay,
  onCanPlayThrough,
  onDurationChange,
  onEmptied,
  onEnded,
  onError,
  onFullscreenChange,
  onLoadedData,
  onLoadedMetadata,
  onLoadStart,
  onMediaTypeChange,
  onMediaProviderConnect,
  onPause,
  onPlay,
  onPlaying,
  onProgress,
  onSeeked,
  onSeeking,
  onStalled,
  onStarted,
  onSuspend,
  onReplay,
  onTimeUpdate,
  onViewTypeChange,
  onVolumeChange,
  onWaiting,
  // Media Request Actions
  onMuteRequest,
  onUnmuteRequest,
  onEnterFullscreenRequest,
  onExitFullscreenRequest,
  onPlayRequest,
  onPauseRequest,
  onSeekRequest,
  onSeekingRequest,
  onVolumeChangeRequest
}) {
  return html`
    <vds-media-controller
      @vds-enter-fullscreen-request=${onEnterFullscreenRequest}
      @vds-exit-fullscreen-request=${onExitFullscreenRequest}
      @vds-mute-request=${onMuteRequest}
      @vds-pause-request=${onPauseRequest}
      @vds-play-request=${onPlayRequest}
      @vds-seek-request=${onSeekRequest}
      @vds-seeking-request=${onSeekingRequest}
      @vds-unmute-request=${onUnmuteRequest}
      @vds-volume-change-request=${onVolumeChangeRequest}
    >
      <vds-media-container
        aspect-ratio=${ifDefined(aspectRatio)}
        @vds-media-container-connect=${onMediaContainerConnect}
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
          @vds-abort=${onAbort}
          @vds-can-play-through=${onCanPlayThrough}
          @vds-can-play=${onCanPlay}
          @vds-duration-change=${onDurationChange}
          @vds-emptied=${onEmptied}
          @vds-ended=${onEnded}
          @vds-error=${onError}
          @vds-fullscreen-change=${onFullscreenChange}
          @vds-load-start=${onLoadStart}
          @vds-loaded-data=${onLoadedData}
          @vds-loaded-metadata=${onLoadedMetadata}
          @vds-media-provider-connect=${onMediaProviderConnect}
          @vds-media-type-change=${onMediaTypeChange}
          @vds-pause=${onPause}
          @vds-play=${onPlay}
          @vds-playing=${onPlaying}
          @vds-progress=${onProgress}
          @vds-replay=${onReplay}
          @vds-seeked=${onSeeked}
          @vds-seeking=${onSeeking}
          @vds-stalled=${onStalled}
          @vds-started=${onStarted}
          @vds-suspend=${onSuspend}
          @vds-time-update=${onTimeUpdate}
          @vds-view-type-change=${onViewTypeChange}
          @vds-volume-change=${onVolumeChange}
          @vds-waiting=${onWaiting}
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
