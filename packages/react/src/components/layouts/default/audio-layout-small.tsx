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
import { slot, useDefaultAudioLayoutSlots } from './slots';

function DefaultAudioSmallLayout() {
  const slots = useDefaultAudioLayoutSlots()?.smallLayout;
  return (
    <>
      {slot(slots, 'captions', <Captions className="vds-captions" />)}
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          {slot(slots, 'livePlayButton', <DefaultLivePlayButton />)}
          {slot(slots, 'muteButton', <DefaultMuteButton tooltip="top start" />)}
          {slot(slots, 'liveButton', <DefaultLiveButton />)}
          {slot(slots, 'chapterTitle', <DefaultChapterTitle />)}
          {slot(slots, 'captionButton', <DefaultCaptionButton tooltip="top center" />)}
          <DefaultAudioMenus slots={slots} />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          {slot(slots, 'timeSlider', <DefaultTimeSlider />)}
        </Controls.Group>

        <DefaultTimeControlsGroup />
        <DefaultBottomControlsGroup />
      </Controls.Root>
    </>
  );
}

DefaultAudioSmallLayout.displayName = 'DefaultAudioSmallLayout';
export { DefaultAudioSmallLayout };

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
  const live = useMediaState('live'),
    slots = useDefaultAudioLayoutSlots()?.smallLayout;
  return !live ? (
    <Controls.Group className="vds-controls-group">
      {slot(slots, 'currentTime', <Time className="vds-time" type="current" />)}
      <div className="vds-controls-spacer" />
      {slot(slots, 'endTime', <Time className="vds-time" type="duration" />)}
    </Controls.Group>
  ) : null;
}

DefaultTimeControlsGroup.displayName = 'DefaultTimeControlsGroup';

/* -------------------------------------------------------------------------------------------------
 * DefaultBottomControlsGroup
 * -----------------------------------------------------------------------------------------------*/

function DefaultBottomControlsGroup() {
  const canSeek = useMediaState('canSeek'),
    slots = useDefaultAudioLayoutSlots()?.smallLayout;
  return canSeek ? (
    <Controls.Group className="vds-controls-group">
      <div className="vds-controls-spacer" />
      {slot(slots, 'seekBackwardButton', <DefaultSeekButton seconds={-10} tooltip="top center" />)}
      {slot(slots, 'playButton', <DefaultPlayButton tooltip="top center" />)}
      {slot(slots, 'seekForwardButton', <DefaultSeekButton seconds={10} tooltip="top center" />)}
      <div className="vds-controls-spacer" />
    </Controls.Group>
  ) : null;
}

DefaultBottomControlsGroup.displayName = 'DefaultBottomControlsGroup';
