import * as React from 'react';

import { Captions } from '../../ui/captions';
import * as Controls from '../../ui/controls';
import { DefaultAudioMenus } from './audio-menus';
import {
  DefaultCaptionButton,
  DefaultChapterTitle,
  DefaultMuteButton,
  DefaultPlayButton,
  DefaultSeekButton,
  DefaultTimeInfo,
  DefaultTimeSlider,
  DefaultVolumeSlider,
} from './shared-layout';
import { slot, useDefaultAudioLayoutSlots } from './slots';

function DefaultAudioLargeLayout() {
  const slots = useDefaultAudioLayoutSlots()?.largeLayout;
  return (
    <>
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          {slot(slots, 'timeSlider', <DefaultTimeSlider />)}
        </Controls.Group>
        <Controls.Group className="vds-controls-group">
          {slot(
            slots,
            'seekBackwardButton',
            <DefaultSeekButton seconds={-10} tooltip="top start" />,
          )}
          {slot(slots, 'playButton', <DefaultPlayButton tooltip="top center" />)}
          {slot(
            slots,
            'seekForwardButton',
            <DefaultSeekButton seconds={10} tooltip="top center" />,
          )}
          <DefaultTimeInfo slots={slots} />
          {slot(slots, 'chapterTitle', <DefaultChapterTitle />)}
          {slot(slots, 'muteButton', <DefaultMuteButton tooltip="top center" />)}
          {slot(slots, 'volumeSlider', <DefaultVolumeSlider />)}
          {slot(slots, 'captionButton', <DefaultCaptionButton tooltip="top center" />)}
          <DefaultAudioMenus slots={slots} />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

DefaultAudioLargeLayout.displayName = 'DefaultAudioLargeLayout';
export { DefaultAudioLargeLayout };
