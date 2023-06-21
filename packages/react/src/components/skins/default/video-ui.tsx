import * as React from 'react';

import { Captions } from '../../ui/captions';
import * as Controls from '../../ui/controls';
import { Gesture } from '../../ui/gesture';
import { Time } from '../../ui/time';
import {
  VdsCaptionButton,
  VdsChaptersMenu,
  VdsChapterTitle,
  VdsFullscreenButton,
  VdsMuteButton,
  VdsPIPButton,
  VdsPlayButton,
  VdsSettingsMenu,
  VdsTimeGroup,
  VdsTimeSlider,
  VdsVolumeSlider,
} from './shared-ui';

/* -------------------------------------------------------------------------------------------------
 * VideoMobileLayout
 * -----------------------------------------------------------------------------------------------*/

function VideoMobileLayout() {
  return (
    <>
      <VdsVideoGestures />
      <VdsBufferingIndicator />
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          <div className="vds-controls-spacer" />
          <VdsCaptionButton tooltip="bottom" />
          <VdsChaptersMenu tooltip="bottom" placement="bottom end" />
          <VdsSettingsMenu tooltip="bottom" placement="bottom end" />
          <VdsMuteButton tooltip="bottom end" />
        </Controls.Group>
        <div className="vds-controls-group">
          <VdsPlayButton tooltip="top" />
        </div>
        <Controls.Group className="vds-controls-group">
          <VdsTimeGroup />
          <VdsChapterTitle />
          <div className="vds-controls-spacer" />
          <VdsFullscreenButton tooltip="top end" />
        </Controls.Group>
        <Controls.Group className="vds-controls-group">
          <VdsTimeSlider />
        </Controls.Group>
      </Controls.Root>
      <div className="vds-start-duration">
        <Time className="vds-time" type="duration" />
      </div>
    </>
  );
}

VideoMobileLayout.displayName = 'VideoMobileLayout';
export { VideoMobileLayout };

/* -------------------------------------------------------------------------------------------------
 * VideoDesktopLayout
 * -----------------------------------------------------------------------------------------------*/

function VideoDesktopLayout() {
  return (
    <>
      <VdsVideoGestures />
      <VdsBufferingIndicator />
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          <div className="vds-controls-spacer" />
          <VdsChaptersMenu tooltip="bottom end" placement="bottom end" />
          <VdsSettingsMenu tooltip="bottom end" placement="bottom end" />
        </Controls.Group>

        <div className="vds-controls-spacer" />

        <Controls.Group className="vds-controls-group">
          <VdsTimeSlider />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          <VdsPlayButton tooltip="top start" />
          <VdsMuteButton tooltip="top" />
          <VdsVolumeSlider />
          <VdsTimeGroup />
          <VdsChapterTitle />
          <VdsCaptionButton tooltip="top" />
          <VdsPIPButton tooltip="top" />
          <VdsFullscreenButton tooltip="top end" />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

VideoDesktopLayout.displayName = 'VideoDesktopLayout';
export { VideoDesktopLayout };

function VdsVideoGestures() {
  return (
    <div className="vds-gestures">
      <Gesture className="vds-gesture" event="pointerup" action="toggle:paused" />
      <Gesture className="vds-gesture" event="pointerup" action="toggle:controls" />
      <Gesture className="vds-gesture" event="dblpointerup" action="toggle:fullscreen" />
      <Gesture className="vds-gesture" event="dblpointerup" action="seek:-10" />
      <Gesture className="vds-gesture" event="dblpointerup" action="seek:10" />
    </div>
  );
}

VdsVideoGestures.displayName = 'VdsVideoGestures';

function VdsBufferingIndicator() {
  return (
    <div className="vds-buffering-indicator">
      <svg className="vds-buffering-icon" fill="none" viewBox="0 0 120 120" aria-hidden="true">
        <circle
          className="vds-buffering-track"
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
        ></circle>
        <circle
          className="vds-buffering-track-fill"
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          pathLength="100"
        ></circle>
      </svg>
    </div>
  );
}

VdsBufferingIndicator.displayName = 'VdsBufferingIndicator';
