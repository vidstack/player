import { LitElement } from 'lit';

import { VdsCustomEvent } from '../../../foundation/events/index.js';
import { WebKitPresentationMode } from '../../../foundation/types/media.js';

export interface VideoPresentationControllerHost extends LitElement {
  readonly videoElement: HTMLVideoElement | undefined;
}

export interface VideoPresentationControllerEvents {
  'presentation-mode-change': VdsCustomEvent<WebKitPresentationMode>;
}
