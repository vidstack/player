import * as React from 'react';
import { isString } from 'maverick.js/std';
import {
  isTrackCaptionKind,
  type DefaultSkinTranslations,
  type TooltipPlacement,
} from 'vidstack/local';
import { useAudioOptions } from '../../../hooks/options/use-audio-options';
import { useCaptionOptions } from '../../../hooks/options/use-caption-options';
import { useChapterOptions } from '../../../hooks/options/use-chapter-options';
import { usePlaybackRateOptions } from '../../../hooks/options/use-playback-rate-options';
import { useVideoQualityOptions } from '../../../hooks/options/use-video-quality-options';
import { useActiveTextCues } from '../../../hooks/use-active-text-cues';
import { useActiveTextTrack } from '../../../hooks/use-active-text-track';
import { useMediaRemote } from '../../../hooks/use-media-remote';
import { useMediaState } from '../../../hooks/use-media-state';
import { usePlayerQuery } from '../../../hooks/use-player-query';
import type { PrimitivePropsWithRef } from '../../primitives/nodes';
import { CaptionButton } from '../../ui/buttons/caption-button';
import { FullscreenButton } from '../../ui/buttons/fullscreen-button';
import { MuteButton } from '../../ui/buttons/mute-button';
import { PIPButton } from '../../ui/buttons/pip-button';
import { PlayButton } from '../../ui/buttons/play-button';
import { SeekButton } from '../../ui/buttons/seek-button';
import * as Menu from '../../ui/menu';
import * as TimeSlider from '../../ui/sliders/time-slider';
import * as VolumeSlider from '../../ui/sliders/volume-slider';
import * as Thumbnail from '../../ui/thumbnail';
import { Time } from '../../ui/time';
import * as Tooltip from '../../ui/tooltip';
import { DefaultUIContext, useI18N } from './context';
import type { DefaultIcon, DefaultIcons } from './icons';

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
}

/* -------------------------------------------------------------------------------------------------
 * DefaultMediaUI
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMediaUIProps extends PrimitivePropsWithRef<'div'> {
  icons: DefaultIcons;
  thumbnails?: string;
  translations?: DefaultSkinTranslations | null;
  showTooltipDelay?: number;
  showMenuDelay?: number;
  smallLayoutWhen?: string | boolean;
  children?: React.ReactNode;
}

export interface CreateDefaultMediaUI {
  type: 'audio' | 'video';
  smLayoutWhen: string;
  SmallLayout: React.FC;
  LargeLayout: React.FC;
}

export const createDefaultMediaUI = ({
  type,
  smLayoutWhen,
  SmallLayout,
  LargeLayout,
}: CreateDefaultMediaUI) =>
  React.forwardRef<HTMLDivElement, DefaultMediaUIProps>(
    (
      {
        className,
        icons,
        thumbnails,
        translations,
        showMenuDelay,
        showTooltipDelay,
        smallLayoutWhen = smLayoutWhen,
        children,
        ...props
      },
      forwardRef,
    ) => {
      const $canLoad = useMediaState('canLoad'),
        $viewType = useMediaState('viewType'),
        isMatch = $viewType === type,
        isForcedLayout = typeof smallLayoutWhen === 'boolean',
        isSmallLayoutMatch = usePlayerQuery(isString(smallLayoutWhen) ? smallLayoutWhen : ''),
        isSmallLayout = isForcedLayout ? smallLayoutWhen : isSmallLayoutMatch;

      return (
        <div
          {...props}
          className={`vds-${type}-ui` + (className ? ` ${className}` : '')}
          data-match={isMatch ? '' : null}
          data-layout={isSmallLayout ? 'sm' : null}
          ref={forwardRef}
        >
          {($canLoad || isForcedLayout) && isMatch ? (
            <DefaultUIContext.Provider
              value={{
                thumbnails,
                translations,
                isSmallLayout,
                showMenuDelay,
                showTooltipDelay,
                Icons: icons,
              }}
            >
              {isSmallLayout ? <SmallLayout /> : <LargeLayout />}
              {children}
            </DefaultUIContext.Provider>
          ) : null}
        </div>
      );
    },
  );

/* -------------------------------------------------------------------------------------------------
 * DefaultTooltip
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultTooltipProps {
  content: string;
  placement?: TooltipPlacement;
  children: React.ReactNode;
}

function DefaultTooltip({ content, placement, children }: DefaultTooltipProps) {
  const { showTooltipDelay } = React.useContext(DefaultUIContext);
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
 * DefaultPlayButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultPlayButton({ tooltip }: DefaultMediaButtonProps) {
  const { Icons } = React.useContext(DefaultUIContext),
    playText = useI18N('Play'),
    pauseText = useI18N('Pause'),
    paused = useMediaState('paused');
  return (
    <DefaultTooltip content={paused ? playText : pauseText} placement={tooltip}>
      <PlayButton className="vds-play-button vds-button">
        <Icons.PlayButton.Play data-state="play" />
        <Icons.PlayButton.Pause data-state="pause" />
        <Icons.PlayButton.Replay data-state="replay" />
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
  const { Icons } = React.useContext(DefaultUIContext),
    muteText = useI18N('Mute'),
    unmuteText = useI18N('Unmute'),
    muted = useMediaState('muted');
  return (
    <DefaultTooltip content={muted ? unmuteText : muteText} placement={tooltip}>
      <MuteButton className="vds-mute-button vds-button">
        <Icons.MuteButton.Mute data-state="volume-mute" />
        <Icons.MuteButton.VolumeLow data-state="volume-low" />
        <Icons.MuteButton.VolumeHigh data-state="volume-high" />
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
  const { Icons } = React.useContext(DefaultUIContext),
    onText = useI18N('Closed-Captions On'),
    offText = useI18N('Closed-Captions Off'),
    track = useMediaState('textTrack');
  return (
    <DefaultTooltip
      content={track && isTrackCaptionKind(track) ? onText : offText}
      placement={tooltip}
    >
      <CaptionButton className="vds-caption-button vds-button">
        <Icons.CaptionButton.On data-state="on" />
        <Icons.CaptionButton.Off data-state="off" />
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
  const { Icons } = React.useContext(DefaultUIContext),
    enterText = useI18N('Enter PiP'),
    exitText = useI18N('Exit PiP'),
    pip = useMediaState('pictureInPicture');
  return (
    <DefaultTooltip content={pip ? exitText : enterText} placement={tooltip}>
      <PIPButton className="vds-pip-button vds-button">
        <Icons.PIPButton.Enter data-state="enter" />
        <Icons.PIPButton.Exit data-state="exit" />
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
  const { Icons } = React.useContext(DefaultUIContext),
    enterText = useI18N('Enter Fullscreen'),
    exitText = useI18N('Exit Fullscreen'),
    fullscreen = useMediaState('fullscreen');
  return (
    <DefaultTooltip content={fullscreen ? exitText : enterText} placement={tooltip}>
      <FullscreenButton className="vds-fullscreen-button vds-button">
        <Icons.FullscreenButton.Enter data-state="enter" />
        <Icons.FullscreenButton.Exit data-state="exit" />
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
  const { Icons } = React.useContext(DefaultUIContext),
    seekForwardText = useI18N('Seek Forward'),
    seekBackwardText = useI18N('Seek Backward');
  return (
    <DefaultTooltip content={seconds >= 0 ? seekForwardText : seekBackwardText} placement={tooltip}>
      <SeekButton className="vds-seek-button vds-button" seconds={seconds}>
        {seconds >= 0 ? <Icons.SeekButton.Forward /> : <Icons.SeekButton.Backward />}
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
  return (
    <VolumeSlider.Root className="vds-volume-slider vds-slider">
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
  const { thumbnails, isSmallLayout } = React.useContext(DefaultUIContext);
  return (
    <TimeSlider.Root className="vds-time-slider vds-slider">
      <TimeSlider.Chapters className="vds-slider-chapters" disabled={isSmallLayout}>
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
        <TimeSlider.Thumbnail.Root src={thumbnails} className="vds-slider-thumbnail vds-thumbnail">
          <TimeSlider.Thumbnail.Img />
        </TimeSlider.Thumbnail.Root>
        <TimeSlider.ChapterTitle className="vds-slider-chapter-title" />
        <TimeSlider.Value className="vds-slider-value" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}

DefaultTimeSlider.displayName = 'DefaultTimeSlider';
export { DefaultTimeSlider };

/* -------------------------------------------------------------------------------------------------
 * MainTitle
 * -----------------------------------------------------------------------------------------------*/

function DefaultMainTitle() {
  const $title = useMediaState('title');
  return <span className="vds-media-title">{$title}</span>;
}

DefaultMainTitle.displayName = 'DefaultMainTitle';
export { DefaultMainTitle };

/* -------------------------------------------------------------------------------------------------
 * DefaultChapterTitle
 * -----------------------------------------------------------------------------------------------*/

function DefaultChapterTitle() {
  const $started = useMediaState('started'),
    $title = useMediaState('title'),
    track = useActiveTextTrack('chapters'),
    cues = useActiveTextCues(track);
  return <span className="vds-media-title">{$started ? cues[0]?.text || $title : $title}</span>;
}

DefaultChapterTitle.displayName = 'DefaultChapterTitle';
export { DefaultChapterTitle };

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
 * DefaultChaptersMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultChaptersMenu({
  tooltip,
  placement,
  portalClass: containerClass,
}: DefaultMediaMenuProps) {
  const { showMenuDelay, Icons } = React.useContext(DefaultUIContext),
    chaptersText = useI18N('Chapters'),
    options = useChapterOptions(),
    disabled = !options.length,
    { thumbnails } = React.useContext(DefaultUIContext);
  return (
    <Menu.Root className="vds-chapters-menu vds-menu" showDelay={showMenuDelay}>
      <DefaultTooltip content={chaptersText} placement={tooltip}>
        <Menu.Button className="vds-menu-button vds-button" disabled={disabled}>
          <Icons.Menu.Chapters />
        </Menu.Button>
      </DefaultTooltip>
      <Menu.Portal className={containerClass} disabled="fullscreen">
        <Menu.Content className="vds-chapters-menu-items vds-menu-items" placement={placement}>
          <Menu.RadioGroup
            className="vds-chapters-radio-group vds-radio-group"
            value={options.selectedValue}
            data-thumbnails={!!thumbnails}
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
                  <Thumbnail.Root src={thumbnails} className="vds-thumbnail" time={cue.startTime}>
                    <Thumbnail.Img />
                  </Thumbnail.Root>
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
      </Menu.Portal>
    </Menu.Root>
  );
}

DefaultChaptersMenu.displayName = 'DefaultChaptersMenu';
export { DefaultChaptersMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultSettingsMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultSettingsMenu({ tooltip, placement, portalClass }: DefaultMediaMenuProps) {
  const { showMenuDelay, Icons } = React.useContext(DefaultUIContext),
    settingsText = useI18N('Settings');
  return (
    <Menu.Root className="vds-settings-menu vds-menu" showDelay={showMenuDelay}>
      <DefaultTooltip content={settingsText} placement={tooltip}>
        <Menu.Button className="vds-menu-button vds-button">
          <Icons.Menu.Settings className="vds-rotate-icon" />
        </Menu.Button>
      </DefaultTooltip>
      <Menu.Portal className={portalClass} disabled="fullscreen">
        <Menu.Content className="vds-settings-menu-items vds-menu-items" placement={placement}>
          <DefaultAudioSubmenu />
          <DefaultSpeedSubmenu />
          <DefaultQualitySubmenu />
          <DefaultCaptionSubmenu />
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
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
  Icon: DefaultIcon;
}

function DefaultSubmenuButton({ label, hint, Icon, disabled }: DefaultSubmenuButtonProps) {
  const { Icons } = React.useContext(DefaultUIContext);
  return (
    <Menu.Button className="vds-menu-button" disabled={disabled}>
      <Icons.Menu.ArrowLeft className="vds-menu-button-close-icon" />
      <Icon className="vds-menu-button-icon" />
      <span className="vds-menu-button-label">{label}</span>
      <span className="vds-menu-button-hint">{hint}</span>
      <Icons.Menu.ArrowRight className="vds-menu-button-open-icon" />
    </Menu.Button>
  );
}

DefaultSubmenuButton.displayName = 'DefaultSubmenuButton';
export { DefaultSubmenuButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioSubmenu() {
  const { Icons } = React.useContext(DefaultUIContext),
    label = useI18N('Audio'),
    defaultText = useI18N('Default'),
    track = useMediaState('audioTrack'),
    options = useAudioOptions();
  return (
    <Menu.Root className="vds-audio-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={track?.label ?? defaultText}
        disabled={!options.length}
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

DefaultAudioSubmenu.displayName = 'DefaultAudioSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultSpeedSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultSpeedSubmenu() {
  const { Icons } = React.useContext(DefaultUIContext),
    label = useI18N('Speed'),
    normalText = useI18N('Normal'),
    options = usePlaybackRateOptions(),
    hint = options.selectedValue === '1' ? normalText : options.selectedValue + 'x';
  return (
    <Menu.Root className="vds-speed-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={hint}
        disabled={!options.length}
        Icon={Icons.Menu.Speed}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-speed-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="vds-speed-radio vds-radio"
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

DefaultSpeedSubmenu.displayName = 'DefaultSpeedSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultQualitySubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultQualitySubmenu() {
  const { Icons } = React.useContext(DefaultUIContext),
    label = useI18N('Quality'),
    autoText = useI18N('Auto'),
    autoQuality = useMediaState('autoQuality'),
    options = useVideoQualityOptions({ sort: 'descending' }),
    remote = useMediaRemote(),
    currentQualityText = options.selectedQuality?.height + 'p' ?? '',
    hint = !autoQuality ? currentQualityText : `${autoText} (${currentQualityText})`;
  return (
    <Menu.Root className="vds-quality-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={hint}
        disabled={!options.length}
        Icon={Icons.Menu.Quality}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-quality-radio-group vds-radio-group"
          value={autoQuality ? 'auto' : options.selectedValue}
        >
          <Menu.Radio
            className="vds-quality-radio vds-radio"
            value="auto"
            onSelect={(event) => remote.requestAutoQuality(event)}
          >
            <div className="vds-radio-check" />
            {autoText}
          </Menu.Radio>
          {options.map(({ label, value, bitrateText, select }) => (
            <Menu.Radio
              className="vds-quality-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
              <span className="vds-radio-hint">{bitrateText}</span>
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
  const { Icons } = React.useContext(DefaultUIContext),
    label = useI18N('Captions'),
    offText = useI18N('Off'),
    track = useMediaState('textTrack'),
    options = useCaptionOptions(),
    remote = useMediaRemote(),
    hint = track && isTrackCaptionKind(track) && track.mode === 'showing' ? track.label : offText;
  return (
    <Menu.Root className="vds-captions-menu vds-menu">
      <DefaultSubmenuButton
        label={label}
        hint={hint}
        disabled={!options.length}
        Icon={Icons.Menu.Captions}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-captions-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          <Menu.Radio
            className="vds-caption-radio vds-radio"
            value="off"
            onSelect={(event) => remote.toggleCaptions(event)}
          >
            <div className="vds-radio-check" />
            {offText}
          </Menu.Radio>
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
