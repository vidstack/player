import * as React from 'react';

import { Captions } from '../../ui/captions';
import * as Controls from '../../ui/controls';
import { Time } from '../../ui/time';
import { DefaultLayoutContext } from './context';
import {
  createDefaultMediaLayout,
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
  type DefaultMediaLayoutProps,
} from './shared-layout';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioLayout
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultAudioLayoutProps extends DefaultMediaLayoutProps {}

/**
 * The audio layout is our production-ready UI that's displayed when the media view type is set to
 * 'audio'. It includes support for audio tracks, slider chapters, and captions out of the box. It
 * doesn't support live streams just yet.
 *
 * @attr data-match - Whether this layout is being used (query match).
 * @attr data-size - The active layout size.
 * @example
 * ```tsx
 * <MediaPlayer src="audio.mp3">
 *   <MediaProvider />
 *   <DefaultAudioLayout icons={defaultLayoutIcons} />
 * </MediaPlayer>
 * ```
 */
const DefaultAudioLayout = createDefaultMediaLayout({
  type: 'audio',
  smLayoutWhen: '(width < 576)',
  SmallLayout: DefaultAudioLayoutSmall,
  LargeLayout: DefaultAudioLayoutLarge,
});

DefaultAudioLayout.displayName = 'DefaultAudioLayout';
export { DefaultAudioLayout };

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

DefaultAudioLayoutLarge.displayName = 'DefaultAudioLayoutLarge';
export { DefaultAudioLayoutLarge };

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioLayoutSmall
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioLayoutSmall() {
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

DefaultAudioLayoutSmall.displayName = 'DefaultAudioLayoutSmall';
export { DefaultAudioLayoutSmall };

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioMenus
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioMenus() {
  const { isSmallLayout, noModal } = React.useContext(DefaultLayoutContext),
    placement = noModal ? 'top end' : !isSmallLayout ? 'top end' : null;
  return (
    <>
      <DefaultChaptersMenu tooltip="top" placement={placement} portalClass="vds-audio-layout" />
      <DefaultSettingsMenu tooltip="top end" placement={placement} portalClass="vds-audio-layout" />
    </>
  );
}

DefaultAudioMenus.displayName = 'DefaultAudioMenus';
