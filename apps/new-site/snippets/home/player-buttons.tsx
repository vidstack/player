import clsx from 'clsx';
import React from 'react';
import {
  CaptionButton,
  FullscreenButton,
  isTrackCaptionKind,
  MuteButton,
  PIPButton,
  PlayButton,
  Tooltip,
  useMediaState,
  type TooltipPlacement,
} from '@vidstack/react';
import {
  PauseIcon,
  PlayIcon,
  //...
} from '@vidstack/react/icons';

const btnClassName =
    'w-10 h-10 flex items-center justify-center rounded-sm hocus:bg-white/20 select-none',
  btnIconClassName = 'w-8 h-8';

export function Play() {
  const isPaused = useMediaState('paused'),
    ended = useMediaState('ended'),
    tooltipText = isPaused ? 'Play' : 'Pause',
    Icon = ended ? ReplayIcon : isPaused ? PlayIcon : PauseIcon;
  return (
    <DefaultTooltip tooltip={tooltipText} placement="top start">
      <PlayButton className={btnClassName}>
        <Icon className={btnIconClassName} />
      </PlayButton>
    </DefaultTooltip>
  );
}

export function Mute() {
  const isMuted = useMediaState('muted'),
    volume = useMediaState('volume'),
    tooltipText = isMuted ? 'Unmute' : 'Mute',
    Icon = isMuted || volume === 0 ? MuteIcon : volume < 50 ? VolumeLowIcon : VolumeHighIcon;
  return (
    <DefaultTooltip tooltip={tooltipText} placement="top">
      <MuteButton className={btnClassName}>
        <Icon className={btnIconClassName} />
      </MuteButton>
    </DefaultTooltip>
  );
}

export function Caption() {
  const textTrack = useMediaState('textTrack'),
    isOn = textTrack && isTrackCaptionKind(textTrack),
    tooltipText = isOn ? 'Closed-Captions Off' : 'Closed-Captions On',
    Icon = isOn ? ClosedCaptionsOnIcon : ClosedCaptionsIcon;
  return (
    <DefaultTooltip tooltip={tooltipText} placement="top">
      <CaptionButton className={btnClassName}>
        <Icon className={btnIconClassName} />
      </CaptionButton>
    </DefaultTooltip>
  );
}

export function PIP() {
  const isPiP = useMediaState('pictureInPicture'),
    tooltipText = isPiP ? 'Exit PiP' : 'Enter PiP',
    Icon = isPiP ? PictureInPictureExitIcon : PictureInPictureIcon;
  return (
    <DefaultTooltip tooltip={tooltipText} placement="top">
      <PIPButton className={btnClassName}>
        <Icon className={btnIconClassName} />
      </PIPButton>
    </DefaultTooltip>
  );
}

export function Fullscreen() {
  const isFullscreen = useMediaState('fullscreen'),
    tooltipText = isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen',
    Icon = isFullscreen ? FullscreenExitIcon : FullscreenIcon;
  return (
    <DefaultTooltip tooltip={tooltipText} placement="top end">
      <FullscreenButton className={btnClassName}>
        <Icon className={btnIconClassName} />
      </FullscreenButton>
    </DefaultTooltip>
  );
}

export function DefaultTooltip({
  tooltip,
  placement,
  children,
}: {
  tooltip: string;
  placement: TooltipPlacement;
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content
        className={clsx(
          'text-white bg-black/80 backdrop-blur-sm border-white/10 rounded-sm px-2 py-0.5 z-10',
          // Enter Animation
          'data-[showing]:animate-in data-[showing]:fade-in data-[showing]:slide-out-to-top-4',
          // Exit Animation
          'animate-out fade-out slide-out-to-top-2',
        )}
        placement={placement}
      >
        {tooltip}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
