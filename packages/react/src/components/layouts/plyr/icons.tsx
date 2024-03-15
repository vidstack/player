import * as React from 'react';

import { Icon } from '../../../icon';
import airplay from './icons/plyr-airplay';
import captionsOff from './icons/plyr-captions-off';
import captionsOn from './icons/plyr-captions-on';
import download from './icons/plyr-download';
import exitFullscreen from './icons/plyr-enter-fullscreen';
import enterFullscreen from './icons/plyr-exit-fullscreen';
import fastForward from './icons/plyr-fast-forward';
import muted from './icons/plyr-muted';
import pause from './icons/plyr-pause';
import pip from './icons/plyr-pip';
import play from './icons/plyr-play';
import restart from './icons/plyr-restart';
import rewind from './icons/plyr-rewind';
import settings from './icons/plyr-settings';
import volume from './icons/plyr-volume';

function createIcon(paths: string) {
  function PlyrLayoutIcon(props: PlyrLayoutIconProps) {
    return <Icon viewBox="0 0 18 18" paths={paths} {...props} />;
  }

  PlyrLayoutIcon.displayName = 'PlyrLayoutIcon';
  return PlyrLayoutIcon;
}

export const plyrLayoutIcons: PlyrLayoutIcons = {
  AirPlay: createIcon(airplay),
  CaptionsOff: createIcon(captionsOff),
  CaptionsOn: createIcon(captionsOn),
  Download: createIcon(download),
  EnterFullscreen: createIcon(enterFullscreen),
  EnterPiP: createIcon(pip),
  ExitFullscreen: createIcon(exitFullscreen),
  ExitPiP: createIcon(pip),
  FastForward: createIcon(fastForward),
  Muted: createIcon(muted),
  Pause: createIcon(pause),
  Play: createIcon(play),
  Restart: createIcon(restart),
  Rewind: createIcon(rewind),
  Settings: createIcon(settings),
  Volume: createIcon(volume),
};

export interface PlyrLayoutIconProps extends React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> {}

export interface PlyrLayoutIcon {
  (props: PlyrLayoutIconProps): React.ReactNode;
}

export interface PlyrLayoutIcons {
  AirPlay: PlyrLayoutIcon;
  CaptionsOff: PlyrLayoutIcon;
  CaptionsOn: PlyrLayoutIcon;
  Download: PlyrLayoutIcon;
  EnterFullscreen: PlyrLayoutIcon;
  EnterPiP: PlyrLayoutIcon;
  ExitFullscreen: PlyrLayoutIcon;
  ExitPiP: PlyrLayoutIcon;
  FastForward: PlyrLayoutIcon;
  Muted: PlyrLayoutIcon;
  Pause: PlyrLayoutIcon;
  Play: PlyrLayoutIcon;
  Restart: PlyrLayoutIcon;
  Rewind: PlyrLayoutIcon;
  Settings: PlyrLayoutIcon;
  Volume: PlyrLayoutIcon;
}
