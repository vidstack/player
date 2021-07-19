import { storybookAction } from '../../foundation/storybook/index.js';
import { ControlsChangeEvent, IdleChangeEvent } from '../controls/index.js';
import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent,
  MuteRequestEvent,
  PauseRequestEvent,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent,
  UnmuteRequestEvent,
  VolumeChangeRequestEvent
} from '../request.events.js';

export const MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES = {
  onControlsChange: storybookAction(ControlsChangeEvent.TYPE),
  onEnterFullscreenRequest: storybookAction(EnterFullscreenRequestEvent.TYPE),
  onExitFullscreenRequest: storybookAction(ExitFullscreenRequestEvent.TYPE),
  onIdleChange: storybookAction(IdleChangeEvent.TYPE),
  onMuteRequest: storybookAction(MuteRequestEvent.TYPE),
  onPauseRequest: storybookAction(PauseRequestEvent.TYPE),
  onPlayRequest: storybookAction(PlayRequestEvent.TYPE),
  onSeekingRequest: storybookAction(SeekingRequestEvent.TYPE),
  onSeekRequest: storybookAction(SeekRequestEvent.TYPE),
  onUnmuteRequest: storybookAction(UnmuteRequestEvent.TYPE),
  onVolumeChangeRequest: storybookAction(VolumeChangeRequestEvent.TYPE)
};
