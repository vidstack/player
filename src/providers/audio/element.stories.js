import './define.js';

import { on } from '@base/directives/index.js';
import { StorybookControl } from '@base/storybook/index.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { HTML5_MEDIA_ELEMENT_STORYBOOK_ARG_TYPES } from '../html5/storybook.js';
import { AUDIO_ELEMENT_TAG_NAME } from './AudioElement.js';

export const AUDIO_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...HTML5_MEDIA_ELEMENT_STORYBOOK_ARG_TYPES,
  src: {
    control: StorybookControl.Text,
    defaultValue: 'https://media-files.vidstack.io/audio.mp3'
  }
};

export default {
  title: 'Providers/Audio',
  component: AUDIO_ELEMENT_TAG_NAME,
  argTypes: AUDIO_ELEMENT_STORYBOOK_ARG_TYPES,
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
    <vds-audio
      width=${ifDefined(width)}
      volume=${volume}
      src=${src}
      preload=${ifDefined(preload)}
      height=${ifDefined(height)}
      current-time=${currentTime}
      crossorigin=${ifDefined(crossOrigin)}
      controlslist=${ifDefined(controlsList)}
      ?playsinline=${playsinline}
      ?paused=${paused}
      ?muted=${muted}
      ?loop=${loop}
      ?disableremoteplayback=${disableRemotePlayback}
      ?controls=${controls}
      ?autoplay=${autoplay}
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
    ></vds-audio>
  `;
}

export const Audio = Template.bind({});
