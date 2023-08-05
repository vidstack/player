/* -------------------------------------------------------------------------------------------------
 * AudioMobileLayout
 * -----------------------------------------------------------------------------------------------*/

import * as React from 'react';
import { Captions } from '../../ui/captions';
import * as Controls from '../../ui/controls';
import { Time } from '../../ui/time';
import {
  VdsCaptionButton,
  VdsChaptersMenu,
  VdsChapterTitle,
  VdsMuteButton,
  VdsPlayButton,
  VdsSeekButton,
  VdsSettingsMenu,
  VdsTimeGroup,
  VdsTimeSlider,
  VdsVolumeSlider,
} from './shared-ui';

function AudioMobileLayout() {
  return (
    <>
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          <VdsMuteButton tooltip="top start" />
          <VdsChapterTitle />
          <VdsCaptionButton tooltip="top center" />
          <VdsChaptersMenu tooltip="top center" placement="top" />
          <VdsSettingsMenu tooltip="top end" placement="top end" />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          <VdsTimeSlider />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          <Time className="vds-time" type="current" />
          <div className="vds-controls-spacer" />
          <Time className="vds-time" type="duration" />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          <div className="vds-controls-spacer" />
          <VdsSeekButton seconds={-10} tooltip="top center" />
          <VdsPlayButton tooltip="top center" />
          <VdsSeekButton seconds={10} tooltip="top center" />
          <div className="vds-controls-spacer" />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

AudioMobileLayout.displayName = 'AudioMobileLayout';
export { AudioMobileLayout };

/* -------------------------------------------------------------------------------------------------
 * AudioDesktopLayout
 * -----------------------------------------------------------------------------------------------*/

function AudioDesktopLayout() {
  return (
    <>
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          <VdsTimeSlider />
        </Controls.Group>
        <Controls.Group className="vds-controls-group">
          <VdsSeekButton seconds={-10} tooltip="top start" />
          <VdsPlayButton tooltip="top center" />
          <VdsSeekButton seconds={10} tooltip="top center" />
          <VdsTimeGroup />
          <VdsChapterTitle />
          <VdsMuteButton tooltip="top center" />
          <VdsVolumeSlider />
          <VdsCaptionButton tooltip="top center" />
          <VdsChaptersMenu tooltip="top center" placement="top end" />
          <VdsSettingsMenu tooltip="top end" placement="top end" />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

AudioDesktopLayout.displayName = 'AudioDesktopLayout';
export { AudioDesktopLayout };
