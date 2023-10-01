import * as React from 'react';

import { useMediaState } from '../../../hooks/use-media-state';
import { Captions } from '../../ui/captions';
import * as Controls from '../../ui/controls';
import { Time } from '../../ui/time';
import { DefaultAudioMenus } from './audio-menus';
import {
  DefaultCaptionButton,
  DefaultChapterTitle,
  DefaultLiveButton,
  DefaultMuteButton,
  DefaultPlayButton,
  DefaultSeekButton,
  DefaultTimeSlider,
} from './shared-layout';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioLayoutSmall
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioLayoutSmall() {
  return (
    <>
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          <DefaultLivePlayButton />
          <DefaultMuteButton tooltip="top start" />
          <DefaultLiveButton />
          <DefaultChapterTitle />
          <DefaultCaptionButton tooltip="top center" />
          <DefaultAudioMenus />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          <DefaultTimeSlider />
        </Controls.Group>

        <DefaultTimeControlsGroup />
        <DefaultBottomControlsGroup />
      </Controls.Root>
    </>
  );
}

DefaultAudioLayoutSmall.displayName = 'DefaultAudioLayoutSmall';
export { DefaultAudioLayoutSmall };

/* -------------------------------------------------------------------------------------------------
 * DefaultLivePlayButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultLivePlayButton() {
  const live = useMediaState('live'),
    canSeek = useMediaState('canSeek');
  return live && !canSeek ? <DefaultPlayButton tooltip="top start" /> : null;
}

DefaultLivePlayButton.displayName = 'DefaultLivePlayButton';

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeControlsGroup
 * -----------------------------------------------------------------------------------------------*/

function DefaultTimeControlsGroup() {
  const live = useMediaState('live');
  return !live ? (
    <Controls.Group className="vds-controls-group">
      <Time className="vds-time" type="current" />
      <div className="vds-controls-spacer" />
      <Time className="vds-time" type="duration" />
    </Controls.Group>
  ) : null;
}

DefaultTimeControlsGroup.displayName = 'DefaultTimeControlsGroup';

/* -------------------------------------------------------------------------------------------------
 * DefaultBottomControlsGroup
 * -----------------------------------------------------------------------------------------------*/

function DefaultBottomControlsGroup() {
  const canSeek = useMediaState('canSeek');
  return canSeek ? (
    <Controls.Group className="vds-controls-group">
      <div className="vds-controls-spacer" />
      <DefaultSeekButton seconds={-10} tooltip="top center" />
      <DefaultPlayButton tooltip="top center" />
      <DefaultSeekButton seconds={10} tooltip="top center" />
      <div className="vds-controls-spacer" />
    </Controls.Group>
  ) : null;
}

DefaultBottomControlsGroup.displayName = 'DefaultBottomControlsGroup';
