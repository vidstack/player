import * as React from 'react';

import airPlayIconPaths from 'media-icons/dist/icons/airplay.js';
import arrowDownIconPaths from 'media-icons/dist/icons/arrow-down.js';
import arrowLeftIconPaths from 'media-icons/dist/icons/arrow-left.js';
import arrowUpIconPaths from 'media-icons/dist/icons/arrow-up.js';
import chaptersIconPaths from 'media-icons/dist/icons/chapters.js';
import arrowRightIconPaths from 'media-icons/dist/icons/chevron-right.js';
import googleCastIconPaths from 'media-icons/dist/icons/chromecast.js';
import ccOnIconPaths from 'media-icons/dist/icons/closed-captions-on.js';
import ccIconPaths from 'media-icons/dist/icons/closed-captions.js';
import downloadIconPaths from 'media-icons/dist/icons/download.js';
import fastBackwardIconPaths from 'media-icons/dist/icons/fast-backward.js';
import fastForwardIconPaths from 'media-icons/dist/icons/fast-forward.js';
import exitFullscreenIconPaths from 'media-icons/dist/icons/fullscreen-exit.js';
import enterFullscreenIconPaths from 'media-icons/dist/icons/fullscreen.js';
import musicIconPaths from 'media-icons/dist/icons/music.js';
import muteIconPaths from 'media-icons/dist/icons/mute.js';
import pauseIconPaths from 'media-icons/dist/icons/pause.js';
import exitPIPIconPaths from 'media-icons/dist/icons/picture-in-picture-exit.js';
import enterPIPIconPaths from 'media-icons/dist/icons/picture-in-picture.js';
import playIconPaths from 'media-icons/dist/icons/play.js';
import playbackIconPaths from 'media-icons/dist/icons/playback-speed-circle.js';
import replayIconPaths from 'media-icons/dist/icons/replay.js';
import seekBackwardIconPaths from 'media-icons/dist/icons/seek-backward-10.js';
import seekForwardIconPaths from 'media-icons/dist/icons/seek-forward-10.js';
import settingsIconPaths from 'media-icons/dist/icons/settings.js';
import volumeHighIconPaths from 'media-icons/dist/icons/volume-high.js';
import volumeLowIconPaths from 'media-icons/dist/icons/volume-low.js';

import { Icon } from '../../../icon';

function createIcon(paths: string) {
  function DefaultLayoutIcon(props: DefaultLayoutIconProps) {
    return <Icon paths={paths} {...props} />;
  }

  DefaultLayoutIcon.displayName = 'DefaultLayoutIcon';
  return DefaultLayoutIcon;
}

export const defaultLayoutIcons: DefaultLayoutIcons = {
  AirPlayButton: {
    Default: createIcon(airPlayIconPaths),
  },
  GoogleCastButton: {
    Default: createIcon(googleCastIconPaths),
  },
  PlayButton: {
    Play: createIcon(playIconPaths),
    Pause: createIcon(pauseIconPaths),
    Replay: createIcon(replayIconPaths),
  },
  MuteButton: {
    Mute: createIcon(muteIconPaths),
    VolumeLow: createIcon(volumeLowIconPaths),
    VolumeHigh: createIcon(volumeHighIconPaths),
  },
  CaptionButton: {
    On: createIcon(ccOnIconPaths),
    Off: createIcon(ccIconPaths),
  },
  PIPButton: {
    Enter: createIcon(enterPIPIconPaths),
    Exit: createIcon(exitPIPIconPaths),
  },
  FullscreenButton: {
    Enter: createIcon(enterFullscreenIconPaths),
    Exit: createIcon(exitFullscreenIconPaths),
  },
  SeekButton: {
    Backward: createIcon(seekBackwardIconPaths),
    Forward: createIcon(seekForwardIconPaths),
  },
  DownloadButton: {
    Default: createIcon(downloadIconPaths),
  },
  Menu: {
    Accessibility: createIcon(
      `<path d="M16 8c-.733 0-1.36-.261-1.883-.783a2.573 2.573 0 0 1-.784-1.884c0-.733.262-1.36.784-1.883A2.575 2.575 0 0 1 16 2.667a2.57 2.57 0 0 1 1.884.784c.523.523.784 1.15.783 1.883 0 .733-.261 1.361-.783 1.884A2.561 2.561 0 0 1 16 8Zm-4 20V12H5.333c-.377 0-.694-.128-.949-.384a1.296 1.296 0 0 1-.384-.95c0-.377.128-.694.384-.949s.572-.383.95-.384h21.333c.377 0 .694.128.95.384s.384.573.383.95c0 .377-.128.694-.384.95a1.285 1.285 0 0 1-.95.383H20v16c0 .378-.128.695-.384.95a1.285 1.285 0 0 1-.95.383c-.377 0-.694-.128-.949-.384a1.297 1.297 0 0 1-.384-.95v-6.666h-2.666V28c0 .378-.128.695-.384.95a1.285 1.285 0 0 1-.95.383c-.377 0-.694-.128-.949-.384A1.297 1.297 0 0 1 12 28Z" fill="currentColor"/>`,
    ),
    ArrowLeft: createIcon(arrowLeftIconPaths),
    ArrowRight: createIcon(arrowRightIconPaths),
    Audio: createIcon(musicIconPaths),
    Chapters: createIcon(chaptersIconPaths),
    Captions: createIcon(ccIconPaths),
    Playback: createIcon(playbackIconPaths),
    Settings: createIcon(settingsIconPaths),
    AudioBoostUp: createIcon(volumeHighIconPaths),
    AudioBoostDown: createIcon(volumeLowIconPaths),
    SpeedUp: createIcon(fastForwardIconPaths),
    SpeedDown: createIcon(fastBackwardIconPaths),
    QualityUp: createIcon(arrowUpIconPaths),
    QualityDown: createIcon(arrowDownIconPaths),
    FontSizeUp: createIcon(
      `<path d="M6.82634 18.6666L9.99967 10.2266L13.1597 18.6666M8.66634 6.66663L1.33301 25.3333H4.33301L5.82634 21.3333H14.1597L15.6663 25.3333H18.6663L11.333 6.66663H8.66634ZM23.9997 9.33329L17.333 16.0933L19.213 18L22.6663 14.5333V22.6666H25.333V14.5333L28.7863 18L30.6663 16.0933L23.9997 9.33329Z" fill="currentColor"/>`,
    ),
    FontSizeDown: createIcon(
      `<path d="M6.82634 18.6666L9.99967 10.2266L13.1597 18.6666M8.66634 6.66663L1.33301 25.3333H4.33301L5.82634 21.3333H14.1597L15.6663 25.3333H18.6663L11.333 6.66663H8.66634ZM23.9997 22.6666L30.6663 15.9066L28.7863 14L25.333 17.4666V9.33329H22.6663V17.4666L19.213 14L17.333 15.9066L23.9997 22.6666Z" fill="currentColor"/>`,
    ),
    OpacityUp: createIcon(
      `<path d="M12.3752 16C12.3752 16.9283 12.7439 17.8185 13.4003 18.4749C14.0567 19.1313 14.9469 19.5 15.8752 19.5C16.8034 19.5 17.6937 19.1313 18.3501 18.4749C19.0064 17.8185 19.3752 16.9283 19.3752 16C19.3752 15.0717 19.0064 14.1815 18.3501 13.5251C17.6937 12.8687 16.8034 12.5 15.8752 12.5C14.9469 12.5 14.0567 12.8687 13.4003 13.5251C12.7439 14.1815 12.3752 15.0717 12.3752 16ZM29.4439 15.1938C26.4814 8.95313 22.0033 5.8125 16.0002 5.8125C9.99393 5.8125 5.51893 8.95312 2.55643 15.1969C2.4376 15.4485 2.37598 15.7233 2.37598 16.0016C2.37598 16.2798 2.4376 16.5546 2.55643 16.8062C5.51893 23.0469 9.99706 26.1875 16.0002 26.1875C22.0064 26.1875 26.4814 23.0469 29.4439 16.8031C29.6846 16.2969 29.6846 15.7094 29.4439 15.1938ZM15.8752 21.5C12.8377 21.5 10.3752 19.0375 10.3752 16C10.3752 12.9625 12.8377 10.5 15.8752 10.5C18.9127 10.5 21.3752 12.9625 21.3752 16C21.3752 19.0375 18.9127 21.5 15.8752 21.5Z" fill="currentColor"/>`,
    ),
    OpacityDown: createIcon(
      `<path d="M15.8752 19.5C16.8034 19.5 17.6937 19.1313 18.3501 18.4749C19.0064 17.8185 19.3752 16.9283 19.3752 16C19.3752 15.8975 19.3705 15.7959 19.3617 15.6956L15.5708 19.4866C15.6711 19.4953 15.7724 19.5 15.8752 19.5ZM27.4602 5.17376L26.1252 3.84001C26.0783 3.79316 26.0147 3.76685 25.9485 3.76685C25.8822 3.76685 25.8186 3.79316 25.7717 3.84001L22.3555 7.2572C20.4709 6.29407 18.3525 5.81251 16.0002 5.81251C9.99393 5.81251 5.51268 8.94064 2.55643 15.1969C2.4376 15.4485 2.37598 15.7233 2.37598 16.0016C2.37598 16.2798 2.4376 16.5546 2.55643 16.8063C3.73768 19.2944 5.16008 21.2887 6.82362 22.7891L3.51768 26.0938C3.47083 26.1406 3.44451 26.2042 3.44451 26.2705C3.44451 26.3368 3.47083 26.4003 3.51768 26.4472L4.85174 27.7813C4.89862 27.8281 4.96219 27.8544 5.02846 27.8544C5.09474 27.8544 5.1583 27.8281 5.20518 27.7813L27.4602 5.52751C27.4834 5.50429 27.5019 5.47672 27.5144 5.44637C27.527 5.41602 27.5335 5.38349 27.5335 5.35064C27.5335 5.31778 27.527 5.28525 27.5144 5.2549C27.5019 5.22455 27.4834 5.19698 27.4602 5.17376ZM10.3752 16C10.3751 15.05 10.6211 14.1162 11.0891 13.2896C11.5572 12.4629 12.2314 11.7716 13.0461 11.2829C13.8608 10.7943 14.7881 10.525 15.7378 10.5012C16.6875 10.4775 17.6271 10.7002 18.4652 11.1475L16.9458 12.6669C16.3331 12.4707 15.6781 12.4471 15.0528 12.5986C14.4275 12.7501 13.856 13.071 13.4011 13.5259C12.9461 13.9809 12.6253 14.5523 12.4738 15.1776C12.3222 15.8029 12.3459 16.4579 12.5421 17.0706L11.0227 18.59C10.5963 17.7934 10.3739 16.9036 10.3752 16Z" fill="currentColor"/><path d="M29.4441 15.1938C28.3441 12.8771 27.0348 10.9881 25.5163 9.52661L21.0119 14.0313C21.3916 15.0238 21.4757 16.1051 21.2542 17.1444C21.0327 18.1838 20.5149 19.1367 19.7634 19.8882C19.012 20.6396 18.0591 21.1574 17.0197 21.3789C15.9804 21.6005 14.8991 21.5163 13.9066 21.1366L10.0859 24.9572C11.8584 25.7774 13.8299 26.1875 16.0003 26.1875C22.0066 26.1875 26.4878 23.0594 29.4441 16.8032C29.5629 16.5516 29.6245 16.2768 29.6245 15.9985C29.6245 15.7202 29.5629 15.4454 29.4441 15.1938Z" fill="currentColor"/>`,
    ),
    RadioCheck: createIcon(
      `<path d="M26.8838 8.98969L25.0856 7.12371C25.0141 7.04124 24.9018 7 24.7996 7C24.6872 7 24.585 7.04124 24.5135 7.12371L12.0494 19.7938L7.51326 15.2165C7.43153 15.134 7.32936 15.0928 7.2272 15.0928C7.12503 15.0928 7.02287 15.134 6.94113 15.2165L5.1226 17.0515C4.95913 17.2165 4.95913 17.4742 5.1226 17.6392L10.8438 23.4124C11.2116 23.7835 11.6612 24 12.0392 24C12.5806 24 13.0506 23.5979 13.2243 23.433H13.2345L26.894 9.57732C27.037 9.40206 27.037 9.14433 26.8838 8.98969Z" fill="currentColor"/>`,
    ),
  },
  KeyboardDisplay: {
    Play: createIcon(playIconPaths),
    Pause: createIcon(pauseIconPaths),
    Mute: createIcon(muteIconPaths),
    VolumeUp: createIcon(volumeHighIconPaths),
    VolumeDown: createIcon(volumeLowIconPaths),
    EnterFullscreen: createIcon(enterFullscreenIconPaths),
    ExitFullscreen: createIcon(exitFullscreenIconPaths),
    EnterPiP: createIcon(enterPIPIconPaths),
    ExitPiP: createIcon(exitPIPIconPaths),
    CaptionsOn: createIcon(ccOnIconPaths),
    CaptionsOff: createIcon(ccIconPaths),
    SeekForward: createIcon(fastForwardIconPaths),
    SeekBackward: createIcon(fastBackwardIconPaths),
  },
};

export interface DefaultLayoutIconProps
  extends React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> {}

export interface DefaultLayoutIcon {
  (props: DefaultLayoutIconProps): React.ReactNode;
}

export interface DefaultAirPlayButtonIcons {
  Default: DefaultLayoutIcon;
  Connecting?: DefaultLayoutIcon;
  Connected?: DefaultLayoutIcon;
}

export interface DefaultGoogleCastButtonIcons {
  Default: DefaultLayoutIcon;
  Connecting?: DefaultLayoutIcon;
  Connected?: DefaultLayoutIcon;
}

export interface DefaultPlayButtonIcons {
  Play: DefaultLayoutIcon;
  Pause: DefaultLayoutIcon;
  Replay: DefaultLayoutIcon;
}

export interface DefaultMuteButtonIcons {
  Mute: DefaultLayoutIcon;
  VolumeLow: DefaultLayoutIcon;
  VolumeHigh: DefaultLayoutIcon;
}

export interface DefaultCaptionButtonIcons {
  On: DefaultLayoutIcon;
  Off: DefaultLayoutIcon;
}

export interface DefaultPIPButtonIcons {
  Enter: DefaultLayoutIcon;
  Exit: DefaultLayoutIcon;
}

export interface DefaultFullscreenButtonIcons {
  Enter: DefaultLayoutIcon;
  Exit: DefaultLayoutIcon;
}

export interface DefaultSeekButtonIcons {
  Backward: DefaultLayoutIcon;
  Forward: DefaultLayoutIcon;
}

export interface DefaultDownloadButtonIcons {
  Default: DefaultLayoutIcon;
}

export interface DefaultMenuIcons {
  Accessibility: DefaultLayoutIcon;
  ArrowLeft: DefaultLayoutIcon;
  ArrowRight: DefaultLayoutIcon;
  Audio: DefaultLayoutIcon;
  AudioBoostUp: DefaultLayoutIcon;
  AudioBoostDown: DefaultLayoutIcon;
  Chapters: DefaultLayoutIcon;
  Captions: DefaultLayoutIcon;
  Playback: DefaultLayoutIcon;
  Settings: DefaultLayoutIcon;
  SpeedUp: DefaultLayoutIcon;
  SpeedDown: DefaultLayoutIcon;
  QualityUp: DefaultLayoutIcon;
  QualityDown: DefaultLayoutIcon;
  FontSizeUp: DefaultLayoutIcon;
  FontSizeDown: DefaultLayoutIcon;
  OpacityUp: DefaultLayoutIcon;
  OpacityDown: DefaultLayoutIcon;
  RadioCheck: DefaultLayoutIcon;
}

export interface DefaultKeyboardDisplayIcons {
  Play: DefaultLayoutIcon;
  Pause: DefaultLayoutIcon;
  Mute: DefaultLayoutIcon;
  VolumeUp: DefaultLayoutIcon;
  VolumeDown: DefaultLayoutIcon;
  EnterFullscreen: DefaultLayoutIcon;
  ExitFullscreen: DefaultLayoutIcon;
  EnterPiP: DefaultLayoutIcon;
  ExitPiP: DefaultLayoutIcon;
  CaptionsOn: DefaultLayoutIcon;
  CaptionsOff: DefaultLayoutIcon;
  SeekForward: DefaultLayoutIcon;
  SeekBackward: DefaultLayoutIcon;
}

export interface DefaultLayoutIcons {
  AirPlayButton: DefaultAirPlayButtonIcons;
  GoogleCastButton: DefaultGoogleCastButtonIcons;
  PlayButton: DefaultPlayButtonIcons;
  MuteButton: DefaultMuteButtonIcons;
  CaptionButton: DefaultCaptionButtonIcons;
  PIPButton: DefaultPIPButtonIcons;
  FullscreenButton: DefaultFullscreenButtonIcons;
  SeekButton: DefaultSeekButtonIcons;
  DownloadButton?: DefaultDownloadButtonIcons;
  Menu: DefaultMenuIcons;
  KeyboardDisplay?: DefaultKeyboardDisplayIcons;
}
