import './define.js';

import { on } from '@base/directives/index.js';
import { StorybookControl } from '@base/storybook/index.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { HTML5_MEDIA_ELEMENT_STORYBOOK_ARG_TYPES } from '../html5/storybook.js';
import { VIDEO_ELEMENT_TAG_NAME } from './VideoElement.js';

export const VIDEO_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...HTML5_MEDIA_ELEMENT_STORYBOOK_ARG_TYPES,
  autoPiP: { control: StorybookControl.Boolean },
  disablePiP: { control: StorybookControl.Boolean },
  poster: {
    control: StorybookControl.Text,
    defaultValue: 'https://media-files.vidstack.io/poster.png'
  },
  src: {
    control: StorybookControl.Text,
    defaultValue:
      'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8/medium.mp4'
  }
};

export default {
  title: 'Providers/Video',
  component: VIDEO_ELEMENT_TAG_NAME,
  argTypes: VIDEO_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
  // Properties
  autoplay,
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
  controls = true,
  crossOrigin,
  preload,
  controlsList,
  autoPiP,
  disablePiP,
  disableRemotePlayback,
  // Media Provider Actions
  onMediaProviderConnect,
  // Media Actions
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
  onWaiting
}) {
  return html`
    <vds-video
      width=${ifDefined(width)}
      volume=${volume}
      src=${src}
      preload=${ifDefined(preload)}
      poster=${ifDefined(poster)}
      height=${ifDefined(height)}
      current-time=${currentTime}
      crossorigin=${ifDefined(crossOrigin)}
      controlslist=${ifDefined(controlsList)}
      ?playsinline=${playsinline}
      ?paused=${paused}
      ?muted=${muted}
      ?loop=${loop}
      ?disableremoteplayback=${disableRemotePlayback}
      ?disablepictureinpicture=${disablePiP}
      ?controls=${controls}
      ?autoplay=${autoplay}
      ?autopictureinpicture=${autoPiP}
      ${on('vds-abort', onAbort)}
      ${on('vds-can-play', onCanPlay)}
      ${on('vds-can-play-through', onCanPlayThrough)}
      ${on('vds-duration-change', onDurationChange)}
      ${on('vds-emptied', onEmptied)}
      ${on('vds-ended', onEnded)}
      ${on('vds-error', onError)}
      ${on('vds-fullscreen-change', onFullscreenChange)}
      ${on('vds-loaded-data', onLoadedData)}
      ${on('vds-loaded-metadata', onLoadedMetadata)}
      ${on('vds-load-start', onLoadStart)}
      ${on('vds-media-provider-connect', onMediaProviderConnect)}
      ${on('vds-media-type-change', onMediaTypeChange)}
      ${on('vds-pause', onPause)}
      ${on('vds-play', onPlay)}
      ${on('vds-playing', onPlaying)}
      ${on('vds-progress', onProgress)}
      ${on('vds-replay', onReplay)}
      ${on('vds-seeked', onSeeked)}
      ${on('vds-seeking', onSeeking)}
      ${on('vds-stalled', onStalled)}
      ${on('vds-started', onStarted)}
      ${on('vds-suspend', onSuspend)}
      ${on('vds-time-update', onTimeUpdate)}
      ${on('vds-view-type-change', onViewTypeChange)}
      ${on('vds-volume-change', onVolumeChange)}
      ${on('vds-waiting', onWaiting)}
    ></vds-video>
  `;
}

export const Video = Template.bind({});
