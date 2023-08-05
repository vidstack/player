import * as React from 'react';
import arrowLeftPaths from 'media-icons/dist/icons/arrow-left.js';
import chaptersIconPaths from 'media-icons/dist/icons/chapters.js';
import arrowRightPaths from 'media-icons/dist/icons/chevron-right.js';
import ccOnIconPaths from 'media-icons/dist/icons/closed-captions-on.js';
import ccIconPaths from 'media-icons/dist/icons/closed-captions.js';
import exitFullscreenIconPaths from 'media-icons/dist/icons/fullscreen-exit.js';
import enterFullscreenIconPaths from 'media-icons/dist/icons/fullscreen.js';
import musicIconPaths from 'media-icons/dist/icons/music.js';
import muteIconPaths from 'media-icons/dist/icons/mute.js';
import odometerIconPaths from 'media-icons/dist/icons/odometer.js';
import pauseIconPaths from 'media-icons/dist/icons/pause.js';
import exitPIPIconPaths from 'media-icons/dist/icons/picture-in-picture-exit.js';
import enterPIPIconPaths from 'media-icons/dist/icons/picture-in-picture.js';
import playIconPaths from 'media-icons/dist/icons/play.js';
import replayIconPaths from 'media-icons/dist/icons/replay.js';
import seekBackward10IconPaths from 'media-icons/dist/icons/seek-backward-10.js';
import seekForward10IconPaths from 'media-icons/dist/icons/seek-forward-10.js';
import qualityIconPaths from 'media-icons/dist/icons/settings-menu.js';
import settingsIconPaths from 'media-icons/dist/icons/settings.js';
import volumeHighIconPaths from 'media-icons/dist/icons/volume-high.js';
import volumeLowIconPaths from 'media-icons/dist/icons/volume-low.js';
import { useReactContext, useSignal } from 'maverick.js/react';
import {
  defaultSkinContext,
  isTrackCaptionKind,
  type DefaultSkinTranslations,
  type MenuPlacement,
  type TooltipPlacement,
} from 'vidstack/lib';
import { useAudioOptions } from '../../../hooks/options/use-audio-options';
import { useCaptionOptions } from '../../../hooks/options/use-caption-options';
import { useChapterOptions } from '../../../hooks/options/use-chapter-options';
import { usePlaybackRateOptions } from '../../../hooks/options/use-playback-rate-options';
import { useVideoQualityOptions } from '../../../hooks/options/use-video-quality-options';
import { useActiveTextCues } from '../../../hooks/use-active-text-cues';
import { useActiveTextTrack } from '../../../hooks/use-active-text-track';
import { useMediaRemote } from '../../../hooks/use-media-remote';
import { useMediaState } from '../../../hooks/use-media-state';
import { Icon } from '../../../icon';
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

/* -------------------------------------------------------------------------------------------------
 * PlayButton
 * -----------------------------------------------------------------------------------------------*/

function VdsPlayButton({ tooltip }: VdsButtonProps) {
  const playText = useI18N('Play'),
    pauseText = useI18N('Pause'),
    paused = useMediaState('paused');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className="vds-play-button vds-button">
          <Icon paths={playIconPaths} data-state="play" />
          <Icon paths={pauseIconPaths} data-state="pause" />
          <Icon paths={replayIconPaths} data-state="replay" />
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
        {paused ? playText : pauseText}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

VdsPlayButton.displayName = 'VdsPlayButton';
export { VdsPlayButton };

/* -------------------------------------------------------------------------------------------------
 * MuteButton
 * -----------------------------------------------------------------------------------------------*/

function VdsMuteButton({ tooltip }: VdsButtonProps) {
  const muteText = useI18N('Mute'),
    unmuteText = useI18N('Unmute'),
    muted = useMediaState('muted');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <MuteButton className="vds-mute-button vds-button">
          <Icon paths={muteIconPaths} data-state="volume-mute" />
          <Icon paths={volumeLowIconPaths} data-state="volume-low" />
          <Icon paths={volumeHighIconPaths} data-state="volume-high" />
        </MuteButton>
      </Tooltip.Trigger>
      <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
        {muted ? unmuteText : muteText}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

VdsMuteButton.displayName = 'VdsMuteButton';
export { VdsMuteButton };

/* -------------------------------------------------------------------------------------------------
 * CaptionButton
 * -----------------------------------------------------------------------------------------------*/

function VdsCaptionButton({ tooltip }: VdsButtonProps) {
  const onText = useI18N('Closed-Captions On'),
    offText = useI18N('Closed-Captions Off'),
    track = useMediaState('textTrack');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <CaptionButton className="vds-caption-button vds-button">
          <Icon paths={ccIconPaths} data-state="on" />
          <Icon paths={ccOnIconPaths} data-state="off" />
        </CaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
        {track && isTrackCaptionKind(track) ? offText : onText}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export { VdsCaptionButton };

/* -------------------------------------------------------------------------------------------------
 * PIPButton
 * -----------------------------------------------------------------------------------------------*/

function VdsPIPButton({ tooltip }: VdsButtonProps) {
  const enterText = useI18N('Enter PiP'),
    exitText = useI18N('Exit PiP'),
    pip = useMediaState('pictureInPicture');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className="vds-pip-button vds-button">
          <Icon paths={enterPIPIconPaths} data-state="enter" />
          <Icon paths={exitPIPIconPaths} data-state="exit" />
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
        {pip ? exitText : enterText}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

VdsPIPButton.displayName = 'VdsPIPButton';
export { VdsPIPButton };

/* -------------------------------------------------------------------------------------------------
 * FullscreenButton
 * -----------------------------------------------------------------------------------------------*/

function VdsFullscreenButton({ tooltip }: VdsButtonProps) {
  const enterText = useI18N('Enter Fullscreen'),
    exitText = useI18N('Exit Fullscreen'),
    fullscreen = useMediaState('fullscreen');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <FullscreenButton className="vds-fullscreen-button vds-button">
          <Icon paths={enterFullscreenIconPaths} data-state="enter" />
          <Icon paths={exitFullscreenIconPaths} data-state="exit" />
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
        {fullscreen ? exitText : enterText}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

VdsFullscreenButton.displayName = 'VdsFullscreenButton';
export { VdsFullscreenButton };

/* -------------------------------------------------------------------------------------------------
 * SeekButton
 * -----------------------------------------------------------------------------------------------*/

function VdsSeekButton({ seconds, tooltip }: VdsButtonProps & { seconds: number }) {
  const seekForwardText = useI18N('Seek Forward'),
    seekBackwardText = useI18N('Seek Backward');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton className="vds-seek-button vds-button" seconds={seconds}>
          <Icon paths={seconds >= 0 ? seekForward10IconPaths : seekBackward10IconPaths} />
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
        {seconds >= 0 ? seekForwardText : seekBackwardText}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

VdsSeekButton.displayName = 'VdsSeekButton';
export { VdsSeekButton };

/* -------------------------------------------------------------------------------------------------
 * VolumeSlider
 * -----------------------------------------------------------------------------------------------*/

function VdsVolumeSlider() {
  return (
    <VolumeSlider.Root className="vds-volume-slider vds-slider">
      <VolumeSlider.Track className="vds-slider-track" />
      <VolumeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <VolumeSlider.Thumb className="vds-slider-thumb" />
      <VolumeSlider.Preview className="vds-slider-preview" overflow>
        <VolumeSlider.Value className="vds-slider-value" />
      </VolumeSlider.Preview>
    </VolumeSlider.Root>
  );
}

VdsVolumeSlider.displayName = 'VdsVolumeSlider';
export { VdsVolumeSlider };

/* -------------------------------------------------------------------------------------------------
 * TimeSlider
 * -----------------------------------------------------------------------------------------------*/

function VdsTimeSlider() {
  return (
    <TimeSlider.Root className="vds-time-slider vds-slider">
      <TimeSlider.Chapters className="vds-slider-chapters">
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
        <TimeSlider.Thumbnail.Root className="vds-slider-thumbnail vds-thumbnail">
          <TimeSlider.Thumbnail.Img />
        </TimeSlider.Thumbnail.Root>
        <TimeSlider.ChapterTitle className="vds-slider-chapter-title" />
        <TimeSlider.Value className="vds-slider-value" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}

VdsTimeSlider.displayName = 'VdsTimeSlider';
export { VdsTimeSlider };

/* -------------------------------------------------------------------------------------------------
 * MainTitle
 * -----------------------------------------------------------------------------------------------*/

function VdsMainTitle() {
  const $title = useMediaState('title');
  return <span className="vds-media-title">{$title}</span>;
}

VdsMainTitle.displayName = 'VdsMainTitle';
export { VdsMainTitle };

/* -------------------------------------------------------------------------------------------------
 * ChapterTitle
 * -----------------------------------------------------------------------------------------------*/

function VdsChapterTitle() {
  const $started = useMediaState('started'),
    $title = useMediaState('title'),
    track = useActiveTextTrack('chapters'),
    cues = useActiveTextCues(track);
  return <span className="vds-media-title">{$started ? cues[0]?.text || $title : $title}</span>;
}

VdsChapterTitle.displayName = 'VdsChapterTitle';
export { VdsChapterTitle };

/* -------------------------------------------------------------------------------------------------
 * TimeGroup
 * -----------------------------------------------------------------------------------------------*/

function VdsTimeGroup() {
  return (
    <div className="vds-time-group">
      <Time className="vds-time" type="current" />
      <div className="vds-time-divider">/</div>
      <Time className="vds-time" type="duration" />
    </div>
  );
}

VdsTimeGroup.displayName = 'VdsTimeGroup';
export { VdsTimeGroup };

/* -------------------------------------------------------------------------------------------------
 * ChaptersMenu
 * -----------------------------------------------------------------------------------------------*/

function VdsChaptersMenu({ tooltip, placement }: VdsMenuProps) {
  const chaptersText = useI18N('Chapters'),
    options = useChapterOptions(),
    thumbnailCues = useMediaState('thumbnailCues'),
    disabled = !options.length;
  return (
    <Menu.Root className="vds-chapters-menu vds-menu">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className="vds-menu-button vds-button" disabled={disabled}>
            <Icon paths={chaptersIconPaths} />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
          {chaptersText}
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Portal>
        <Menu.Content className="vds-chapters-menu-items vds-menu-items" placement={placement}>
          <Menu.RadioGroup
            className="vds-chapters-radio-group vds-radio-group"
            value={options.selectedValue}
            data-thumbnails={thumbnailCues.length}
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
                  <Thumbnail.Root className="vds-thumbnail" time={cue.startTime}>
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

VdsChaptersMenu.displayName = 'VdsChaptersMenu';
export { VdsChaptersMenu };

/* -------------------------------------------------------------------------------------------------
 * SettingsMenu
 * -----------------------------------------------------------------------------------------------*/

function VdsSettingsMenu({ tooltip, placement }: VdsMenuProps) {
  const settingsText = useI18N('Settings');
  return (
    <Menu.Root className="vds-settings-menu vds-menu">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className="vds-menu-button vds-button">
            <Icon className="vds-rotate-icon" paths={settingsIconPaths} />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
          {settingsText}
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Portal>
        <Menu.Content className="vds-settings-menu-items vds-menu-items" placement={placement}>
          <VdsAudioSubmenu />
          <VdsSpeedSubmenu />
          <VdsQualitySubmenu />
          <VdsCaptionSubmenu />
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

VdsSettingsMenu.displayName = 'VdsSettingsMenu';
export { VdsSettingsMenu };

/* -------------------------------------------------------------------------------------------------
 * SubmenuButton
 * -----------------------------------------------------------------------------------------------*/

interface SubmenuButtonProps {
  label: string;
  hint: string;
  icon: string;
  disabled: boolean;
}

function VdsSubmenuButton({ label, hint, icon, disabled }: SubmenuButtonProps) {
  return (
    <Menu.Button className="vds-menu-button" disabled={disabled}>
      <Icon className="vds-menu-button-close-icon" paths={arrowLeftPaths} />
      <Icon className="vds-menu-button-icon" paths={icon} />
      <span className="vds-menu-button-label">{label}</span>
      <span className="vds-menu-button-hint">{hint}</span>
      <Icon className="vds-menu-button-open-icon" paths={arrowRightPaths} />
    </Menu.Button>
  );
}

VdsSubmenuButton.displayName = 'VdsSubmenuButton';

/* -------------------------------------------------------------------------------------------------
 * AudioSubmenu
 * -----------------------------------------------------------------------------------------------*/

function VdsAudioSubmenu() {
  const label = useI18N('Audio'),
    defaultText = useI18N('Default'),
    track = useMediaState('audioTrack'),
    options = useAudioOptions();
  return (
    <Menu.Root className="vds-audio-menu vds-menu">
      <VdsSubmenuButton
        label={label}
        hint={track?.label ?? defaultText}
        icon={musicIconPaths}
        disabled={!options.length}
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

VdsAudioSubmenu.displayName = 'VdsAudioSubmenu';

/* -------------------------------------------------------------------------------------------------
 * SpeedSubmenu
 * -----------------------------------------------------------------------------------------------*/

function VdsSpeedSubmenu() {
  const label = useI18N('Speed'),
    normalText = useI18N('Normal'),
    options = usePlaybackRateOptions(),
    hint = options.selectedValue === '1' ? normalText : options.selectedValue + 'x';
  return (
    <Menu.Root className="vds-speed-menu vds-menu">
      <VdsSubmenuButton
        label={label}
        hint={hint}
        icon={odometerIconPaths}
        disabled={!options.length}
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

VdsSpeedSubmenu.displayName = 'VdsSpeedSubmenu';

/* -------------------------------------------------------------------------------------------------
 * QualitySubmenu
 * -----------------------------------------------------------------------------------------------*/

function VdsQualitySubmenu() {
  const label = useI18N('Quality'),
    autoText = useI18N('Auto'),
    options = useVideoQualityOptions({ sort: 'descending' }),
    autoQuality = useMediaState('autoQuality'),
    remote = useMediaRemote(),
    currentQualityText = options.selectedQuality?.height + 'p' ?? '',
    hint = !autoQuality ? currentQualityText : `${autoText} (${currentQualityText})`;
  return (
    <Menu.Root className="vds-quality-menu vds-menu">
      <VdsSubmenuButton
        label={label}
        hint={hint}
        icon={qualityIconPaths}
        disabled={!options.length}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-quality-radio-group vds-radio-group"
          value={options.selectedValue}
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

VdsQualitySubmenu.displayName = 'VdsQualitySubmenu';

/* -------------------------------------------------------------------------------------------------
 * CaptionSubmenu
 * -----------------------------------------------------------------------------------------------*/

function VdsCaptionSubmenu() {
  const label = useI18N('Captions'),
    offText = useI18N('Off'),
    track = useMediaState('textTrack'),
    options = useCaptionOptions(),
    remote = useMediaRemote(),
    hint = track && isTrackCaptionKind(track) && track.mode === 'showing' ? track.label : offText;
  return (
    <Menu.Root className="vds-captions-menu vds-menu">
      <VdsSubmenuButton label={label} hint={hint} icon={ccIconPaths} disabled={!options.length} />
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

VdsCaptionSubmenu.displayName = 'VdsCaptionSubmenu';

/* -------------------------------------------------------------------------------------------------
 * I18N
 * -----------------------------------------------------------------------------------------------*/

function useI18N(key: keyof DefaultSkinTranslations): string {
  const { translations } = useReactContext(defaultSkinContext)!,
    $translations = useSignal(translations);
  return $translations?.[key] ?? key;
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

interface VdsButtonProps {
  tooltip: TooltipPlacement;
}

interface VdsMenuProps {
  placement: MenuPlacement;
  tooltip: TooltipPlacement;
}
