import '../bundle/define';

import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import {
  MediaContainerElementProps,
  VdsMediaContainerEvents,
  VdsMediaEvents,
  VdsMediaProviderEvents,
  VdsMediaRequestEvents,
} from '../bundle/define';
import { VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME } from '../core/media/controller/vds-media-controller';
import {
  VDS_VIDEO_ELEMENT_TAG_NAME,
  VideoElementProps,
} from '../providers/video';
import {
  buildStorybookControlsFromManifest,
  DOMEventsToStorybookActions,
} from '../shared/storybook';

export default {
  title: 'UI/Foundation',
  component: VDS_VIDEO_ELEMENT_TAG_NAME,
  argTypes: {
    aspectRatio: {
      control: 'text',
      description:
        'The aspect ratio of the media container expressed as `width:height` (eg: `16:9`).',
      defaultValue: undefined,
      table: {
        category: 'properties',
        type: {
          summary: 'string | undefined',
        },
      },
    },
    ...buildStorybookControlsFromManifest(VDS_VIDEO_ELEMENT_TAG_NAME),
    src: {
      defaultValue:
        'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8/medium.mp4',
    },
    poster: {
      defaultValue: 'https://media-files.vidstack.io/poster.png',
    },
  },
};

type Args = VideoElementProps &
  MediaContainerElementProps &
  DOMEventsToStorybookActions<VdsMediaEvents> &
  DOMEventsToStorybookActions<VdsMediaProviderEvents> &
  DOMEventsToStorybookActions<VdsMediaRequestEvents> &
  DOMEventsToStorybookActions<VdsMediaContainerEvents>;

function Template({
  // Media Provider Props
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
  // Media Container Props
  aspectRatio,
  // Media Provider Events
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
  // Media Container Events
  onVdsMediaContainerConnect,
  // Media Request Events
  onVdsMuteRequest,
  onVdsUnmuteRequest,
  onVdsEnterFullscreenRequest,
  onVdsExitFullscreenRequest,
  onVdsPlayRequest,
  onVdsPauseRequest,
  onVdsSeekRequest,
  onVdsSeekingRequest,
  onVdsVolumeChangeRequest,
}: Args) {
  return html`
    <vds-media-controller
      @vds-mute-request="${onVdsMuteRequest}"
      @vds-unmute-request="${onVdsUnmuteRequest}"
      @vds-enter-fullscreen-request="${onVdsEnterFullscreenRequest}"
      @vds-exit-fullscreen-request="${onVdsExitFullscreenRequest}"
      @vds-play-request="${onVdsPlayRequest}"
      @vds-pause-request="${onVdsPauseRequest}"
      @vds-seek-request="${onVdsSeekRequest}"
      @vds-seeking-request="${onVdsSeekingRequest}"
      @vds-volume-change-request="${onVdsVolumeChangeRequest}"
    >
      <vds-media-container
        aspect-ratio="${ifDefined(aspectRatio)}"
        @vds-media-container-connect="${onVdsMediaContainerConnect}"
      >
        <vds-video
          slot="media"
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
          @vds-media-provider-connect="${onVdsMediaProviderConnect}"
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
        ></vds-video>

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
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-media-container::part(ui) {
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
