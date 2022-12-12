import type { HTMLCustomElement } from 'maverick.js/element';

import type { FullscreenEvents } from '../../../foundation/fullscreen/events';
import type { LoggerEvents } from '../../../foundation/logger/events';
import type { ScreenOrientationEvents } from '../../../foundation/orientation/events';
import type { UserIdleChangeEvent } from '../events';
import type { MediaRequestEvents } from '../request-events';

export interface MediaControllerEventTarget extends HTMLCustomElement<any, MediaControllerEvents> {}

export interface MediaControllerEvents
  extends MediaRequestEvents,
    FullscreenEvents,
    ScreenOrientationEvents,
    LoggerEvents {
  'vds-user-idle-change': UserIdleChangeEvent;
}
