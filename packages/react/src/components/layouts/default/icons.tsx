import * as React from 'react';

import accessibilityIconPaths from 'media-icons/dist/icons/accessibility.js';
import airPlayIconPaths from 'media-icons/dist/icons/airplay.js';
import arrowDownIconPaths from 'media-icons/dist/icons/arrow-down.js';
import arrowLeftIconPaths from 'media-icons/dist/icons/arrow-left.js';
import arrowUpIconPaths from 'media-icons/dist/icons/arrow-up.js';
import chaptersIconPaths from 'media-icons/dist/icons/chapters.js';
import checkIconPaths from 'media-icons/dist/icons/check.js';
import arrowRightIconPaths from 'media-icons/dist/icons/chevron-right.js';
import googleCastIconPaths from 'media-icons/dist/icons/chromecast.js';
import ccOnIconPaths from 'media-icons/dist/icons/closed-captions-on.js';
import ccIconPaths from 'media-icons/dist/icons/closed-captions.js';
import downloadIconPaths from 'media-icons/dist/icons/download.js';
import eyeIconPaths from 'media-icons/dist/icons/eye.js';
import fastBackwardIconPaths from 'media-icons/dist/icons/fast-backward.js';
import fastForwardIconPaths from 'media-icons/dist/icons/fast-forward.js';
import exitFullscreenIconPaths from 'media-icons/dist/icons/fullscreen-exit.js';
import enterFullscreenIconPaths from 'media-icons/dist/icons/fullscreen.js';
import musicIconPaths from 'media-icons/dist/icons/music.js';
import muteIconPaths from 'media-icons/dist/icons/mute.js';
import noEyeIconPaths from 'media-icons/dist/icons/no-eye.js';
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
    Accessibility: createIcon(accessibilityIconPaths),
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
    FontSizeUp: createIcon(arrowUpIconPaths),
    FontSizeDown: createIcon(arrowDownIconPaths),
    OpacityUp: createIcon(eyeIconPaths),
    OpacityDown: createIcon(noEyeIconPaths),
    RadioCheck: createIcon(checkIconPaths),
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
  KeyboardDisplay?: Partial<DefaultKeyboardDisplayIcons>;
}
