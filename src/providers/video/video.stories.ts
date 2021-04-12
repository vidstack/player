import { html, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

import { VdsMediaEvents } from '../../core';
import {
  buildStorybookControlsFromManifest,
  VdsEventsToStorybookActions,
} from '../../shared/storybook';
import { VDS_VIDEO_ELEMENT_TAG_NAME } from './vds-video';
import { VideoElementProps } from './video.types';

export default {
  title: 'UI/Providers/Video',
  component: VDS_VIDEO_ELEMENT_TAG_NAME,
  argTypes: {
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

type Args = VideoElementProps & VdsEventsToStorybookActions<VdsMediaEvents>;

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
}: Args): TemplateResult {
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
    ></vds-video>
  `;
}

export const Video = Template.bind({});
