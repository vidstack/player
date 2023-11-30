import * as React from 'react';

import { computed } from 'maverick.js';
import { useReactContext, useSignal } from 'maverick.js/react';
import { isString } from 'maverick.js/std';
import {
  isTrackCaptionKind,
  mediaContext,
  type DefaultLayoutTranslations,
  type TooltipPlacement,
} from 'vidstack';

import { useAudioOptions } from '../../../hooks/options/use-audio-options';
import { useCaptionOptions } from '../../../hooks/options/use-caption-options';
import { useChapterOptions } from '../../../hooks/options/use-chapter-options';
import { usePlaybackRateOptions } from '../../../hooks/options/use-playback-rate-options';
import { useVideoQualityOptions } from '../../../hooks/options/use-video-quality-options';
import { useMediaState } from '../../../hooks/use-media-state';
import { usePlayerQuery } from '../../../hooks/use-player-query';
import type { PrimitivePropsWithRef } from '../../primitives/nodes';
import { CaptionButton } from '../../ui/buttons/caption-button';
import { FullscreenButton } from '../../ui/buttons/fullscreen-button';
import { LiveButton } from '../../ui/buttons/live-button';
import { MuteButton } from '../../ui/buttons/mute-button';
import { PIPButton } from '../../ui/buttons/pip-button';
import { PlayButton } from '../../ui/buttons/play-button';
import { SeekButton } from '../../ui/buttons/seek-button';
import { ChapterTitle } from '../../ui/chapter-title';
import * as MenuBase from '../../ui/menu';
import * as TimeSliderBase from '../../ui/sliders/time-slider';
import * as VolumeSliderBase from '../../ui/sliders/volume-slider';
import * as ThumbnailBase from '../../ui/thumbnail';
import { Time } from '../../ui/time';
import * as TooltipBase from '../../ui/tooltip';
import { DefaultLayoutContext, useDefaultLayoutLang } from './context';
import type { DefaultLayoutIcon, DefaultLayoutIcons } from './icons';

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

interface DefaultMediaButtonProps {
  tooltip: TooltipBase.ContentProps['placement'];
}

interface DefaultMediaMenuProps {
  tooltip: TooltipBase.ContentProps['placement'];
  placement: MenuBase.ContentProps['placement'];
  portalClass?: string;
}

/* -------------------------------------------------------------------------------------------------
 * DefaultMediaLayout
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMediaLayoutProps extends PrimitivePropsWithRef<'div'> {
  children?: React.ReactNode;
  /**
   * The icons to be rendered and displayed inside the layout.
   */
  icons: DefaultLayoutIcons;
  /**
   * The absolute or relative URL to a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
   * file resource.
   */
  thumbnails?: string;
  /**
   * Translation map from english to your desired language for words used throughout the layout.
   */
  translations?: DefaultLayoutTranslations | null;
  /**
   * Specifies the number of milliseconds to wait before tooltips are visible after interacting
   * with a control.
   *
   * @defaultValue 700
   */
  showTooltipDelay?: number;
  /**
   * Specifies the number of milliseconds to wait before menus are visible after opening them.
   *
   * @defaultValue 0
   */
  showMenuDelay?: number;
  /**
   * Whether the bitrate should be hidden in the settings quality menu next to each option.
   *
   * @defaultValue false
   */
  hideQualityBitrate?: boolean;
  /**
   * A player query string that determines when the small (e.g., mobile) UI should be displayed. The
   * special string 'never' will indicate that the small device optimized UI should never be
   * displayed.
   *
   * @defaultValue '(width < 576) or (height < 380)'
   */
  smallLayoutWhen?: string | boolean;
  /**
   * Specifies whether menu buttons should be placed in the top or bottom controls group. This
   * only applies to the large video layout.
   *
   * @defaultValue 'bottom'
   */
  menuGroup?: 'top' | 'bottom';
  /**
   * Whether modal menus should be disabled when the small layout is active. A modal menu is
   * a floating panel that floats up from the bottom of the screen (outside of the player). It's
   * enabled by default as it provides a better user experience for touch devices.
   *
   * @defaultValue false
   */
  noModal?: boolean;
}

export interface CreateDefaultMediaLayout {
  type: 'audio' | 'video';
  smLayoutWhen: string;
  SmallLayout: React.FC;
  LargeLayout: React.FC;
  UnknownStreamType?: React.FC;
}

export function createDefaultMediaLayout({
  type,
  smLayoutWhen,
  SmallLayout,
  LargeLayout,
  UnknownStreamType,
}: CreateDefaultMediaLayout) {
  const Layout = React.forwardRef<HTMLDivElement, DefaultMediaLayoutProps>(
    (
      {
        className,
        icons,
        thumbnails,
        translations,
        showMenuDelay,
        showTooltipDelay = type === 'video' ? 500 : 700,
        smallLayoutWhen = smLayoutWhen,
        noModal = false,
        menuGroup = 'bottom',
        hideQualityBitrate = false,
        children,
        ...props
      },
      forwardRef,
    ) => {
      const $canLoad = useMediaState('canLoad'),
        $viewType = useMediaState('viewType'),
        $streamType = useMediaState('streamType'),
        isMatch = $viewType === type,
        isForcedLayout = typeof smallLayoutWhen === 'boolean',
        isSmallLayoutMatch = usePlayerQuery(isString(smallLayoutWhen) ? smallLayoutWhen : ''),
        isSmallLayout = isForcedLayout ? smallLayoutWhen : isSmallLayoutMatch;
      return (
        <div
          {...props}
          className={`vds-${type}-layout` + (className ? ` ${className}` : '')}
          data-match={isMatch ? '' : null}
          data-size={isSmallLayout ? 'sm' : null}
          ref={forwardRef}
        >
          {($canLoad || isForcedLayout) && isMatch ? (
            <DefaultLayoutContext.Provider
              value={{
                thumbnails,
                translations,
                isSmallLayout,
                showMenuDelay,
                showTooltipDelay,
                hideQualityBitrate,
                noModal,
                menuGroup,
                Icons: icons,
              }}
            >
              {$streamType === 'unknown' ? (
                UnknownStreamType ? (
                  <UnknownStreamType />
                ) : null
              ) : isSmallLayout ? (
                <SmallLayout />
              ) : (
                <LargeLayout />
              )}
              {children}
            </DefaultLayoutContext.Provider>
          ) : null}
        </div>
      );
    },
  );

  Layout.displayName = 'DefaultMediaLayout';
  return Layout;
}

/* -------------------------------------------------------------------------------------------------
 * DefaultTooltip
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultTooltipProps {
  content: string;
  placement?: TooltipPlacement;
  children: React.ReactNode;
}

function DefaultTooltip({ content, placement, children }: DefaultTooltipProps) {
  const { showTooltipDelay } = React.useContext(DefaultLayoutContext);
  return (
    <TooltipBase.Root showDelay={showTooltipDelay}>
      <TooltipBase.Trigger asChild>{children}</TooltipBase.Trigger>
      <TooltipBase.Content className="vds-tooltip-content" placement={placement}>
        {content}
      </TooltipBase.Content>
    </TooltipBase.Root>
  );
}

DefaultTooltip.displayName = 'DefaultTooltip';
export { DefaultTooltip };

/* -------------------------------------------------------------------------------------------------
 * DefaultPlayButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultPlayButton({ tooltip }: DefaultMediaButtonProps) {
  const { Icons } = React.useContext(DefaultLayoutContext),
    playText = useDefaultLayoutLang('Play'),
    pauseText = useDefaultLayoutLang('Pause'),
    paused = useMediaState('paused'),
    ended = useMediaState('ended'),
    label = paused ? playText : pauseText;
  return (
    <DefaultTooltip content={paused ? playText : pauseText} placement={tooltip}>
      <PlayButton className="vds-play-button vds-button" aria-label={label}>
        {ended ? (
          <Icons.PlayButton.Replay className="vds-icon" />
        ) : paused ? (
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

function DefaultMuteButton({ tooltip }: DefaultMediaButtonProps) {
  const { Icons } = React.useContext(DefaultLayoutContext),
    muteText = useDefaultLayoutLang('Mute'),
    unmuteText = useDefaultLayoutLang('Unmute'),
    muted = useMediaState('muted'),
    volume = useMediaState('volume'),
    label = muted ? unmuteText : muteText;
  return (
    <DefaultTooltip content={muted ? unmuteText : muteText} placement={tooltip}>
      <MuteButton className="vds-mute-button vds-button" aria-label={label}>
        {muted || volume == 0 ? (
          <Icons.MuteButton.Mute className="vds-icon" />
        ) : volume < 0.5 ? (
          <Icons.MuteButton.VolumeLow className="vds-icon" />
        ) : (
          <Icons.MuteButton.VolumeHigh className="vds-icon" />
        )}
      </MuteButton>
    </DefaultTooltip>
  );
}

DefaultMuteButton.displayName = 'DefaultMuteButton';
export { DefaultMuteButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultCaptionButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultCaptionButton({ tooltip }: DefaultMediaButtonProps) {
  const { Icons } = React.useContext(DefaultLayoutContext),
    onText = useDefaultLayoutLang('Closed-Captions On'),
    offText = useDefaultLayoutLang('Closed-Captions Off'),
    track = useMediaState('textTrack'),
    isOn = track && isTrackCaptionKind(track),
    label = track ? offText : onText;
  return (
    <DefaultTooltip content={isOn ? onText : offText} placement={tooltip}>
      <CaptionButton className="vds-caption-button vds-button" aria-label={label}>
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
  const { Icons } = React.useContext(DefaultLayoutContext),
    enterText = useDefaultLayoutLang('Enter PiP'),
    exitText = useDefaultLayoutLang('Exit PiP'),
    pip = useMediaState('pictureInPicture'),
    label = pip ? exitText : enterText;
  return (
    <DefaultTooltip content={pip ? exitText : enterText} placement={tooltip}>
      <PIPButton className="vds-pip-button vds-button" aria-label={label}>
        {pip ? (
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
  const { Icons } = React.useContext(DefaultLayoutContext),
    enterText = useDefaultLayoutLang('Enter Fullscreen'),
    exitText = useDefaultLayoutLang('Exit Fullscreen'),
    fullscreen = useMediaState('fullscreen'),
    label = fullscreen ? exitText : enterText;
  return (
    <DefaultTooltip content={fullscreen ? exitText : enterText} placement={tooltip}>
      <FullscreenButton className="vds-fullscreen-button vds-button" aria-label={label}>
        {fullscreen ? (
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

function DefaultSeekButton({ seconds, tooltip }: DefaultMediaButtonProps & { seconds: number }) {
  const { Icons } = React.useContext(DefaultLayoutContext),
    seekForwardText = useDefaultLayoutLang('Seek Forward'),
    seekBackwardText = useDefaultLayoutLang('Seek Backward'),
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
 * DefaultVolumeSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultVolumeSlider() {
  const label = useDefaultLayoutLang('Volume');
  return (
    <VolumeSliderBase.Root className="vds-volume-slider vds-slider" aria-label={label}>
      <VolumeSliderBase.Track className="vds-slider-track" />
      <VolumeSliderBase.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <VolumeSliderBase.Thumb className="vds-slider-thumb" />
      <VolumeSliderBase.Preview className="vds-slider-preview" noClamp>
        <VolumeSliderBase.Value className="vds-slider-value" />
      </VolumeSliderBase.Preview>
    </VolumeSliderBase.Root>
  );
}

DefaultVolumeSlider.displayName = 'DefaultVolumeSlider';
export { DefaultVolumeSlider };

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultTimeSlider() {
  const width = useMediaState('width'),
    { thumbnails } = React.useContext(DefaultLayoutContext),
    label = useDefaultLayoutLang('Seek');
  return (
    <TimeSliderBase.Root className="vds-time-slider vds-slider" aria-label={label}>
      <TimeSliderBase.Chapters className="vds-slider-chapters" disabled={width < 768}>
        {(cues, forwardRef) =>
          cues.map((cue) => (
            <div className="vds-slider-chapter" key={cue.startTime} ref={forwardRef}>
              <TimeSliderBase.Track className="vds-slider-track" />
              <TimeSliderBase.TrackFill className="vds-slider-track-fill vds-slider-track" />
              <TimeSliderBase.Progress className="vds-slider-progress vds-slider-track" />
            </div>
          ))
        }
      </TimeSliderBase.Chapters>
      <TimeSliderBase.Thumb className="vds-slider-thumb" />
      <TimeSliderBase.Preview className="vds-slider-preview">
        <TimeSliderBase.Thumbnail.Root
          src={thumbnails}
          className="vds-slider-thumbnail vds-thumbnail"
        >
          <TimeSliderBase.Thumbnail.Img />
        </TimeSliderBase.Thumbnail.Root>
        <TimeSliderBase.ChapterTitle className="vds-slider-chapter-title" />
        <TimeSliderBase.Value className="vds-slider-value" />
      </TimeSliderBase.Preview>
    </TimeSliderBase.Root>
  );
}

DefaultTimeSlider.displayName = 'DefaultTimeSlider';
export { DefaultTimeSlider };

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
  const live = useMediaState('live'),
    label = useDefaultLayoutLang('Skip To Live'),
    liveText = useDefaultLayoutLang('LIVE');
  return live ? (
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

function DefaultTimeGroup() {
  return (
    <div className="vds-time-group">
      <Time className="vds-time" type="current" />
      <div className="vds-time-divider">/</div>
      <Time className="vds-time" type="duration" />
    </div>
  );
}

DefaultTimeGroup.displayName = 'DefaultTimeGroup';
export { DefaultTimeGroup };

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeInfo
 * -----------------------------------------------------------------------------------------------*/

function DefaultTimeInfo() {
  const live = useMediaState('live');
  return live ? <DefaultLiveButton /> : <DefaultTimeGroup />;
}

DefaultTimeInfo.displayName = 'DefaultTimeInfo';
export { DefaultTimeInfo };

/* -------------------------------------------------------------------------------------------------
 * DefaultChaptersMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultChaptersMenu({ tooltip, placement, portalClass }: DefaultMediaMenuProps) {
  const { showMenuDelay, noModal, isSmallLayout, Icons, menuGroup } =
      React.useContext(DefaultLayoutContext),
    chaptersText = useDefaultLayoutLang('Chapters'),
    options = useChapterOptions(),
    disabled = !options.length,
    { thumbnails } = React.useContext(DefaultLayoutContext),
    $viewType = useMediaState('viewType'),
    $offset = !isSmallLayout && menuGroup === 'bottom' && $viewType === 'video' ? 26 : 0;

  const Content = (
    <MenuBase.Content
      className="vds-chapters-menu-items vds-menu-items"
      placement={placement}
      offset={$offset}
    >
      <MenuBase.RadioGroup
        className="vds-chapters-radio-group vds-radio-group"
        value={options.selectedValue}
        data-thumbnails={!!thumbnails}
      >
        {options.map(
          ({ cue, label, value, startTimeText, durationText, select, setProgressVar }) => (
            <MenuBase.Radio
              className="vds-chapter-radio vds-radio"
              value={value}
              key={value}
              onSelect={select}
              ref={setProgressVar}
            >
              <ThumbnailBase.Root src={thumbnails} className="vds-thumbnail" time={cue.startTime}>
                <ThumbnailBase.Img />
              </ThumbnailBase.Root>
              <div className="vds-chapter-radio-content">
                <span className="vds-chapter-radio-label">{label}</span>
                <span className="vds-chapter-radio-start-time">{startTimeText}</span>
                <span className="vds-chapter-radio-duration">{durationText}</span>
              </div>
            </MenuBase.Radio>
          ),
        )}
      </MenuBase.RadioGroup>
    </MenuBase.Content>
  );

  return (
    <MenuBase.Root className="vds-chapters-menu vds-menu" showDelay={showMenuDelay}>
      <DefaultTooltip content={chaptersText} placement={tooltip}>
        <MenuBase.Button
          className="vds-menu-button vds-button"
          disabled={disabled}
          aria-label={chaptersText}
        >
          <Icons.Menu.Chapters className="vds-icon" />
        </MenuBase.Button>
      </DefaultTooltip>
      {noModal || !isSmallLayout ? (
        Content
      ) : (
        <MenuBase.Portal
          className={portalClass}
          disabled="fullscreen"
          data-size={isSmallLayout ? 'sm' : null}
        >
          {Content}
        </MenuBase.Portal>
      )}
    </MenuBase.Root>
  );
}

DefaultChaptersMenu.displayName = 'DefaultChaptersMenu';
export { DefaultChaptersMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultSettingsMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultSettingsMenu({ tooltip, placement, portalClass }: DefaultMediaMenuProps) {
  const { $state } = useReactContext(mediaContext)!,
    { showMenuDelay, Icons, isSmallLayout, menuGroup, noModal } =
      React.useContext(DefaultLayoutContext),
    settingsText = useDefaultLayoutLang('Settings'),
    $viewType = useMediaState('viewType'),
    $offset = !isSmallLayout && menuGroup === 'bottom' && $viewType === 'video' ? 26 : 0,
    // Create as a computed signal to avoid unnecessary re-rendering.
    $$hasMenuItems = React.useMemo(
      () =>
        computed(() => {
          const { canSetPlaybackRate, canSetQuality, qualities, audioTracks, textTracks } = $state;
          return (
            canSetPlaybackRate() ||
            (canSetQuality() && qualities().length) ||
            audioTracks().length ||
            textTracks().filter(isTrackCaptionKind).length
          );
        }),
      [],
    ),
    $hasMenuItems = useSignal($$hasMenuItems);

  if (!$hasMenuItems) return null;

  const Content = (
    <MenuBase.Content
      className="vds-settings-menu-items vds-menu-items"
      placement={placement}
      offset={$offset}
    >
      <DefaultAudioSubmenu />
      <DefaultSpeedSubmenu />
      <DefaultQualitySubmenu />
      <DefaultCaptionSubmenu />
    </MenuBase.Content>
  );

  return (
    <MenuBase.Root className="vds-settings-menu vds-menu" showDelay={showMenuDelay}>
      <DefaultTooltip content={settingsText} placement={tooltip}>
        <MenuBase.Button className="vds-menu-button vds-button" aria-label={settingsText}>
          <Icons.Menu.Settings className="vds-icon vds-rotate-icon" />
        </MenuBase.Button>
      </DefaultTooltip>
      {noModal || !isSmallLayout ? (
        Content
      ) : (
        <MenuBase.Portal
          className={portalClass}
          disabled="fullscreen"
          data-size={isSmallLayout ? 'sm' : null}
        >
          {Content}
        </MenuBase.Portal>
      )}
    </MenuBase.Root>
  );
}

DefaultSettingsMenu.displayName = 'DefaultSettingsMenu';
export { DefaultSettingsMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultSubmenuButton
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultSubmenuButtonProps {
  label: string;
  hint: string;
  disabled: boolean;
  Icon: DefaultLayoutIcon;
}

function DefaultSubmenuButton({ label, hint, Icon, disabled }: DefaultSubmenuButtonProps) {
  const { Icons } = React.useContext(DefaultLayoutContext);
  return (
    <MenuBase.Button className="vds-menu-button" disabled={disabled}>
      <Icons.Menu.ArrowLeft className="vds-menu-button-close-icon vds-icon" />
      <Icon className="vds-menu-button-icon" />
      <span className="vds-menu-button-label">{label}</span>
      <span className="vds-menu-button-hint">{hint}</span>
      <Icons.Menu.ArrowRight className="vds-menu-button-open-icon vds-icon" />
    </MenuBase.Button>
  );
}

DefaultSubmenuButton.displayName = 'DefaultSubmenuButton';
export { DefaultSubmenuButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioSubmenu() {
  const { Icons } = React.useContext(DefaultLayoutContext),
    label = useDefaultLayoutLang('Audio'),
    defaultText = useDefaultLayoutLang('Default'),
    track = useMediaState('audioTrack'),
    options = useAudioOptions();
  return (
    <MenuBase.Root className="vds-audio-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={track?.label ?? defaultText}
        disabled={options.disabled}
        Icon={Icons.Menu.Audio}
      />
      <MenuBase.Content className="vds-menu-items">
        <MenuBase.RadioGroup
          className="vds-audio-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <MenuBase.Radio
              className="vds-audio-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
            </MenuBase.Radio>
          ))}
        </MenuBase.RadioGroup>
      </MenuBase.Content>
    </MenuBase.Root>
  );
}

DefaultAudioSubmenu.displayName = 'DefaultAudioSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultSpeedSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultSpeedSubmenu() {
  const { Icons } = React.useContext(DefaultLayoutContext),
    label = useDefaultLayoutLang('Speed'),
    normalText = useDefaultLayoutLang('Normal'),
    options = usePlaybackRateOptions({
      normalLabel: normalText,
    }),
    hint = options.selectedValue === '1' ? normalText : options.selectedValue + 'x';
  return (
    <MenuBase.Root className="vds-speed-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={hint}
        disabled={options.disabled}
        Icon={Icons.Menu.Speed}
      />
      <MenuBase.Content className="vds-menu-items">
        <MenuBase.RadioGroup
          className="vds-speed-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <MenuBase.Radio
              className="vds-speed-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
            </MenuBase.Radio>
          ))}
        </MenuBase.RadioGroup>
      </MenuBase.Content>
    </MenuBase.Root>
  );
}

DefaultSpeedSubmenu.displayName = 'DefaultSpeedSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultQualitySubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultQualitySubmenu() {
  const { hideQualityBitrate, Icons } = React.useContext(DefaultLayoutContext),
    label = useDefaultLayoutLang('Quality'),
    autoText = useDefaultLayoutLang('Auto'),
    options = useVideoQualityOptions({ auto: autoText, sort: 'descending' }),
    currentQuality = options.selectedQuality?.height,
    hint =
      options.selectedValue !== 'auto' && currentQuality
        ? `${currentQuality}p`
        : `${autoText}${currentQuality ? ` (${currentQuality}p)` : ''}`;
  return (
    <MenuBase.Root className="vds-quality-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={hint}
        disabled={options.disabled}
        Icon={Icons.Menu.Quality}
      />
      <MenuBase.Content className="vds-menu-items">
        <MenuBase.RadioGroup
          className="vds-quality-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, bitrateText, select }) => (
            <MenuBase.Radio
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
            </MenuBase.Radio>
          ))}
        </MenuBase.RadioGroup>
      </MenuBase.Content>
    </MenuBase.Root>
  );
}

DefaultQualitySubmenu.displayName = 'DefaultQualitySubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultCaptionSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultCaptionSubmenu() {
  const { Icons } = React.useContext(DefaultLayoutContext),
    label = useDefaultLayoutLang('Captions'),
    offText = useDefaultLayoutLang('Off'),
    options = useCaptionOptions({ off: offText }),
    hint = options.selectedTrack?.label ?? offText;
  return (
    <MenuBase.Root className="vds-captions-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={hint}
        disabled={options.disabled}
        Icon={Icons.Menu.Captions}
      />
      <MenuBase.Content className="vds-menu-items">
        <MenuBase.RadioGroup
          className="vds-captions-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <MenuBase.Radio
              className="vds-caption-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
            </MenuBase.Radio>
          ))}
        </MenuBase.RadioGroup>
      </MenuBase.Content>
    </MenuBase.Root>
  );
}

DefaultCaptionSubmenu.displayName = 'DefaultCaptionSubmenu';
