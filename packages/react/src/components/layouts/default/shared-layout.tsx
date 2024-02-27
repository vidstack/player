import * as React from 'react';

import { useSignal } from 'maverick.js/react';
import { isArray, isKeyboardClick, uppercaseFirstChar } from 'maverick.js/std';
import { isTrackCaptionKind, type DefaultLayoutWord, type TooltipPlacement } from 'vidstack';

import { useAudioOptions } from '../../../hooks/options/use-audio-options';
import { useCaptionOptions } from '../../../hooks/options/use-caption-options';
import { useChapterOptions } from '../../../hooks/options/use-chapter-options';
import { useVideoQualityOptions } from '../../../hooks/options/use-video-quality-options';
import { useResizeObserver } from '../../../hooks/use-dom';
import { useMediaContext } from '../../../hooks/use-media-context';
import { useMediaState } from '../../../hooks/use-media-state';
import { isRemotionSource } from '../../../providers/remotion/type-check';
import { MediaAnnouncer } from '../../announcer';
import type { TimeSliderInstance } from '../../primitives/instances';
import { AirPlayButton } from '../../ui/buttons/airplay-button';
import { CaptionButton } from '../../ui/buttons/caption-button';
import { FullscreenButton } from '../../ui/buttons/fullscreen-button';
import { GoogleCastButton } from '../../ui/buttons/google-cast-button';
import { LiveButton } from '../../ui/buttons/live-button';
import { MuteButton } from '../../ui/buttons/mute-button';
import { PIPButton } from '../../ui/buttons/pip-button';
import { PlayButton } from '../../ui/buttons/play-button';
import { SeekButton } from '../../ui/buttons/seek-button';
import { Captions } from '../../ui/captions';
import { ChapterTitle } from '../../ui/chapter-title';
import * as Menu from '../../ui/menu';
import * as AudioGainSlider from '../../ui/sliders/audio-gain-slider';
import * as SpeedSlider from '../../ui/sliders/speed-slider';
import * as TimeSlider from '../../ui/sliders/time-slider';
import * as VolumeSlider from '../../ui/sliders/volume-slider';
import * as Thumbnail from '../../ui/thumbnail';
import { Time } from '../../ui/time';
import { Title } from '../../ui/title';
import * as Tooltip from '../../ui/tooltip';
import { RemotionSliderThumbnail, RemotionThumbnail } from '../remotion-ui';
import { useDefaultLayoutContext, useDefaultLayoutWord } from './context';
import { DefaultFontSubmenu } from './font-menu';
import { DefaultSubmenuButton } from './menu-layout';
import { slot, type DefaultLayoutMenuSlotName, type Slots } from './slots';

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

interface DefaultMediaButtonProps {
  tooltip: Tooltip.ContentProps['placement'];
}

interface DefaultMediaMenuProps {
  tooltip: Tooltip.ContentProps['placement'];
  placement: Menu.ContentProps['placement'];
  portalClass?: string;
  slots?: Slots<DefaultLayoutMenuSlotName>;
}

/* -------------------------------------------------------------------------------------------------
 * DefaultAnnouncer
 * -----------------------------------------------------------------------------------------------*/

function DefaultAnnouncer() {
  const { userPrefersAnnouncements, translations } = useDefaultLayoutContext(),
    $userPrefersAnnouncements = useSignal(userPrefersAnnouncements);

  if (!$userPrefersAnnouncements) return null;

  return <MediaAnnouncer translations={translations} />;
}

DefaultAnnouncer.displayName = 'DefaultAnnouncer';
export { DefaultAnnouncer };

/* -------------------------------------------------------------------------------------------------
 * DefaultTooltip
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultTooltipProps {
  content: string;
  placement?: TooltipPlacement;
  children: React.ReactNode;
}

function DefaultTooltip({ content, placement, children }: DefaultTooltipProps) {
  const { showTooltipDelay } = useDefaultLayoutContext();
  return (
    <Tooltip.Root showDelay={showTooltipDelay}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content className="vds-tooltip-content" placement={placement}>
        {content}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

DefaultTooltip.displayName = 'DefaultTooltip';
export { DefaultTooltip };

/* -------------------------------------------------------------------------------------------------
 * DefaultAirPlayButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultAirPlayButton({ tooltip }: DefaultMediaButtonProps) {
  const { icons: Icons } = useDefaultLayoutContext(),
    airPlayText = useDefaultLayoutWord('AirPlay'),
    $state = useMediaState('remotePlaybackState'),
    stateText = useDefaultLayoutWord(uppercaseFirstChar($state) as Capitalize<RemotePlaybackState>),
    label = `${airPlayText} ${stateText}`,
    Icon =
      ($state === 'connecting'
        ? Icons.AirPlayButton.Connecting
        : $state === 'connected'
          ? Icons.AirPlayButton.Connected
          : null) ?? Icons.AirPlayButton.Default;
  return (
    <DefaultTooltip content={airPlayText} placement={tooltip}>
      <AirPlayButton className="vds-airplay-button vds-button" aria-label={label}>
        <Icon className="vds-icon" />
      </AirPlayButton>
    </DefaultTooltip>
  );
}

DefaultAirPlayButton.displayName = 'DefaultAirPlayButton';
export { DefaultAirPlayButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultGoogleCastButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultGoogleCastButton({ tooltip }: DefaultMediaButtonProps) {
  const { icons: Icons } = useDefaultLayoutContext(),
    googleCastText = useDefaultLayoutWord('Google Cast'),
    $state = useMediaState('remotePlaybackState'),
    stateText = useDefaultLayoutWord(uppercaseFirstChar($state) as Capitalize<RemotePlaybackState>),
    label = `${googleCastText} ${stateText}`,
    Icon =
      ($state === 'connecting'
        ? Icons.GoogleCastButton.Connecting
        : $state === 'connected'
          ? Icons.GoogleCastButton.Connected
          : null) ?? Icons.GoogleCastButton.Default;
  return (
    <DefaultTooltip content={googleCastText} placement={tooltip}>
      <GoogleCastButton className="vds-google-cast-button vds-button" aria-label={label}>
        <Icon className="vds-icon" />
      </GoogleCastButton>
    </DefaultTooltip>
  );
}

DefaultGoogleCastButton.displayName = 'DefaultGoogleCastButton';
export { DefaultGoogleCastButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultPlayButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultPlayButton({ tooltip }: DefaultMediaButtonProps) {
  const { icons: Icons } = useDefaultLayoutContext(),
    playText = useDefaultLayoutWord('Play'),
    pauseText = useDefaultLayoutWord('Pause'),
    $paused = useMediaState('paused'),
    $ended = useMediaState('ended');
  return (
    <DefaultTooltip content={$paused ? playText : pauseText} placement={tooltip}>
      <PlayButton className="vds-play-button vds-button" aria-label={playText}>
        {$ended ? (
          <Icons.PlayButton.Replay className="vds-icon" />
        ) : $paused ? (
          <Icons.PlayButton.Play className="vds-icon" />
        ) : (
          <Icons.PlayButton.Pause className="vds-icon" />
        )}
      </PlayButton>
    </DefaultTooltip>
  );
}

DefaultPlayButton.displayName = 'DefaultPlayButton';
export { DefaultPlayButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultMuteButton
 * -----------------------------------------------------------------------------------------------*/

const DefaultMuteButton = React.forwardRef<HTMLButtonElement, DefaultMediaButtonProps>(
  ({ tooltip }, forwardRef) => {
    const { icons: Icons } = useDefaultLayoutContext(),
      muteText = useDefaultLayoutWord('Mute'),
      unmuteText = useDefaultLayoutWord('Unmute'),
      $muted = useMediaState('muted'),
      $volume = useMediaState('volume');
    return (
      <DefaultTooltip content={$muted ? unmuteText : muteText} placement={tooltip}>
        <MuteButton className="vds-mute-button vds-button" aria-label={muteText} ref={forwardRef}>
          {$muted || $volume == 0 ? (
            <Icons.MuteButton.Mute className="vds-icon" />
          ) : $volume < 0.5 ? (
            <Icons.MuteButton.VolumeLow className="vds-icon" />
          ) : (
            <Icons.MuteButton.VolumeHigh className="vds-icon" />
          )}
        </MuteButton>
      </DefaultTooltip>
    );
  },
);

DefaultMuteButton.displayName = 'DefaultMuteButton';
export { DefaultMuteButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultCaptionButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultCaptionButton({ tooltip }: DefaultMediaButtonProps) {
  const { icons: Icons } = useDefaultLayoutContext(),
    captionsText = useDefaultLayoutWord('Captions'),
    onText = useDefaultLayoutWord('Closed-Captions On'),
    offText = useDefaultLayoutWord('Closed-Captions Off'),
    $track = useMediaState('textTrack'),
    isOn = $track && isTrackCaptionKind($track);
  return (
    <DefaultTooltip content={isOn ? onText : offText} placement={tooltip}>
      <CaptionButton className="vds-caption-button vds-button" aria-label={captionsText}>
        {isOn ? (
          <Icons.CaptionButton.On className="vds-icon" />
        ) : (
          <Icons.CaptionButton.Off className="vds-icon" />
        )}
      </CaptionButton>
    </DefaultTooltip>
  );
}

DefaultCaptionButton.displayName = 'DefaultCaptionButton';
export { DefaultCaptionButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultPIPButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultPIPButton({ tooltip }: DefaultMediaButtonProps) {
  const { icons: Icons } = useDefaultLayoutContext(),
    pipText = useDefaultLayoutWord('PiP'),
    enterText = useDefaultLayoutWord('Enter PiP'),
    exitText = useDefaultLayoutWord('Exit PiP'),
    $pip = useMediaState('pictureInPicture');
  return (
    <DefaultTooltip content={$pip ? exitText : enterText} placement={tooltip}>
      <PIPButton className="vds-pip-button vds-button" aria-label={pipText}>
        {$pip ? (
          <Icons.PIPButton.Exit className="vds-icon" />
        ) : (
          <Icons.PIPButton.Enter className="vds-icon" />
        )}
      </PIPButton>
    </DefaultTooltip>
  );
}

DefaultPIPButton.displayName = 'DefaultPIPButton';
export { DefaultPIPButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultFullscreenButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultFullscreenButton({ tooltip }: DefaultMediaButtonProps) {
  const { icons: Icons } = useDefaultLayoutContext(),
    fullscreenText = useDefaultLayoutWord('Fullscreen'),
    enterText = useDefaultLayoutWord('Enter Fullscreen'),
    exitText = useDefaultLayoutWord('Exit Fullscreen'),
    $fullscreen = useMediaState('fullscreen');
  return (
    <DefaultTooltip content={$fullscreen ? exitText : enterText} placement={tooltip}>
      <FullscreenButton className="vds-fullscreen-button vds-button" aria-label={fullscreenText}>
        {$fullscreen ? (
          <Icons.FullscreenButton.Exit className="vds-icon" />
        ) : (
          <Icons.FullscreenButton.Enter className="vds-icon" />
        )}
      </FullscreenButton>
    </DefaultTooltip>
  );
}

DefaultFullscreenButton.displayName = 'DefaultFullscreenButton';
export { DefaultFullscreenButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultSeekButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultSeekButton({
  backward,
  tooltip,
}: DefaultMediaButtonProps & { backward?: boolean }) {
  const { icons: Icons, seekStep } = useDefaultLayoutContext(),
    seekForwardText = useDefaultLayoutWord('Seek Forward'),
    seekBackwardText = useDefaultLayoutWord('Seek Backward'),
    seconds = (backward ? -1 : 1) * seekStep!,
    label = seconds >= 0 ? seekForwardText : seekBackwardText;
  return (
    <DefaultTooltip content={label} placement={tooltip}>
      <SeekButton className="vds-seek-button vds-button" seconds={seconds} aria-label={label}>
        {seconds >= 0 ? (
          <Icons.SeekButton.Forward className="vds-icon" />
        ) : (
          <Icons.SeekButton.Backward className="vds-icon" />
        )}
      </SeekButton>
    </DefaultTooltip>
  );
}

DefaultSeekButton.displayName = 'DefaultSeekButton';
export { DefaultSeekButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultCaptions
 * -----------------------------------------------------------------------------------------------*/

function DefaultCaptions() {
  const exampleText = useDefaultLayoutWord('Captions look like this');
  return <Captions className="vds-captions" exampleText={exampleText} />;
}

DefaultCaptions.displayName = 'DefaultCaptions';
export { DefaultCaptions };

/* -------------------------------------------------------------------------------------------------
 * DefaultVolumeSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultVolumeSlider(props: VolumeSlider.RootProps) {
  const label = useDefaultLayoutWord('Volume');
  return (
    <VolumeSlider.Root className="vds-volume-slider vds-slider" aria-label={label} {...props}>
      <VolumeSlider.Track className="vds-slider-track" />
      <VolumeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <VolumeSlider.Thumb className="vds-slider-thumb" />
      <VolumeSlider.Preview className="vds-slider-preview" noClamp>
        <VolumeSlider.Value className="vds-slider-value" />
      </VolumeSlider.Preview>
    </VolumeSlider.Root>
  );
}

DefaultVolumeSlider.displayName = 'DefaultVolumeSlider';
export { DefaultVolumeSlider };

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultTimeSlider() {
  const [instance, setInstance] = React.useState<TimeSliderInstance | null>(null),
    [width, setWidth] = React.useState(0),
    $src = useMediaState('currentSrc'),
    { thumbnails, sliderChaptersMinWidth, disableTimeSlider, seekStep, noScrubGesture } =
      useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Seek'),
    $RemotionSliderThumbnail = useSignal(RemotionSliderThumbnail);

  const onResize = React.useCallback(() => {
    const el = instance?.el;
    el && setWidth(el.clientWidth);
  }, [instance]);

  useResizeObserver(instance?.el, onResize);

  return (
    <TimeSlider.Root
      className="vds-time-slider vds-slider"
      aria-label={label}
      disabled={disableTimeSlider}
      noSwipeGesture={noScrubGesture}
      keyStep={seekStep}
      ref={setInstance}
    >
      <TimeSlider.Chapters
        className="vds-slider-chapters"
        disabled={width < sliderChaptersMinWidth!}
      >
        {(cues, forwardRef) =>
          cues.map((cue) => (
            <div className="vds-slider-chapter" key={cue.startTime} ref={forwardRef}>
              <TimeSlider.Track className="vds-slider-track" />
              <TimeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
              <TimeSlider.Progress className="vds-slider-progress vds-slider-track" />
            </div>
          ))
        }
      </TimeSlider.Chapters>
      <TimeSlider.Thumb className="vds-slider-thumb" />
      <TimeSlider.Preview className="vds-slider-preview">
        {thumbnails ? (
          <TimeSlider.Thumbnail.Root
            src={thumbnails}
            className="vds-slider-thumbnail vds-thumbnail"
          >
            <TimeSlider.Thumbnail.Img />
          </TimeSlider.Thumbnail.Root>
        ) : $RemotionSliderThumbnail && isRemotionSource($src) ? (
          <$RemotionSliderThumbnail className="vds-slider-thumbnail vds-thumbnail" />
        ) : null}
        <TimeSlider.ChapterTitle className="vds-slider-chapter-title" />
        <TimeSlider.Value className="vds-slider-value" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}

DefaultTimeSlider.displayName = 'DefaultTimeSlider';
export { DefaultTimeSlider };

/* -------------------------------------------------------------------------------------------------
 * DefaultTitle
 * -----------------------------------------------------------------------------------------------*/

function DefaultTitle() {
  return <Title className="vds-title" />;
}

DefaultTitle.displayName = 'DefaultTitle';
export { DefaultTitle };

/* -------------------------------------------------------------------------------------------------
 * DefaultChapterTitle
 * -----------------------------------------------------------------------------------------------*/

function DefaultChapterTitle() {
  return <ChapterTitle className="vds-chapter-title" />;
}

DefaultChapterTitle.displayName = 'DefaultChapterTitle';
export { DefaultChapterTitle };

/* -------------------------------------------------------------------------------------------------
 * DefaultLiveButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultLiveButton() {
  const $live = useMediaState('live'),
    label = useDefaultLayoutWord('Skip To Live'),
    liveText = useDefaultLayoutWord('LIVE');
  return $live ? (
    <LiveButton className="vds-live-button" aria-label={label}>
      <span className="vds-live-button-text">{liveText}</span>
    </LiveButton>
  ) : null;
}

DefaultLiveButton.displayName = 'DefaultLiveButton';
export { DefaultLiveButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeGroup
 * -----------------------------------------------------------------------------------------------*/

interface DefaultTimeGroupSlots {
  currentTime?: React.ReactNode;
  timeSeparator?: React.ReactNode;
  endTime?: React.ReactNode;
}

function DefaultTimeGroup({ slots }: { slots?: DefaultTimeGroupSlots }) {
  const $duration = useMediaState('duration');

  if (!$duration) return null;

  return (
    <div className="vds-time-group">
      {slot(slots, 'currentTime', <Time className="vds-time" type="current" />)}
      {slot(slots, 'timeSeparator', <div className="vds-time-divider">/</div>)}
      {slot(slots, 'endTime', <Time className="vds-time" type="duration" />)}
    </div>
  );
}

DefaultTimeGroup.displayName = 'DefaultTimeGroup';
export { DefaultTimeGroup };

/* -------------------------------------------------------------------------------------------------
 * DefaultControlsSpacer
 * -----------------------------------------------------------------------------------------------*/

function DefaultControlsSpacer() {
  return <div className="vds-controls-spacer" />;
}

DefaultControlsSpacer.displayName = 'DefaultControlsSpacer';
export { DefaultControlsSpacer };

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeInfo
 * -----------------------------------------------------------------------------------------------*/

interface DefaultTimeInfoSlots extends DefaultTimeGroupSlots {
  liveButton?: React.ReactNode;
}

function DefaultTimeInfo({ slots }: { slots?: DefaultTimeInfoSlots }) {
  const $live = useMediaState('live');
  return $live ? (
    slot(slots, 'liveButton', <DefaultLiveButton />)
  ) : (
    <DefaultTimeGroup slots={slots} />
  );
}

DefaultTimeInfo.displayName = 'DefaultTimeInfo';
export { DefaultTimeInfo };

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeInvert
 * -----------------------------------------------------------------------------------------------*/

function DefaultTimeInvert({ slots }: { slots?: DefaultTimeInfoSlots }) {
  const $live = useMediaState('live'),
    $duration = useMediaState('duration');
  return $live
    ? slot(slots, 'liveButton', <DefaultLiveButton />)
    : slot(
        slots,
        'endTime',
        $duration ? <Time className="vds-time" type="current" toggle remainder /> : null,
      );
}

DefaultTimeInvert.displayName = 'DefaultTimeInvert';
export { DefaultTimeInvert };

/* -------------------------------------------------------------------------------------------------
 * DefaultChaptersMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultChaptersMenu({ tooltip, placement, portalClass }: DefaultMediaMenuProps) {
  const {
      showMenuDelay,
      noModal,
      isSmallLayout,
      icons: Icons,
      menuGroup,
    } = useDefaultLayoutContext(),
    chaptersText = useDefaultLayoutWord('Chapters'),
    options = useChapterOptions(),
    disabled = !options.length,
    { thumbnails } = useDefaultLayoutContext(),
    $src = useMediaState('currentSrc'),
    $viewType = useMediaState('viewType'),
    $offset = !isSmallLayout && menuGroup === 'bottom' && $viewType === 'video' ? 26 : 0,
    $RemotionThumbnail = useSignal(RemotionThumbnail);

  if (disabled) return null;

  const Content = (
    <Menu.Content
      className="vds-chapters-menu-items vds-menu-items"
      placement={placement}
      offset={$offset}
    >
      <Menu.RadioGroup
        className="vds-chapters-radio-group vds-radio-group"
        value={options.selectedValue}
        data-thumbnails={thumbnails ? '' : null}
      >
        {options.map(
          ({ cue, label, value, startTimeText, durationText, select, setProgressVar }) => (
            <Menu.Radio
              className="vds-chapter-radio vds-radio"
              value={value}
              key={value}
              onSelect={select}
              ref={setProgressVar}
            >
              {thumbnails ? (
                <Thumbnail.Root src={thumbnails} className="vds-thumbnail" time={cue.startTime}>
                  <Thumbnail.Img />
                </Thumbnail.Root>
              ) : $RemotionThumbnail && isRemotionSource($src) ? (
                <$RemotionThumbnail className="vds-thumbnail" frame={cue.startTime * $src.fps!} />
              ) : null}
              <div className="vds-chapter-radio-content">
                <span className="vds-chapter-radio-label">{label}</span>
                <span className="vds-chapter-radio-start-time">{startTimeText}</span>
                <span className="vds-chapter-radio-duration">{durationText}</span>
              </div>
            </Menu.Radio>
          ),
        )}
      </Menu.RadioGroup>
    </Menu.Content>
  );

  return (
    <Menu.Root className="vds-chapters-menu vds-menu" showDelay={showMenuDelay}>
      <DefaultTooltip content={chaptersText} placement={tooltip}>
        <Menu.Button
          className="vds-menu-button vds-button"
          disabled={disabled}
          aria-label={chaptersText}
        >
          <Icons.Menu.Chapters className="vds-icon" />
        </Menu.Button>
      </DefaultTooltip>
      {noModal || !isSmallLayout ? (
        Content
      ) : (
        <Menu.Portal
          className={portalClass}
          disabled="fullscreen"
          data-size={isSmallLayout ? 'sm' : null}
        >
          {Content}
        </Menu.Portal>
      )}
    </Menu.Root>
  );
}

DefaultChaptersMenu.displayName = 'DefaultChaptersMenu';
export { DefaultChaptersMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultSettingsMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultSettingsMenu({ tooltip, placement, portalClass, slots }: DefaultMediaMenuProps) {
  const {
      showMenuDelay,
      icons: Icons,
      isSmallLayout,
      menuGroup,
      noModal,
    } = useDefaultLayoutContext(),
    settingsText = useDefaultLayoutWord('Settings'),
    $viewType = useMediaState('viewType'),
    $offset = !isSmallLayout && menuGroup === 'bottom' && $viewType === 'video' ? 26 : 0;

  const Content = (
    <Menu.Content
      className="vds-settings-menu-items vds-menu-items"
      placement={placement}
      offset={$offset}
    >
      {slot(slots, 'settingsMenuStartItems', null)}
      <DefaultPlaybackSubmenu />
      <DefaultAccessibilitySubmenu />
      <DefaultAudioSubmenu />
      <DefaultCaptionSubmenu />
      {slot(slots, 'settingsMenuEndItems', null)}
    </Menu.Content>
  );

  return (
    <Menu.Root className="vds-settings-menu vds-menu" showDelay={showMenuDelay}>
      <DefaultTooltip content={settingsText} placement={tooltip}>
        <Menu.Button className="vds-menu-button vds-button" aria-label={settingsText}>
          <Icons.Menu.Settings className="vds-icon vds-rotate-icon" />
        </Menu.Button>
      </DefaultTooltip>
      {noModal || !isSmallLayout ? (
        Content
      ) : (
        <Menu.Portal
          className={portalClass}
          disabled="fullscreen"
          data-size={isSmallLayout ? 'sm' : null}
        >
          {Content}
        </Menu.Portal>
      )}
    </Menu.Root>
  );
}

DefaultSettingsMenu.displayName = 'DefaultSettingsMenu';
export { DefaultSettingsMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultPlaybackSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultPlaybackSubmenu() {
  const label = useDefaultLayoutWord('Playback'),
    { icons: Icons } = useDefaultLayoutContext();

  return (
    <Menu.Root className="vds-accessibility-menu vds-menu">
      <DefaultSubmenuButton label={label} Icon={Icons.Menu.Playback} />
      <Menu.Content className="vds-menu-items">
        <DefaultMenuLoopCheckbox />
        <DefaultMenuSpeedSlider />
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultPlaybackSubmenu.displayName = 'DefaultPlaybackSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuLoopCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuLoopCheckbox() {
  const label = 'Loop',
    { remote } = useMediaContext(),
    translatedLabel = useDefaultLayoutWord(label);

  function onChange(checked: boolean, trigger?: Event) {
    remote.userPrefersLoopChange(checked, trigger);
  }

  return (
    <div className="vds-menu-item vds-menu-item-checkbox">
      <div className="vds-menu-checkbox-label">{translatedLabel}</div>
      <DefaultMenuCheckbox label={label} storageKey="vds-player::user-loop" onChange={onChange} />
    </div>
  );
}

DefaultMenuLoopCheckbox.displayName = 'DefaultMenuLoopCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuSpeedSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuSpeedSlider() {
  const { icons: Icons } = useDefaultLayoutContext(),
    $playbackRate = useMediaState('playbackRate'),
    label = useDefaultLayoutWord('Speed'),
    normalText = useDefaultLayoutWord('Normal'),
    value = $playbackRate === 1 ? normalText : $playbackRate + 'x';

  return (
    <div className="vds-menu-item vds-menu-item-slider">
      <div className="vds-menu-slider-title">
        <span className="vds-menu-slider-label">{label}</span>
        <span className="vds-menu-slider-value">{value}</span>
      </div>
      <div className="vds-menu-slider-group">
        <Icons.Menu.SpeedDown className="vds-icon" />
        <DefaultSpeedSlider />
        <Icons.Menu.SpeedUp className="vds-icon" />
      </div>
    </div>
  );
}

DefaultMenuSpeedSlider.displayName = 'DefaultMenuSpeedSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultSpeedSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultSpeedSlider() {
  const label = useDefaultLayoutWord('Speed'),
    { playbackRates: rates } = useDefaultLayoutContext(),
    min = (isArray(rates) ? rates[0] : rates?.min) || 0,
    max = (isArray(rates) ? rates[rates.length - 1] : rates?.max) || 2,
    step = (isArray(rates) ? rates[1] - rates[0] : rates?.step) || 0.25;
  return (
    <SpeedSlider.Root
      className="vds-speed-slider vds-slider"
      aria-label={label}
      min={min}
      max={max}
      step={step}
    >
      <SpeedSlider.Track className="vds-slider-track" />
      <SpeedSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <SpeedSlider.Thumb className="vds-slider-thumb" />
    </SpeedSlider.Root>
  );
}

DefaultSpeedSlider.displayName = 'DefaultSpeedSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultAccessibilitySubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAccessibilitySubmenu() {
  const label = useDefaultLayoutWord('Accessibility'),
    { icons: Icons } = useDefaultLayoutContext();

  return (
    <Menu.Root className="vds-accessibility-menu vds-menu">
      <DefaultSubmenuButton label={label} Icon={Icons.Menu.Accessibility} />
      <Menu.Content className="vds-menu-items">
        <DefaultMenuAnnouncementsCheckbox />
        <DefaultMenuKeyboardAnimationCheckbox />
        <DefaultFontSubmenu />
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultAccessibilitySubmenu.displayName = 'DefaultAccessibilitySubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuAnnouncementsCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuAnnouncementsCheckbox() {
  const label = 'Announcements',
    { userPrefersAnnouncements } = useDefaultLayoutContext(),
    translatedLabel = useDefaultLayoutWord(label);

  function onChange(checked: boolean) {
    userPrefersAnnouncements.set(checked);
  }

  return (
    <div className="vds-menu-item vds-menu-item-checkbox">
      <div className="vds-menu-checkbox-label">{translatedLabel}</div>
      <DefaultMenuCheckbox
        label={label}
        defaultChecked
        storageKey="vds-player::announcements"
        onChange={onChange}
      />
    </div>
  );
}

DefaultMenuAnnouncementsCheckbox.displayName = 'DefaultMenuAnnouncementsCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuKeyboardAnimationCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuKeyboardAnimationCheckbox() {
  const label = 'Keyboard Animations',
    $viewType = useMediaState('viewType'),
    { userPrefersKeyboardAnimations } = useDefaultLayoutContext(),
    translatedLabel = useDefaultLayoutWord(label);

  if ($viewType !== 'video') return null;

  function onChange(checked: boolean) {
    userPrefersKeyboardAnimations.set(checked);
  }

  return (
    <div className="vds-menu-item vds-menu-item-checkbox">
      <div className="vds-menu-checkbox-label">{translatedLabel}</div>
      <DefaultMenuCheckbox
        label={label}
        defaultChecked
        storageKey="vds-player::keyboard-animations"
        onChange={onChange}
      />
    </div>
  );
}

DefaultMenuKeyboardAnimationCheckbox.displayName = 'DefaultMenuKeyboardAnimationCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuCheckbox
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMenuCheckboxProps {
  label: DefaultLayoutWord;
  storageKey?: string;
  defaultChecked?: boolean;
  onChange?(checked: boolean, trigger?: Event): void;
}

function DefaultMenuCheckbox({
  label,
  storageKey,
  defaultChecked = false,
  onChange,
}: DefaultMenuCheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(defaultChecked),
    [isActive, setIsActive] = React.useState(false),
    ariaLabel = useDefaultLayoutWord(label);

  React.useEffect(() => {
    const savedValue = storageKey ? localStorage.getItem(storageKey) : null,
      checked = !!(savedValue ?? defaultChecked);
    setIsChecked(checked);
    onChange?.(checked);
  }, []);

  function onPress(event?: React.PointerEvent | React.KeyboardEvent) {
    if (event && 'button' in event && event?.button === 1) return;

    const toggleCheck = !isChecked;

    setIsChecked(toggleCheck);
    if (storageKey) localStorage.setItem(storageKey, toggleCheck ? '1' : '');

    onChange?.(toggleCheck, event?.nativeEvent);

    setIsActive(false);
  }

  function onActive(event: React.PointerEvent) {
    if (event.button !== 0) return;
    setIsActive(true);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (isKeyboardClick(event.nativeEvent)) onPress();
  }

  return (
    <div
      className="vds-menu-checkbox"
      role="menuitemcheckbox"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-checked={isChecked ? 'true' : 'false'}
      data-active={isActive ? '' : null}
      onPointerUp={onPress}
      onPointerDown={onActive}
      onKeyDown={onKeyDown}
    />
  );
}

DefaultMenuCheckbox.displayName = 'DefaultMenuCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioSubmenu() {
  const label = useDefaultLayoutWord('Audio'),
    $canSetAudioGain = useMediaState('canSetAudioGain'),
    $audioTracks = useMediaState('audioTracks'),
    { noAudioGainSlider, icons: Icons } = useDefaultLayoutContext(),
    hasGainSlider = $canSetAudioGain && !noAudioGainSlider,
    $disabled = !hasGainSlider && !$audioTracks.length;

  if ($disabled) return null;

  return (
    <Menu.Root className="vds-audio-menu vds-menu">
      <DefaultSubmenuButton label={label} Icon={Icons.Menu.Audio} />
      <Menu.Content className="vds-menu-items">
        {hasGainSlider ? <DefaultMenuAudioGainSlider /> : null}
        <DefaultAudioTracksSubmenu />
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultAudioSubmenu.displayName = 'DefaultAudioSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuAudioGainSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuAudioGainSlider() {
  const label = useDefaultLayoutWord('Audio Boost'),
    $audioGain = useMediaState('audioGain'),
    value = Math.round((($audioGain ?? 1) - 1) * 100) + '%',
    { icons: Icons } = useDefaultLayoutContext();

  return (
    <div className="vds-menu-item vds-menu-item-slider">
      <div className="vds-menu-slider-title">
        <span className="vds-menu-slider-label">{label}</span>
        <span className="vds-menu-slider-value">{value}</span>
      </div>
      <div className="vds-menu-slider-group">
        <Icons.Menu.AudioBoostDown className="vds-icon" />
        <DefaultAudioGainSlider />
        <Icons.Menu.AudioBoostUp className="vds-icon" />
      </div>
    </div>
  );
}

DefaultMenuAudioGainSlider.displayName = 'DefaultMenuAudioGainSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioGainSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioGainSlider() {
  const label = useDefaultLayoutWord('Audio Boost'),
    { maxAudioGain } = useDefaultLayoutContext();
  return (
    <AudioGainSlider.Root
      className="vds-audio-gain-slider vds-slider"
      aria-label={label}
      max={maxAudioGain}
    >
      <AudioGainSlider.Track className="vds-slider-track" />
      <AudioGainSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <AudioGainSlider.Thumb className="vds-slider-thumb" />
    </AudioGainSlider.Root>
  );
}

DefaultAudioGainSlider.displayName = 'DefaultAudioGainSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioTracksSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioTracksSubmenu() {
  const { icons: Icons } = useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Audio Track'),
    defaultText = useDefaultLayoutWord('Default'),
    $track = useMediaState('audioTrack'),
    options = useAudioOptions();

  if (options.disabled) return null;

  return (
    <Menu.Root className="vds-audio-track-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={$track?.label ?? defaultText}
        disabled={options.disabled}
        Icon={Icons.Menu.Audio}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-audio-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="vds-audio-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultAudioTracksSubmenu.displayName = 'DefaultAudioTracksSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultQualitySubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultQualitySubmenu() {
  const { hideQualityBitrate } = useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Quality'),
    autoText = useDefaultLayoutWord('Auto'),
    options = useVideoQualityOptions({ auto: autoText, sort: 'descending' }),
    currentQuality = options.selectedQuality?.height,
    hint =
      options.selectedValue !== 'auto' && currentQuality
        ? `${currentQuality}p`
        : `${autoText}${currentQuality ? ` (${currentQuality}p)` : ''}`;

  if (options.disabled) return null;

  return (
    <Menu.Root className="vds-quality-menu vds-menu">
      <DefaultSubmenuButton label={label} hint={hint} disabled={options.disabled} />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-quality-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, bitrateText, select }) => (
            <Menu.Radio
              className="vds-quality-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
              {!hideQualityBitrate && bitrateText ? (
                <span className="vds-radio-hint">{bitrateText}</span>
              ) : null}
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultQualitySubmenu.displayName = 'DefaultQualitySubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultCaptionSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultCaptionSubmenu() {
  const { icons: Icons } = useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Captions'),
    offText = useDefaultLayoutWord('Off'),
    options = useCaptionOptions({ off: offText }),
    hint = options.selectedTrack?.label ?? offText;

  if (options.disabled) return null;

  return (
    <Menu.Root className="vds-captions-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={hint}
        disabled={options.disabled}
        Icon={Icons.Menu.Captions}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-captions-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="vds-caption-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultCaptionSubmenu.displayName = 'DefaultCaptionSubmenu';
