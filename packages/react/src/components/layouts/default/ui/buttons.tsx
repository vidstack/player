import * as React from 'react';

import { uppercaseFirstChar } from 'maverick.js/std';
import { getDownloadFile, isTrackCaptionKind } from 'vidstack';

import { useMediaState } from '../../../../hooks/use-media-state';
import { AirPlayButton } from '../../../ui/buttons/airplay-button';
import { CaptionButton } from '../../../ui/buttons/caption-button';
import { FullscreenButton } from '../../../ui/buttons/fullscreen-button';
import { GoogleCastButton } from '../../../ui/buttons/google-cast-button';
import { LiveButton } from '../../../ui/buttons/live-button';
import { MuteButton } from '../../../ui/buttons/mute-button';
import { PIPButton } from '../../../ui/buttons/pip-button';
import { PlayButton } from '../../../ui/buttons/play-button';
import { SeekButton } from '../../../ui/buttons/seek-button';
import * as Tooltip from '../../../ui/tooltip';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../context';
import { DefaultTooltip } from './tooltip';

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

interface DefaultMediaButtonProps {
  tooltip: Tooltip.ContentProps['placement'];
}

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
 * DefaultDownloadButton
 * -----------------------------------------------------------------------------------------------*/

function DefaultDownloadButton() {
  const { download, icons: Icons } = useDefaultLayoutContext(),
    $src = useMediaState('source'),
    $title = useMediaState('title'),
    file = getDownloadFile({
      title: $title,
      src: $src,
      download,
    }),
    downloadText = useDefaultLayoutWord('Download');

  return file ? (
    <DefaultTooltip content={downloadText} placement="top">
      <a
        role="button"
        className="vds-download-button vds-button"
        aria-label={downloadText}
        href={file.url + `?download=${file.name}`}
        download={file.name}
        target="_blank"
      >
        {Icons.DownloadButton ? <Icons.DownloadButton.Default className="vds-icon" /> : null}
      </a>
    </DefaultTooltip>
  ) : null;
}

DefaultDownloadButton.displayName = 'DefaultDownloadButton';
export { DefaultDownloadButton };
