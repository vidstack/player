import { ViewController } from 'maverick.js';

import type { MediaPlayerCSSVars } from './player-cssvars';
import type { MediaPlayerEvents } from './player-events';
import type { MediaPlayerProps } from './player-props';
import type { MediaPlayerState } from './player-state';

export class MediaPlayerController extends ViewController<
  MediaPlayerProps,
  MediaPlayerState,
  MediaPlayerEvents,
  MediaPlayerCSSVars
> {}
