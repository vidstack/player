import * as React from 'react';
import type { PropsWithoutRef, SVGProps } from 'react';
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
import seekBackwardIconPaths from 'media-icons/dist/icons/seek-backward-10.js';
import seekForwardIconPaths from 'media-icons/dist/icons/seek-forward-10.js';
import qualityIconPaths from 'media-icons/dist/icons/settings-menu.js';
import settingsIconPaths from 'media-icons/dist/icons/settings.js';
import volumeHighIconPaths from 'media-icons/dist/icons/volume-high.js';
import volumeLowIconPaths from 'media-icons/dist/icons/volume-low.js';
import { Icon } from '../../../icon';

function createIcon(paths: string) {
  function DefaultIcon(props: DefaultIconProps) {
    return <Icon paths={paths} {...props} />;
  }

  DefaultIcon.displayName = 'DefaultIcon';
  return DefaultIcon;
}

export const defaultIcons: DefaultIcons = {
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
  Menu: {
    ArrowLeft: createIcon(arrowLeftPaths),
    ArrowRight: createIcon(arrowRightPaths),
    Audio: createIcon(musicIconPaths),
    Chapters: createIcon(chaptersIconPaths),
    Quality: createIcon(qualityIconPaths),
    Captions: createIcon(ccIconPaths),
    Settings: createIcon(settingsIconPaths),
    Speed: createIcon(odometerIconPaths),
  },
};

export interface DefaultIconProps extends PropsWithoutRef<SVGProps<SVGSVGElement>> {}

export interface DefaultIcon {
  (props: DefaultIconProps): React.ReactNode;
}

export interface DefaultIcons {
  PlayButton: {
    Play: DefaultIcon;
    Pause: DefaultIcon;
    Replay: DefaultIcon;
  };
  MuteButton: {
    Mute: DefaultIcon;
    VolumeLow: DefaultIcon;
    VolumeHigh: DefaultIcon;
  };
  CaptionButton: {
    On: DefaultIcon;
    Off: DefaultIcon;
  };
  PIPButton: {
    Enter: DefaultIcon;
    Exit: DefaultIcon;
  };
  FullscreenButton: {
    Enter: DefaultIcon;
    Exit: DefaultIcon;
  };
  SeekButton: {
    Backward: DefaultIcon;
    Forward: DefaultIcon;
  };
  Menu: {
    ArrowLeft: DefaultIcon;
    ArrowRight: DefaultIcon;
    Audio: DefaultIcon;
    Chapters: DefaultIcon;
    Quality: DefaultIcon;
    Captions: DefaultIcon;
    Settings: DefaultIcon;
    Speed: DefaultIcon;
  };
}
