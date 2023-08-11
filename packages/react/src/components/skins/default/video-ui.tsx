import * as React from 'react';
import { Captions } from '../../ui/captions';
import * as Controls from '../../ui/controls';
import { Gesture } from '../../ui/gesture';
import { Time } from '../../ui/time';
import { DefaultUIContext } from './context';
import {
  createDefaultMediaUI,
  DefaultCaptionButton,
  DefaultChaptersMenu,
  DefaultChapterTitle,
  DefaultFullscreenButton,
  DefaultMuteButton,
  DefaultPIPButton,
  DefaultPlayButton,
  DefaultSettingsMenu,
  DefaultTimeGroup,
  DefaultTimeSlider,
  DefaultVolumeSlider,
  type DefaultMediaUIProps,
} from './shared-ui';

export interface DefaultVideoUIProps extends DefaultMediaUIProps {}

const DefaultVideoUI = createDefaultMediaUI({
  type: 'video',
  smLayoutWhen: '(width < 576) or (height < 380)',
  SmallLayout: DefaultVideoSmallLayout,
  LargeLayout: DefaultVideoLayout,
});

DefaultVideoUI.displayName = 'DefaultVideoUI';
export { DefaultVideoUI };

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoLayout
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoLayout() {
  return (
    <>
      <DefaultVideoGestures />
      <DefaultBufferingIndicator />
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          <div className="vds-controls-spacer" />
          <DefaultVideoMenus />
        </Controls.Group>

        <div className="vds-controls-spacer" />

        <Controls.Group className="vds-controls-group">
          <DefaultTimeSlider />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          <DefaultPlayButton tooltip="top start" />
          <DefaultMuteButton tooltip="top" />
          <DefaultVolumeSlider />
          <DefaultTimeGroup />
          <DefaultChapterTitle />
          <DefaultCaptionButton tooltip="top" />
          <DefaultPIPButton tooltip="top" />
          <DefaultFullscreenButton tooltip="top end" />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

DefaultVideoLayout.displayName = 'DefaultVideoLayout';
export { DefaultVideoLayout };

/* -------------------------------------------------------------------------------------------------
 * DefaultSmallVideoLayout
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoSmallLayout() {
  return (
    <>
      <DefaultVideoGestures />
      <DefaultBufferingIndicator />
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          <div className="vds-controls-spacer" />
          <DefaultCaptionButton tooltip="bottom" />
          <DefaultVideoMenus />
          <DefaultMuteButton tooltip="bottom end" />
        </Controls.Group>
        <div className="vds-controls-group">
          <DefaultPlayButton tooltip="top" />
        </div>
        <Controls.Group className="vds-controls-group">
          <DefaultTimeGroup />
          <DefaultChapterTitle />
          <div className="vds-controls-spacer" />
          <DefaultFullscreenButton tooltip="top end" />
        </Controls.Group>
        <Controls.Group className="vds-controls-group">
          <DefaultTimeSlider />
        </Controls.Group>
      </Controls.Root>
      <div className="vds-start-duration">
        <Time className="vds-time" type="duration" />
      </div>
    </>
  );
}

DefaultVideoSmallLayout.displayName = 'DefaultVideoSmallLayout';
export { DefaultVideoSmallLayout };

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoGestures
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoGestures() {
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

DefaultVideoGestures.displayName = 'DefaultVideoGestures';
export { DefaultVideoGestures };

/* -------------------------------------------------------------------------------------------------
 * DefaultBufferingIndicator
 * -----------------------------------------------------------------------------------------------*/

function DefaultBufferingIndicator() {
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

DefaultBufferingIndicator.displayName = 'DefaultBufferingIndicator';
export { DefaultBufferingIndicator };

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoMenus
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoMenus() {
  const { isSmallLayout } = React.useContext(DefaultUIContext),
    placement = !isSmallLayout ? 'bottom end' : null;
  return (
    <>
      <DefaultChaptersMenu tooltip="bottom" placement={placement} portalClass="vds-video-ui" />
      <DefaultSettingsMenu tooltip="bottom" placement={placement} portalClass="vds-video-ui" />
    </>
  );
}

DefaultVideoMenus.displayName = 'DefaultVideoMenus';
