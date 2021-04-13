import '../bundle/define';

import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { VdsPlayerEvents } from '../bundle/define';
import { VIDEO_TAG_NAME, VideoProviderProps } from '../providers/video';
import {
  buildStorybookControlsFromManifest,
  VdsEventsToStorybookActions,
} from '../shared/storybook';

export default {
  title: 'UI/Foundation',
  component: VIDEO_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(VIDEO_TAG_NAME),
    src: {
      defaultValue:
        'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8/medium.mp4',
    },
    poster: {
      defaultValue: 'https://media-files.vidstack.io/poster.png',
    },
  },
};

type Args = VideoProviderProps & VdsEventsToStorybookActions<VdsPlayerEvents>;

function Template({
  // Props
  width,
  height,
  aspectRatio,
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
  // Events
  onVdsAbort,
  onVdsCanPlay,
  onVdsCanPlayThrough,
  onVdsConnect,
  onVdsDisconnect,
  onVdsDurationChange,
  onVdsEmptied,
  onVdsEnded,
  onVdsError,
  onVdsFullscreenChange,
  onVdsLoadedData,
  onVdsLoadedMetadata,
  onVdsLoadStart,
  onVdsMediaTypeChange,
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
}: Args) {
  return html`
    <vds-video
      src="${src}"
      width="${ifDefined(width)}"
      height="${ifDefined(height)}"
      aspect-ratio="${ifDefined(aspectRatio)}"
      poster="${ifDefined(poster)}"
      ?paused="${paused}"
      volume="${volume}"
      current-time="${currentTime}"
      ?muted="${muted}"
      ?playsinline="${playsinline}"
      ?loop="${loop}"
      ?controls="${controls}"
      crossorigin="${ifDefined(crossOrigin)}"
      preload="${ifDefined(preload)}"
      controlslist="${ifDefined(controlsList)}"
      ?autopictureinpicture="${autoPiP}"
      ?disablepictureinpicture="${disablePiP}"
      ?disableremoteplayback="${disableRemotePlayback}"
      @vds-abort="${onVdsAbort}"
      @vds-can-play="${onVdsCanPlay}"
      @vds-can-play-through="${onVdsCanPlayThrough}"
      @vds-connect="${onVdsConnect}"
      @vds-disconnect="${onVdsDisconnect}"
      @vds-duration-change="${onVdsDurationChange}"
      @vds-emptied="${onVdsEmptied}"
      @vds-ended="${onVdsEnded}"
      @vds-error="${onVdsError}"
      @vds-fullscreen-change="${onVdsFullscreenChange}"
      @vds-loaded-data="${onVdsLoadedData}"
      @vds-load-start="${onVdsLoadStart}"
      @vds-loaded-metadata="${onVdsLoadedMetadata}"
      @vds-media-type-change="${onVdsMediaTypeChange}"
      @vds-pause="${onVdsPause}"
      @vds-play="${onVdsPlay}"
      @vds-playing="${onVdsPlaying}"
      @vds-progress="${onVdsProgress}"
      @vds-seeked="${onVdsSeeked}"
      @vds-seeking="${onVdsSeeking}"
      @vds-stalled="${onVdsStalled}"
      @vds-started="${onVdsStarted}"
      @vds-suspend="${onVdsSuspend}"
      @vds-replay="${onVdsReplay}"
      @vds-time-update="${onVdsTimeUpdate}"
      @vds-view-type-change="${onVdsViewTypeChange}"
      @vds-volume-change="${onVdsVolumeChange}"
      @vds-waiting="${onVdsWaiting}"
    >
      <vds-ui slot="ui">
        <h2>Toggles</h2>

        <div style="display: flex;">
          <vds-playback-toggle>
            <span slot="play">Play</span>
            <span slot="pause">Pause</span>
          </vds-playback-toggle>

          <vds-mute-toggle>
            <span slot="mute">Mute</span>
            <span slot="unmute">Unmute</span>
          </vds-mute-toggle>

          <vds-fullscreen-toggle>
            <span slot="enter">Enter Fullscreen</span>
            <span slot="exit">Exit Fullscreen</span>
          </vds-fullscreen-toggle>
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
      </vds-ui>
    </vds-video>

    <style>
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
