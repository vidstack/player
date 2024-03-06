import * as React from 'react';

import { signal } from 'maverick.js';
import { composeRefs, useSignal } from 'maverick.js/react';
import { isNumber, listenEvent } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';
import {
  isKeyboardClick,
  isKeyboardEvent,
  usePlyrLayoutClasses,
  type PlyrControl,
  type PlyrLayoutWord,
  type PlyrMarker,
} from 'vidstack';

import { getDownloadFile } from '../../../../../vidstack/src/utils/network';
import { useAudioOptions } from '../../../hooks/options/use-audio-options';
import { useCaptionOptions } from '../../../hooks/options/use-caption-options';
import { usePlaybackRateOptions } from '../../../hooks/options/use-playback-rate-options';
import { useVideoQualityOptions } from '../../../hooks/options/use-video-quality-options';
import { useClassName } from '../../../hooks/use-dom';
import { useMediaContext } from '../../../hooks/use-media-context';
import { useMediaRemote } from '../../../hooks/use-media-remote';
import { useMediaState } from '../../../hooks/use-media-state';
import { isRemotionSource } from '../../../providers/remotion';
import { Primitive, type PrimitivePropsWithRef } from '../../primitives/nodes';
import { AirPlayButton } from '../../ui/buttons/airplay-button';
import { CaptionButton } from '../../ui/buttons/caption-button';
import { FullscreenButton } from '../../ui/buttons/fullscreen-button';
import { LiveButton } from '../../ui/buttons/live-button';
import { MuteButton } from '../../ui/buttons/mute-button';
import { PIPButton } from '../../ui/buttons/pip-button';
import { PlayButton } from '../../ui/buttons/play-button';
import { SeekButton } from '../../ui/buttons/seek-button';
import { Gesture } from '../../ui/gesture';
import * as Menu from '../../ui/menu';
import * as TimeSlider from '../../ui/sliders/time-slider';
import * as VolumeSlider from '../../ui/sliders/volume-slider';
import * as Thumbnail from '../../ui/thumbnail';
import { Time } from '../../ui/time';
import { RemotionPoster, RemotionSliderThumbnail, RemotionThumbnail } from '../remotion-ui';
import { useLayoutName } from '../utils';
import { i18n, PlyrLayoutContext, usePlyrLayoutContext, usePlyrLayoutWord } from './context';
import { defaultPlyrLayoutProps, type PlyrLayoutProps } from './props';
import { slot } from './slots';

/* -------------------------------------------------------------------------------------------------
 * PlyrLayout
 * -----------------------------------------------------------------------------------------------*/

export interface PlyrLayoutElementProps extends PlyrLayoutProps, PrimitivePropsWithRef<'div'> {}

const PlyrLayout = React.forwardRef<HTMLElement, PlyrLayoutElementProps>(
  (userProps, forwardRef) => {
    const {
        clickToPlay,
        clickToFullscreen,
        controls,
        displayDuration,
        download,
        markers,
        invertTime,
        thumbnails,
        toggleTime,
        translations,
        seekTime,
        speed,
        icons,
        slots,
        posterFrame,
        className,
        ...elProps
      } = { ...defaultPlyrLayoutProps, ...userProps },
      [el, setEl] = React.useState<HTMLElement | null>(null),
      media = useMediaContext(),
      previewTime = React.useMemo(() => signal(0), []),
      $viewType = useMediaState('viewType');

    useLayoutName('plyr');
    useClassName(el, className);

    React.useEffect(() => {
      if (!el || !media) return;
      return usePlyrLayoutClasses(el, media);
    }, [el, media]);

    return (
      <PlyrLayoutContext.Provider
        value={{
          clickToPlay,
          clickToFullscreen,
          controls,
          displayDuration,
          download,
          markers,
          invertTime,
          thumbnails,
          toggleTime,
          translations,
          seekTime,
          speed,
          previewTime,
          icons,
          slots,
          posterFrame,
        }}
      >
        <Primitive.div
          {...elProps}
          className={
            __SERVER__ ? `plyr plyr--full-ui plyr--${$viewType} ${className || ''}` : undefined
          }
          ref={composeRefs(setEl, forwardRef) as any}
        >
          {$viewType === 'audio' ? (
            <PlyrAudioLayout />
          ) : $viewType === 'video' ? (
            <PlyrVideoLayout />
          ) : null}
        </Primitive.div>
      </PlyrLayoutContext.Provider>
    );
  },
);

PlyrLayout.displayName = 'PlyrLayout';
export { PlyrLayout };

/* -------------------------------------------------------------------------------------------------
 * PlyrAudioLayout
 * -----------------------------------------------------------------------------------------------*/

function PlyrAudioLayout() {
  return PlyrAudioControls();
}

PlyrAudioLayout.displayName = 'PlyrAudioLayout';
export { PlyrAudioLayout };

/* -------------------------------------------------------------------------------------------------
 * PlyrVideoLayout
 * -----------------------------------------------------------------------------------------------*/

function PlyrVideoLayout() {
  const media = useMediaContext(),
    { controls } = usePlyrLayoutContext(),
    { load } = media.$props,
    { canLoad } = media.$state,
    $load = useSignal(load),
    $canLoad = useSignal(canLoad);

  if ($load === 'play' && !$canLoad) {
    return (
      <>
        <PlyrPlayLargeButton />
        <PlyrPoster />
      </>
    );
  }

  return (
    <>
      {controls!.includes('play-large') ? <PlyrPlayLargeButton /> : null}
      <PlyrPreviewScrubbing />
      <PlyrPoster />
      <PlyrVideoControls />
      <PlyrGestures />
      <PlyrCaptions />
    </>
  );
}

PlyrVideoLayout.displayName = 'PlyrVideoLayout';
export { PlyrVideoLayout };

/* -------------------------------------------------------------------------------------------------
 * PlyrPlayLargeButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrPlayLargeButton() {
  const { translations, icons: Icons } = usePlyrLayoutContext(),
    $title = useMediaState('title'),
    label = `${i18n(translations, 'Play')} ${$title}`;
  return slot(
    'playLargeButton',
    <PlayButton
      className="plyr__control plyr__control--overlaid"
      aria-label={label}
      data-plyr="play"
    >
      <Icons.Play />
    </PlayButton>,
  );
}

PlyrPlayLargeButton.displayName = 'PlyrPlayLargeButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrPreviewScrubbing
 * -----------------------------------------------------------------------------------------------*/

function PlyrPreviewScrubbing() {
  const $src = useMediaState('source'),
    { thumbnails, previewTime } = usePlyrLayoutContext(),
    $previewTime = useSignal(previewTime),
    $RemotionThumbnail = useSignal(RemotionThumbnail),
    $hasRemotionThumbnail = $RemotionThumbnail && isRemotionSource($src);

  return $hasRemotionThumbnail ? (
    <$RemotionThumbnail className="plyr__preview-scrubbing" frame={$previewTime * $src.fps!} />
  ) : (
    <Thumbnail.Root src={thumbnails} className="plyr__preview-scrubbing" time={$previewTime}>
      <Thumbnail.Img />
    </Thumbnail.Root>
  );
}

PlyrPreviewScrubbing.displayName = 'PlyrPreviewScrubbing';

/* -------------------------------------------------------------------------------------------------
 * PlyrPoster
 * -----------------------------------------------------------------------------------------------*/

function PlyrPoster() {
  const $src = useMediaState('source'),
    $poster = useMediaState('poster'),
    { posterFrame } = usePlyrLayoutContext(),
    $RemotionPoster = useSignal(RemotionPoster),
    $hasRemotionPoster = $RemotionPoster && isRemotionSource($src) && isNumber(posterFrame);

  return slot(
    'poster',
    $hasRemotionPoster ? (
      <$RemotionPoster frame={posterFrame} className="plyr__poster" />
    ) : (
      <div className="plyr__poster" style={{ backgroundImage: `url("${$poster}")` }} />
    ),
  );
}

PlyrPoster.displayName = 'PlyrPoster';

/* -------------------------------------------------------------------------------------------------
 * PlyrAudioControls
 * -----------------------------------------------------------------------------------------------*/

const noAudioControl = new Set<PlyrControl>(['captions', 'pip', 'airplay', 'fullscreen']);

function PlyrAudioControls() {
  const { controls } = usePlyrLayoutContext();
  return (
    <div className="plyr__controls">
      {controls!
        .filter((type) => !noAudioControl.has(type))
        .map((type, i) => {
          const Control = getPlyrControl(type);
          return Control ? React.createElement(Control, { key: i }) : null;
        })}
    </div>
  );
}

PlyrAudioControls.displayName = 'PlyrAudioControls';

/* -------------------------------------------------------------------------------------------------
 * PlyrVideoControls
 * -----------------------------------------------------------------------------------------------*/

function PlyrVideoControls() {
  const { controls } = usePlyrLayoutContext();
  return (
    <div className="plyr__controls">
      {controls!.map((type, i) => {
        const Control = getPlyrControl(type);
        return Control ? React.createElement(Control, { key: i }) : null;
      })}
    </div>
  );
}

PlyrVideoControls.displayName = 'PlyrVideoControls';

/* -------------------------------------------------------------------------------------------------
 * Control
 * -----------------------------------------------------------------------------------------------*/

function getPlyrControl(type: PlyrControl) {
  switch (type) {
    case 'airplay':
      return PlyrAirPlayButton;
    case 'captions':
      return PlyrCaptionsButton;
    case 'current-time':
      return PlyrCurrentTime;
    case 'download':
      return PlyrDownloadButton;
    case 'duration':
      return PlyrDuration;
    case 'fast-forward':
      return PlyrFastForwardButton;
    case 'fullscreen':
      return PlyrFullscreenButton;
    case 'mute':
    case 'volume':
    case 'mute+volume':
      return () => PlyrVolume({ type });
    case 'pip':
      return PlyrPIPButton;
    case 'play':
      return PlyrPlayButton;
    case 'progress':
      return PlyrTimeSlider;
    case 'restart':
      return PlyrRestartButton;
    case 'rewind':
      return PlyrRewindButton;
    case 'settings':
      return PlyrSettings;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------------------------------
 * PlyrAirPlayButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrAirPlayButton() {
  const { icons: Icons } = usePlyrLayoutContext(),
    airPlayText = usePlyrLayoutWord('AirPlay');
  return slot(
    'airPlayButton',
    <AirPlayButton className="plyr__controls__item plyr__control" data-plyr="airplay">
      <Icons.AirPlay />
      <span className="plyr__tooltip">{airPlayText}</span>
    </AirPlayButton>,
  );
}

PlyrAirPlayButton.displayName = 'PlyrAirPlayButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrCaptionsButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrCaptionsButton() {
  const { icons: Icons } = usePlyrLayoutContext(),
    enableText = usePlyrLayoutWord('Enable captions'),
    disableText = usePlyrLayoutWord('Disable captions');
  return slot(
    'captionsButton',
    <CaptionButton
      className="plyr__controls__item plyr__control"
      data-no-label
      data-plyr="captions"
    >
      <Icons.CaptionsOn className="icon--pressed" />
      <Icons.CaptionsOff className="icon--not-pressed" />
      <span className="label--pressed plyr__tooltip">{disableText}</span>
      <span className="label--not-pressed plyr__tooltip">{enableText}</span>
    </CaptionButton>,
  );
}

PlyrCaptionsButton.displayName = 'PlyrCaptionsButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrFullscreenButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrFullscreenButton() {
  const { icons: Icons } = usePlyrLayoutContext(),
    enterText = usePlyrLayoutWord('Enter Fullscreen'),
    exitText = usePlyrLayoutWord('Exit Fullscreen');
  return slot(
    'fullscreenButton',
    <FullscreenButton
      className="plyr__controls__item plyr__control"
      data-no-label
      data-plyr="fullscreen"
    >
      <Icons.EnterFullscreen className="icon--pressed" />
      <Icons.ExitFullscreen className="icon--not-pressed" />
      <span className="label--pressed plyr__tooltip">{exitText}</span>
      <span className="label--not-pressed plyr__tooltip">{enterText}</span>
    </FullscreenButton>,
  );
}

PlyrFullscreenButton.displayName = 'PlyrFullscreenButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrPIPButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrPIPButton() {
  const { icons: Icons } = usePlyrLayoutContext(),
    enterText = usePlyrLayoutWord('Enter PiP'),
    exitText = usePlyrLayoutWord('Exit PiP');
  return slot(
    'pipButton',
    <PIPButton className="plyr__controls__item plyr__control" data-no-label data-plyr="pip">
      <Icons.EnterPiP className="icon--pressed" />
      <Icons.ExitPiP className="icon--not-pressed" />
      <span className="label--pressed plyr__tooltip">{exitText}</span>
      <span className="label--not-pressed plyr__tooltip">{enterText}</span>
    </PIPButton>,
  );
}

PlyrPIPButton.displayName = 'PlyrPIPButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrMuteButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrMuteButton() {
  const { icons: Icons } = usePlyrLayoutContext(),
    muteText = usePlyrLayoutWord('Mute'),
    unmuteText = usePlyrLayoutWord('Unmute');
  return slot(
    'muteButton',
    <MuteButton className="plyr__control" data-no-label data-plyr="mute">
      <Icons.Muted className="icon--pressed" />
      <Icons.Volume className="icon--not-pressed" />
      <span className="label--pressed plyr__tooltip">{unmuteText}</span>
      <span className="label--not-pressed plyr__tooltip">{muteText}</span>
    </MuteButton>,
  );
}

PlyrMuteButton.displayName = 'PlyrMuteButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrPlayButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrPlayButton() {
  const { icons: Icons } = usePlyrLayoutContext(),
    playText = usePlyrLayoutWord('Play'),
    pauseText = usePlyrLayoutWord('Pause');
  return slot(
    'playButton',
    <PlayButton className="plyr__controls__item plyr__control" data-no-label data-plyr="play">
      <Icons.Pause className="icon--pressed" />
      <Icons.Play className="icon--not-pressed" />
      <span className="label--pressed plyr__tooltip">{pauseText}</span>
      <span className="label--not-pressed plyr__tooltip">{playText}</span>
    </PlayButton>,
  );
}

PlyrPlayButton.displayName = 'PlyrPlayButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrRestartButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrRestartButton() {
  const { icons: Icons } = usePlyrLayoutContext(),
    restartText = usePlyrLayoutWord('Restart'),
    remote = useMediaRemote();

  function onPress({ nativeEvent: event }: React.SyntheticEvent) {
    if (isKeyboardEvent(event) && !isKeyboardClick(event)) return;
    remote.seek(0, event);
  }

  return slot(
    'restartButton',
    <button
      type="button"
      className="plyr__control"
      data-plyr="restart"
      onPointerUp={onPress}
      onKeyDown={onPress}
    >
      <slot name="restart-icon" data-class=""></slot>
      <Icons.Restart />
      <span className="plyr__tooltip">{restartText}</span>
    </button>,
  );
}

PlyrRestartButton.displayName = 'PlyrRestartButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrFastForwardButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrFastForwardButton() {
  const { icons: Icons, seekTime } = usePlyrLayoutContext(),
    forwardText = usePlyrLayoutWord('Forward'),
    label = `${forwardText} ${seekTime}s`;
  return slot(
    'fastForwardButton',
    <SeekButton
      className="plyr__controls__item plyr__control"
      seconds={seekTime}
      data-no-label
      data-plyr="fast-forward"
    >
      <Icons.FastForward />
      <span className="plyr__tooltip">{label}</span>
    </SeekButton>,
  );
}

PlyrFastForwardButton.displayName = 'PlyrFastForwardButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrRewindButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrRewindButton() {
  const { icons: Icons, seekTime } = usePlyrLayoutContext(),
    rewindText = usePlyrLayoutWord('Rewind'),
    label = `${rewindText} ${seekTime}s`;
  return slot(
    'rewindButton',
    <SeekButton
      className="plyr__controls__item plyr__control"
      seconds={-1 * seekTime!}
      data-no-label
      data-plyr="rewind"
    >
      <Icons.Rewind />
      <span className="plyr__tooltip">{label}</span>
    </SeekButton>,
  );
}

PlyrRewindButton.displayName = 'PlyrRewindButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrTimeSlider
 * -----------------------------------------------------------------------------------------------*/

function PlyrTimeSlider() {
  const { markers, thumbnails, seekTime, previewTime } = usePlyrLayoutContext(),
    $src = useMediaState('source'),
    $duration = useMediaState('duration'),
    seekText = usePlyrLayoutWord('Seek'),
    [activeMarker, setActiveMarker] = React.useState<PlyrMarker | null>(null),
    $RemotionSliderThumbnail = useSignal(RemotionSliderThumbnail),
    $hasRemotionSliderThumbnail = $RemotionSliderThumbnail && isRemotionSource($src);

  function onSeekingRequest(time: number) {
    previewTime.set(time);
  }

  function onMarkerEnter(this: PlyrMarker) {
    setActiveMarker(this);
  }

  function onMarkerLeave() {
    setActiveMarker(null);
  }

  const markerLabel = activeMarker ? (
    <span
      className="plyr__progress__marker-label"
      dangerouslySetInnerHTML={{ __html: activeMarker.label + '<br />' }}
    ></span>
  ) : null;

  return slot(
    'timeSlider',
    <div className="plyr__controls__item plyr__progress__container">
      <div className="plyr__progress">
        <TimeSlider.Root
          className="plyr__slider"
          pauseWhileDragging
          keyStep={seekTime}
          aria-label={seekText}
          data-plyr="seek"
          onMediaSeekingRequest={onSeekingRequest}
        >
          <div className="plyr__slider__track"></div>
          <div className="plyr__slider__thumb"></div>
          <div className="plyr__slider__buffer"></div>

          {!thumbnails && !$hasRemotionSliderThumbnail ? (
            <span className="plyr__tooltip">
              {markerLabel}
              <TimeSlider.Value />
            </span>
          ) : $hasRemotionSliderThumbnail ? (
            <TimeSlider.Preview className="plyr__slider__preview">
              <div className="plyr__slider__preview__thumbnail">
                <span className="plyr__slider__preview__time-container">
                  {markerLabel}
                  <TimeSlider.Value className="plyr__slider__preview__time" />
                </span>
                <$RemotionSliderThumbnail className="plyr__slider__preview__thumbnail" />
              </div>
            </TimeSlider.Preview>
          ) : (
            <TimeSlider.Preview className="plyr__slider__preview">
              <TimeSlider.Thumbnail.Root
                src={thumbnails}
                className="plyr__slider__preview__thumbnail"
              >
                <span className="plyr__slider__preview__time-container">
                  {markerLabel}
                  <TimeSlider.Value className="plyr__slider__preview__time" />
                </span>
                <TimeSlider.Thumbnail.Img />
              </TimeSlider.Thumbnail.Root>
            </TimeSlider.Preview>
          )}

          {markers && Number.isFinite($duration)
            ? markers.map((marker, i) => (
                <span
                  className="plyr__progress__marker"
                  key={i}
                  onMouseEnter={onMarkerEnter.bind(marker)}
                  onMouseLeave={onMarkerLeave}
                  style={{ left: `${(marker.time / $duration) * 100}%` }}
                ></span>
              ))
            : null}
        </TimeSlider.Root>
      </div>
    </div>,
  );
}

PlyrTimeSlider.displayName = 'PlyrTimeSlider';

/* -------------------------------------------------------------------------------------------------
 * PlyrVolumeSlider
 * -----------------------------------------------------------------------------------------------*/

function PlyrVolumeSlider() {
  const volumeText = usePlyrLayoutWord('Volume');
  return slot(
    'volumeSlider',
    <VolumeSlider.Root className="plyr__slider" data-plyr="volume" aria-label={volumeText}>
      <div className="plyr__slider__track"></div>
      <div className="plyr__slider__thumb"></div>
    </VolumeSlider.Root>,
  );
}

PlyrVolumeSlider.displayName = 'PlyrVolumeSlider';

/* -------------------------------------------------------------------------------------------------
 * PlyrVolume
 * -----------------------------------------------------------------------------------------------*/

function PlyrVolume({ type }: { type: PlyrControl }) {
  const hasMuteButton = type === 'mute' || type === 'mute+volume',
    hasVolumeSlider = type === 'volume' || type === 'mute+volume';
  return (
    <div className="plyr__controls__item plyr__volume">
      {hasMuteButton ? <PlyrMuteButton /> : null}
      {hasVolumeSlider ? <PlyrVolumeSlider /> : null}
    </div>
  );
}

PlyrVolume.displayName = 'PlyrVolume';

/* -------------------------------------------------------------------------------------------------
 * PlyrCurrentTime
 * -----------------------------------------------------------------------------------------------*/

function PlyrCurrentTime() {
  const { invertTime, toggleTime, displayDuration } = usePlyrLayoutContext(),
    $streamType = useMediaState('streamType'),
    currentTimeText = usePlyrLayoutWord('Current time'),
    liveText = usePlyrLayoutWord('LIVE'),
    [invert, setInvert] = React.useState(invertTime),
    remainder = !displayDuration && invert;

  function onPress({ nativeEvent: event }: React.SyntheticEvent) {
    if (!toggleTime || displayDuration || (isKeyboardEvent(event) && !isKeyboardClick(event))) {
      return;
    }

    setInvert((n) => !n);
  }

  return slot(
    'currentTime',
    $streamType === 'live' || $streamType === 'll-live' ? (
      <LiveButton className="plyr__controls__item plyr__control plyr__live-button" data-plyr="live">
        <span className="plyr__live-button__text">{liveText}</span>
      </LiveButton>
    ) : (
      <>
        <Time
          type="current"
          className="plyr__controls__item plyr__time plyr__time--current"
          role="timer"
          aria-label={currentTimeText}
          tabIndex={0}
          remainder={remainder}
          onPointerUp={onPress}
          onKeyDown={onPress}
        />
        {displayDuration ? <PlyrDuration /> : null}
      </>
    ),
  );
}

PlyrCurrentTime.displayName = 'PlyrCurrentTime';

/* -------------------------------------------------------------------------------------------------
 * PlyrDuration
 * -----------------------------------------------------------------------------------------------*/

function PlyrDuration() {
  const durationText = usePlyrLayoutWord('Duration');
  return slot(
    'duration',
    <Time
      className="plyr__controls__item plyr__time plyr__time--duration"
      type="duration"
      role="timer"
      tabIndex={0}
      aria-label={durationText}
    />,
  );
}

PlyrDuration.displayName = 'PlyrDuration';

/* -------------------------------------------------------------------------------------------------
 * PlyrDownloadButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrDownloadButton() {
  const { download } = usePlyrLayoutContext(),
    $src = useMediaState('source'),
    $title = useMediaState('title'),
    file = getDownloadFile({
      title: $title,
      src: $src,
      download,
    }),
    downloadText = usePlyrLayoutWord('Download');

  return slot(
    'download',
    file ? (
      <a
        className="plyr__controls__item plyr__control"
        href={file.url + `?download=${file.name}`}
        download={file.name}
        target="_blank"
      >
        <slot name="download-icon" />
        <span className="plyr__tooltip">{downloadText}</span>
      </a>
    ) : null,
  );
}

PlyrDownloadButton.displayName = 'PlyrDownloadButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrGestures
 * -----------------------------------------------------------------------------------------------*/

function PlyrGestures() {
  const { clickToPlay, clickToFullscreen } = usePlyrLayoutContext();
  return (
    <>
      {clickToPlay ? (
        <Gesture className="plyr__gesture" event="pointerup" action="toggle:paused" />
      ) : null}
      {clickToFullscreen ? (
        <Gesture className="plyr__gesture" event="dblpointerup" action="toggle:fullscreen" />
      ) : null}
    </>
  );
}

PlyrGestures.displayName = 'PlyrGestures';

/* -------------------------------------------------------------------------------------------------
 * PlyrCaptions
 * -----------------------------------------------------------------------------------------------*/

function PlyrCaptions() {
  const $track = useMediaState('textTrack'),
    [activeCue, setActiveCue] = React.useState<VTTCue | null>(null);

  React.useEffect(() => {
    if (!$track) return;

    function onCueChange() {
      setActiveCue($track ? $track.activeCues[0] : null);
    }

    onCueChange();
    return listenEvent($track, 'cue-change', onCueChange);
  }, [$track]);

  return (
    <div className="plyr__captions" dir="auto">
      <span
        className="plyr__caption"
        dangerouslySetInnerHTML={{
          __html: activeCue?.text || '',
        }}
      />
    </div>
  );
}

PlyrCaptions.displayName = 'PlyrCaptions';

/* -------------------------------------------------------------------------------------------------
 * PlyrSettings
 * -----------------------------------------------------------------------------------------------*/

function PlyrSettings() {
  const { icons: Icons } = usePlyrLayoutContext(),
    settingsText = usePlyrLayoutWord('Settings');
  return slot(
    'settings',
    <div className="plyr__controls__item plyr__menu">
      <Menu.Root>
        <Menu.Button className="plyr__control" data-plyr="settings">
          {slot(
            'settingsButton',
            <>
              <Icons.Settings />
              <span className="plyr__tooltip">{settingsText}</span>
            </>,
          )}
        </Menu.Button>
        <Menu.Items className="plyr__menu__container" placement="top end">
          <div>
            <div>
              {slot(
                'settingsMenu',
                <>
                  <PlyrAudioMenu />
                  <PlyrCaptionsMenu />
                  <PlyrQualityMenu />
                  <PlyrSpeedMenu />
                </>,
              )}
            </div>
          </div>
        </Menu.Items>
      </Menu.Root>
    </div>,
  );
}

PlyrSettings.displayName = 'PlyrSettings';

/* -------------------------------------------------------------------------------------------------
 * PlyrMenuButton
 * -----------------------------------------------------------------------------------------------*/

function PlyrMenuButton({
  label,
  hint,
  open,
  disabled,
}: {
  label: PlyrLayoutWord;
  hint?: string;
  open: boolean;
  disabled: boolean;
}) {
  const buttonText = usePlyrLayoutWord(label),
    goBackText = usePlyrLayoutWord('Go back to previous menu');
  return (
    <Menu.Button
      className={`plyr__control plyr__control--${open ? 'back' : 'forward'}`}
      data-plyr="settings"
      disabled={disabled}
    >
      <span className="plyr__menu__label" aria-hidden={open ? 'true' : undefined}>
        {buttonText}
      </span>
      {hint ? <span className="plyr__menu__value">{hint}</span> : null}
      {open ? <span className="plyr__sr-only">{goBackText}</span> : null}
    </Menu.Button>
  );
}

PlyrMenuButton.displayName = 'PlyrMenuButton';

/* -------------------------------------------------------------------------------------------------
 * PlyrMenu
 * -----------------------------------------------------------------------------------------------*/

function PlyrMenu({
  label,
  hint,
  children,
  disabled,
}: {
  label: PlyrLayoutWord;
  hint?: string;
  disabled;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  function onOpen() {
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  return (
    <Menu.Root onOpen={onOpen} onClose={onClose}>
      <PlyrMenuButton label={label} open={open} hint={hint} disabled={disabled} />
      <Menu.Items>{children}</Menu.Items>
    </Menu.Root>
  );
}

PlyrMenu.displayName = 'PlyrMenu';

/* -------------------------------------------------------------------------------------------------
 * PlyrAudioMenu
 * -----------------------------------------------------------------------------------------------*/

function PlyrAudioMenu() {
  const defaultText = usePlyrLayoutWord('Default'),
    $track = useMediaState('audioTrack'),
    options = useAudioOptions();
  return (
    <PlyrMenu label="Audio" hint={$track?.label ?? defaultText} disabled={options.disabled}>
      <Menu.RadioGroup value={options.selectedValue}>
        {options.map(({ label, value, select }) => (
          <Menu.Radio className="plyr__control" value={value} onSelect={select} key={value}>
            <span>{label}</span>
          </Menu.Radio>
        ))}
      </Menu.RadioGroup>
    </PlyrMenu>
  );
}

PlyrAudioMenu.displayName = 'PlyrAudioMenu';

/* -------------------------------------------------------------------------------------------------
 * PlyrSpeedMenu
 * -----------------------------------------------------------------------------------------------*/

function PlyrSpeedMenu() {
  const normalLabel = usePlyrLayoutWord('Normal'),
    options = usePlaybackRateOptions({ normalLabel }),
    hint = options.selectedValue === '1' ? normalLabel : options.selectedValue + 'x';
  return (
    <PlyrMenu label="Speed" hint={hint} disabled={options.disabled}>
      <Menu.RadioGroup value={options.selectedValue}>
        {options.map(({ label, value, select }) => (
          <Menu.Radio className="plyr__control" value={value} onSelect={select} key={value}>
            <span>{label}</span>
          </Menu.Radio>
        ))}
      </Menu.RadioGroup>
    </PlyrMenu>
  );
}

PlyrSpeedMenu.displayName = 'PlyrSpeedMenu';

/* -------------------------------------------------------------------------------------------------
 * PlyrCaptionsMenu
 * -----------------------------------------------------------------------------------------------*/

function PlyrCaptionsMenu() {
  const offText = usePlyrLayoutWord('Disabled'),
    options = useCaptionOptions({ off: offText }),
    hint = options.selectedTrack?.label ?? offText;
  return (
    <PlyrMenu label="Captions" hint={hint} disabled={options.disabled}>
      <Menu.RadioGroup value={options.selectedValue}>
        {options.map(({ label, value, select }) => (
          <Menu.Radio className="plyr__control" value={value} onSelect={select} key={value}>
            <span>{label}</span>
          </Menu.Radio>
        ))}
      </Menu.RadioGroup>
    </PlyrMenu>
  );
}

PlyrCaptionsMenu.displayName = 'PlyrCaptionsMenu';

/* -------------------------------------------------------------------------------------------------
 * PlyrQualityMenu
 * -----------------------------------------------------------------------------------------------*/

function PlyrQualityMenu() {
  const autoText = usePlyrLayoutWord('Auto'),
    options = useVideoQualityOptions({ auto: autoText, sort: 'descending' }),
    currentQuality = options.selectedQuality?.height,
    hint =
      options.selectedValue !== 'auto' && currentQuality
        ? `${currentQuality}p`
        : `${autoText}${currentQuality ? ` (${currentQuality}p)` : ''}`;
  return (
    <PlyrMenu label="Quality" hint={hint} disabled={options.disabled}>
      <Menu.RadioGroup value={options.selectedValue}>
        {options.map(({ label, value, select }) => (
          <Menu.Radio className="plyr__control" value={value} onSelect={select} key={value}>
            <span>{label}</span>
          </Menu.Radio>
        ))}
      </Menu.RadioGroup>
    </PlyrMenu>
  );
}

PlyrQualityMenu.displayName = 'PlyrQualityMenu';
