import * as React from 'react';

import { useSignal } from 'maverick.js/react';

import { useMediaState } from '../../../hooks/use-media-state';
import * as Controls from '../../ui/controls';
import { Gesture } from '../../ui/gesture';
import * as Spinner from '../../ui/spinner';
import { Time } from '../../ui/time';
import { useLayoutName } from '../utils';
import { useDefaultLayoutContext } from './context';
import { DefaultKeyboardActionDisplay, DefaultKeyboardStatus } from './keyboard-action-display';
import { createDefaultMediaLayout, type DefaultLayoutProps } from './media-layout';
import {
  DefaultAirPlayButton,
  DefaultCaptionButton,
  DefaultCaptions,
  DefaultChaptersMenu,
  DefaultChapterTitle,
  DefaultControlsSpacer,
  DefaultFullscreenButton,
  DefaultGoogleCastButton,
  DefaultMuteButton,
  DefaultPIPButton,
  DefaultPlayButton,
  DefaultSettingsMenu,
  DefaultTimeInfo,
  DefaultTimeSlider,
  DefaultVolumeSlider,
} from './shared-layout';
import {
  slot,
  useDefaultVideoLayoutSlots,
  type DefaultLayoutMenuSlotName,
  type DefaultVideoLayoutSlots,
  type Slots,
} from './slots';

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoLayout
 * -----------------------------------------------------------------------------------------------*/

const MediaLayout = createDefaultMediaLayout({
  type: 'video',
  smLayoutWhen({ width, height }) {
    return width < 576 || height < 380;
  },
  renderLayout({ streamType, isSmallLayout, isLoadLayout }) {
    return isLoadLayout ? (
      <DefaultVideoLoadLayout />
    ) : streamType === 'unknown' ? (
      <DefaultBufferingIndicator />
    ) : isSmallLayout ? (
      <DefaultVideoSmallLayout />
    ) : (
      <DefaultVideoLargeLayout />
    );
  },
});

export interface DefaultVideoLayoutProps extends DefaultLayoutProps<DefaultVideoLayoutSlots> {}

/**
 * The video layout is our production-ready UI that's displayed when the media view type is set to
 * 'video'. It includes support for picture-in-picture, fullscreen, slider chapters, slider
 * previews, captions, audio/quality settings, live streams, and more out of the box.
 *
 * @attr data-match - Whether this layout is being used.
 * @attr data-size - The active layout size.
 * @example
 * ```tsx
 * <MediaPlayer src="video.mp4">
 *   <MediaProvider />
 *   <DefaultVideoLayout thumbnails="/thumbnails.vtt" icons={defaultLayoutIcons} />
 * </MediaPlayer>
 * ```
 */
function DefaultVideoLayout(props: DefaultVideoLayoutProps) {
  useLayoutName('video');
  return <MediaLayout {...props} />;
}

DefaultVideoLayout.displayName = 'DefaultVideoLayout';
export { DefaultVideoLayout };

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoLargeLayout
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoLargeLayout() {
  const { menuGroup } = useDefaultLayoutContext(),
    baseSlots = useDefaultVideoLayoutSlots(),
    slots = { ...baseSlots, ...baseSlots?.largeLayout };
  return (
    <>
      <DefaultVideoGestures />
      <DefaultVideoKeyboardActionDisplay />
      {slot(slots, 'bufferingIndicator', <DefaultBufferingIndicator />)}
      {slot(slots, 'captions', <DefaultCaptions />)}
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          {slot(slots, 'topControlsGroupStart', null)}
          <DefaultControlsSpacer />
          {slot(slots, 'topControlsGroupCenter', null)}
          <DefaultControlsSpacer />
          {slot(slots, 'topControlsGroupEnd', null)}
          {menuGroup === 'top' && <DefaultVideoMenus slots={slots} />}
        </Controls.Group>

        <DefaultControlsSpacer />

        <Controls.Group className="vds-controls-group">
          {slot(slots, 'centerControlsGroupStart', null)}
          <DefaultControlsSpacer />
          {slot(slots, 'centerControlsGroupCenter', null)}
          <DefaultControlsSpacer />
          {slot(slots, 'centerControlsGroupEnd', null)}
        </Controls.Group>

        <DefaultControlsSpacer />

        <Controls.Group className="vds-controls-group">
          {slot(slots, 'timeSlider', <DefaultTimeSlider />)}
        </Controls.Group>

        <Controls.Group className="vds-controls-group">
          {slot(slots, 'playButton', <DefaultPlayButton tooltip="top start" />)}
          {slot(slots, 'muteButton', <DefaultMuteButton tooltip="top" />)}
          {slot(slots, 'volumeSlider', <DefaultVolumeSlider />)}
          <DefaultTimeInfo slots={slots} />
          {slot(slots, 'chapterTitle', <DefaultChapterTitle />)}
          {slot(slots, 'captionButton', <DefaultCaptionButton tooltip="top" />)}
          {menuGroup === 'bottom' && <DefaultVideoMenus slots={slots} />}
          {slot(slots, 'airPlayButton', <DefaultAirPlayButton tooltip="top" />)}
          {slot(slots, 'googleCastButton', <DefaultGoogleCastButton tooltip="top" />)}
          {slot(slots, 'pipButton', <DefaultPIPButton tooltip="top" />)}
          {slot(slots, 'fullscreenButton', <DefaultFullscreenButton tooltip="top end" />)}
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

DefaultVideoLargeLayout.displayName = 'DefaultVideoLargeLayout';
export { DefaultVideoLargeLayout };

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoSmallLayout
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoSmallLayout() {
  const baseSlots = useDefaultVideoLayoutSlots(),
    slots = { ...baseSlots, ...baseSlots?.smallLayout };
  return (
    <>
      <DefaultVideoGestures />
      <DefaultVideoKeyboardActionDisplay />
      {slot(slots, 'bufferingIndicator', <DefaultBufferingIndicator />)}
      {slot(slots, 'captions', <DefaultCaptions />)}
      <Controls.Root className="vds-controls">
        <Controls.Group className="vds-controls-group">
          {slot(slots, 'topControlsGroupStart', null)}
          {slot(slots, 'airPlayButton', <DefaultAirPlayButton tooltip="top start" />)}
          {slot(slots, 'googleCastButton', <DefaultGoogleCastButton tooltip="top start" />)}
          <DefaultControlsSpacer />
          {slot(slots, 'topControlsGroupCenter', null)}
          <DefaultControlsSpacer />
          {slot(slots, 'captionButton', <DefaultCaptionButton tooltip="bottom" />)}
          <DefaultVideoMenus slots={slots} />
          {slot(slots, 'muteButton', <DefaultMuteButton tooltip="bottom end" />)}
          {slot(slots, 'topControlsGroupEnd', null)}
        </Controls.Group>
        <DefaultControlsSpacer />
        <Controls.Group className="vds-controls-group" style={{ pointerEvents: 'none' }}>
          {slot(slots, 'centerControlsGroupStart', null)}
          <DefaultControlsSpacer />
          {slot(slots, 'centerControlsGroupCenter', null)}
          {slot(slots, 'playButton', <DefaultPlayButton tooltip="top" />)}
          <DefaultControlsSpacer />
          {slot(slots, 'centerControlsGroupEnd', null)}
        </Controls.Group>
        <DefaultControlsSpacer />
        <Controls.Group className="vds-controls-group">
          <DefaultTimeInfo slots={slots} />
          {slot(slots, 'chapterTitle', <DefaultChapterTitle />)}
          {slot(slots, 'fullscreenButton', <DefaultFullscreenButton tooltip="top end" />)}
        </Controls.Group>
        <Controls.Group className="vds-controls-group">
          {slot(slots, 'timeSlider', <DefaultTimeSlider />)}
        </Controls.Group>
      </Controls.Root>
      {slot(slots, 'startDuration', <DefaultVideoStartDuration />)}
    </>
  );
}

DefaultVideoSmallLayout.displayName = 'DefaultVideoSmallLayout';
export { DefaultVideoSmallLayout };

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoStartDuration
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoStartDuration() {
  const $duration = useMediaState('duration');
  if ($duration === 0) return null;
  return (
    <div className="vds-start-duration">
      <Time className="vds-time" type="duration" />
    </div>
  );
}

DefaultVideoStartDuration.displayName = 'DefaultVideoStartDuration';
/* -------------------------------------------------------------------------------------------------
 * DefaultVideoGestures
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoGestures() {
  const { noGestures } = useDefaultLayoutContext();

  if (noGestures) return null;

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
      <Spinner.Root className="vds-buffering-spinner">
        <Spinner.Track className="vds-buffering-track" />
        <Spinner.TrackFill className="vds-buffering-track-fill" />
      </Spinner.Root>
    </div>
  );
}

DefaultBufferingIndicator.displayName = 'DefaultBufferingIndicator';
export { DefaultBufferingIndicator };

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoMenus
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoMenus({ slots }: { slots?: Slots<DefaultLayoutMenuSlotName> }) {
  const { isSmallLayout, noModal, menuGroup } = useDefaultLayoutContext(),
    side = menuGroup === 'top' || isSmallLayout ? 'bottom' : ('top' as const),
    tooltip = `${side} end` as const,
    placement = noModal
      ? (`${side} end` as const)
      : !isSmallLayout
        ? (`${side} end` as const)
        : null;
  return (
    <>
      {slot(
        slots,
        'chaptersMenu',
        <DefaultChaptersMenu
          tooltip={tooltip}
          placement={placement}
          portalClass="vds-video-layout"
        />,
      )}
      {slot(
        slots,
        'settingsMenu',
        <DefaultSettingsMenu
          tooltip={tooltip}
          placement={placement}
          portalClass="vds-video-layout"
          slots={slots}
        />,
      )}
    </>
  );
}

DefaultVideoMenus.displayName = 'DefaultVideoMenus';

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoLoadLayout
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoLoadLayout() {
  const { isSmallLayout } = useDefaultLayoutContext(),
    baseSlots = useDefaultVideoLayoutSlots(),
    slots = { ...baseSlots, ...baseSlots?.[isSmallLayout ? 'smallLayout' : 'largeLayout'] };
  return (
    <div className="vds-load-container">
      {slot(slots, 'bufferingIndicator', <DefaultBufferingIndicator />)}
      {slot(slots, 'loadButton', <DefaultPlayButton tooltip="top" />)}
    </div>
  );
}

DefaultVideoLoadLayout.displayName = 'DefaultVideoLoadLayout';

/* -------------------------------------------------------------------------------------------------
 * DefaultVideoKeyboardActionDisplay
 * -----------------------------------------------------------------------------------------------*/

function DefaultVideoKeyboardActionDisplay() {
  const { noKeyboardAnimations, icons, translations, userPrefersKeyboardAnimations } =
      useDefaultLayoutContext(),
    $userPrefersKeyboardAnimations = useSignal(userPrefersKeyboardAnimations),
    noAnimations = noKeyboardAnimations || !$userPrefersKeyboardAnimations;
  return noAnimations ? (
    <DefaultKeyboardStatus className="vds-sr-only" />
  ) : (
    <DefaultKeyboardActionDisplay icons={icons.KeyboardAction} translations={translations} />
  );
}

DefaultVideoKeyboardActionDisplay.displayName = 'DefaultVideoKeyboardActionDisplay';
