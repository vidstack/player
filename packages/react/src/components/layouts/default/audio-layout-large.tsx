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

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioLayoutLarge
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioLayoutLarge() {
  return (
    <>
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          <DefaultTimeSlider />
        </Controls.Group>
        <Controls.Group className="vds-controls-group">
          <DefaultSeekButton seconds={-10} tooltip="top start" />
          <DefaultPlayButton tooltip="top center" />
          <DefaultSeekButton seconds={10} tooltip="top center" />
          <DefaultTimeInfo />
          <DefaultChapterTitle />
          <DefaultMuteButton tooltip="top center" />
          <DefaultVolumeSlider />
          <DefaultCaptionButton tooltip="top center" />
          <DefaultAudioMenus />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

DefaultAudioLayoutLarge.displayName = 'DefaultAudioLayoutLarge';
export { DefaultAudioLayoutLarge };
