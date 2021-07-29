import { storybookAction } from '../../base/storybook';

export const MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES = {
  onControlsChange: storybookAction('vds-controls-change'),
  onEnterFullscreenRequest: storybookAction('vds-enter-fullscreen-request'),
  onExitFullscreenRequest: storybookAction('vds-exit-fullscreen-request'),
  onIdleChange: storybookAction('vds-idle-change'),
  onMuteRequest: storybookAction('vds-mute-request'),
  onPauseRequest: storybookAction('vds-pause-request'),
  onPlayRequest: storybookAction('vds-play-request'),
  onSeekingRequest: storybookAction('vds-seeking-request'),
  onSeekRequest: storybookAction('vds-seek-request'),
  onUnmuteRequest: storybookAction('vds-unmute-request'),
  onVolumeChangeRequest: storybookAction('vds-volume-change-request')
};
