import * as React from 'react';
import { Captions } from '../../ui/captions';
import * as Controls from '../../ui/controls';
import { Time } from '../../ui/time';
import { DefaultUIContext } from './context';
import {
  createDefaultMediaUI,
  DefaultCaptionButton,
  DefaultChaptersMenu,
  DefaultChapterTitle,
  DefaultMuteButton,
  DefaultPlayButton,
  DefaultSeekButton,
  DefaultSettingsMenu,
  DefaultTimeGroup,
  DefaultTimeSlider,
  DefaultVolumeSlider,
  type DefaultMediaUIProps,
} from './shared-ui';

export interface DefaultAudioUIProps extends DefaultMediaUIProps {}

const DefaultAudioUI = createDefaultMediaUI({
  type: 'audio',
  smLayoutWhen: '(width < 576)',
  SmallLayout: DefaultAudioSmallLayout,
  LargeLayout: DefaultAudioLayout,
});

DefaultAudioUI.displayName = 'DefaultAudioUI';
export { DefaultAudioUI };

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioLayout
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioLayout() {
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
          <DefaultTimeGroup />
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

DefaultAudioLayout.displayName = 'DefaultAudioLayout';
export { DefaultAudioLayout };

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioSmallLayout
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioSmallLayout() {
  return (
    <>
      <Captions className="vds-captions" />
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          <DefaultMuteButton tooltip="top start" />
          <DefaultChapterTitle />
          <DefaultCaptionButton tooltip="top center" />
          <DefaultAudioMenus />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          <DefaultTimeSlider />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          <Time className="vds-time" type="current" />
          <div className="vds-controls-spacer" />
          <Time className="vds-time" type="duration" />
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          <div className="vds-controls-spacer" />
          <DefaultSeekButton seconds={-10} tooltip="top center" />
          <DefaultPlayButton tooltip="top center" />
          <DefaultSeekButton seconds={10} tooltip="top center" />
          <div className="vds-controls-spacer" />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

DefaultAudioSmallLayout.displayName = 'DefaultAudioSmallLayout';
export { DefaultAudioSmallLayout };

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioMenus
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioMenus() {
  const { isSmallLayout } = React.useContext(DefaultUIContext),
    placement = !isSmallLayout ? 'top end' : null;
  return (
    <>
      <DefaultChaptersMenu tooltip="top" placement={placement} portalClass="vds-audio-ui" />
      <DefaultSettingsMenu tooltip="top end" placement={placement} portalClass="vds-audio-ui" />
    </>
  );
}

DefaultAudioMenus.displayName = 'DefaultAudioMenus';
