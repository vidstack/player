import type { DefaultLayoutIcons } from '@vidstack/react/player/layouts/default';

const customIcons: DefaultLayoutIcons = {
  PlayButton: {
    Play: PlayIcon,
    Pause: PauseIcon,
    Replay: ReplayIcon,
  },
  MuteButton: {
    Mute: MuteIcon,
    VolumeLow: VolumeLowIcon,
    VolumeHigh: VolumeHighIcon,
  },
  CaptionButton: {
    On: CaptionOnIcon,
    Off: CaptionOffIcon,
  },
  PIPButton: {
    Enter: EnterPIPIcon,
    Exit: ExitPIPIcon,
  },
  FullscreenButton: {
    Enter: EnterFullscreenIcon,
    Exit: ExitFullscreenIcon,
  },
  SeekButton: {
    Backward: SeekBackwardIcon,
    Forward: SeekForwardIcon,
  },
  Menu: {
    ArrowLeft: MenuArrowLeftIcon,
    ArrowRight: MenuArrowRightIcon,
    Audio: MenuAudioIcon,
    Chapters: MenuChaptersIcon,
    Quality: MenuQualityIcon,
    Captions: MenuCaptionsIcon,
    Settings: MenuSetingsIcon,
    Speed: MenuSpeedIcon,
  },
};
