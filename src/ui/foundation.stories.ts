import '../bundle/define';

import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import {
  VIDEO_PROVIDER_STORYBOOK_ARG_TYPES,
  VideoProviderActions,
  VideoProviderProps,
} from '../providers/video';
import { Story } from '../shared/storybook';

export default {
  title: 'UI/Foundation',
  argTypes: VIDEO_PROVIDER_STORYBOOK_ARG_TYPES,
};

const Template: Story<VideoProviderProps & VideoProviderActions> = ({
  src,
  poster,
  paused,
  volume,
  currentTime = 0,
  muted,
  playsinline,
  loop,
  controls,
  onAbort,
  onCanPlay,
  onCanPlayThrough,
  onConnect,
  onDisconnect,
  onDurationChange,
  onEmptied,
  onEnded,
  onError,
  onFullscreenChange,
  onLoadedData,
  onLoadedMetadata,
  onLoadStart,
  onMediaTypeChange,
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
}) =>
  html`
    <vds-video
      src="${src}"
      poster="${ifDefined(poster)}"
      ?paused="${paused}"
      volume="${volume}"
      current-time="${currentTime}"
      ?muted="${muted}"
      ?playsinline="${playsinline}"
      ?loop="${loop}"
      ?controls="${controls}"
      @vds-abort="${onAbort}"
      @vds-can-play="${onCanPlay}"
      @vds-can-play-through="${onCanPlayThrough}"
      @vds-connect="${onConnect}"
      @vds-disconnect="${onDisconnect}"
      @vds-duration-change="${onDurationChange}"
      @vds-emptied="${onEmptied}"
      @vds-ended="${onEnded}"
      @vds-error="${onError}"
      @vds-fullscreen-change="${onFullscreenChange}"
      @vds-loaded-data="${onLoadedData}"
      @vds-load-start="${onLoadStart}"
      @vds-loaded-metadata="${onLoadedMetadata}"
      @vds-media-type-change="${onMediaTypeChange}"
      @vds-pause="${onPause}"
      @vds-play="${onPlay}"
      @vds-playing="${onPlaying}"
      @vds-progress="${onProgress}"
      @vds-seeked="${onSeeked}"
      @vds-seeking="${onSeeking}"
      @vds-stalled="${onStalled}"
      @vds-started="${onStarted}"
      @vds-suspend="${onSuspend}"
      @vds-replay="${onReplay}"
      @vds-time-update="${onTimeUpdate}"
      @vds-view-type-change="${onViewTypeChange}"
      @vds-volume-change="${onVolumeChange}"
      @vds-waiting="${onWaiting}"
    >
      <vds-ui slot="ui">
        <h2>Toggles</h2>

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

export const Foundation = Template.bind({});
