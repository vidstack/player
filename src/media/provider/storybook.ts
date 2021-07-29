import { storybookAction, StorybookControl } from '../../base/storybook';

export const MEDIA_PROVIDER_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  autoplay: { control: false },
  controls: { control: StorybookControl.Boolean, defaultValue: true },
  currentTime: { control: StorybookControl.Number, defaultValue: 0 },
  loop: { control: StorybookControl.Boolean },
  muted: { control: StorybookControl.Boolean },
  paused: { control: StorybookControl.Boolean, defaultValue: true },
  playsinline: { control: StorybookControl.Boolean },
  volume: {
    control: {
      type: StorybookControl.Number,
      step: 0.05
    },
    defaultValue: 0.5
  },
  // Media Actions
  onAbort: storybookAction('vds-abort'),
  onCanPlay: storybookAction('vds-can-play'),
  onCanPlayThrough: storybookAction('vds-can-play-through'),
  onDurationChange: storybookAction('vds-duration-change'),
  onEmptied: storybookAction('vds-emptied'),
  onEnded: storybookAction('vds-ended'),
  onError: storybookAction('vds-error'),
  onFullscreenChange: storybookAction('vds-fullscreen-change'),
  onLoadedData: storybookAction('vds-loaded-data'),
  onLoadedMetadata: storybookAction('vds-loaded-metadata'),
  onLoadStart: storybookAction('vds-load-start'),
  onMediaTypeChange: storybookAction('vds-media-type-change'),
  onPause: storybookAction('vds-pause'),
  onPlay: storybookAction('vds-play'),
  onPlaying: storybookAction('vds-playing'),
  onProgress: storybookAction('vds-progress'),
  onReplay: storybookAction('vds-replay'),
  onSeeked: storybookAction('vds-seeked'),
  onSeeking: storybookAction('vds-seeking'),
  onStalled: storybookAction('vds-stalled'),
  onStarted: storybookAction('vds-started'),
  onSuspend: storybookAction('vds-suspend'),
  onTimeUpdate: storybookAction('vds-time-update'),
  onViewTypeChange: storybookAction('vds-view-type-change'),
  onVolumeChange: storybookAction('vds-volume-change'),
  onWaiting: storybookAction('vds-waiting'),
  // Media Provider Actions
  onMediaProviderConnect: storybookAction('vds-media-provider-connect')
};
