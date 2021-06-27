import { LitElement } from 'lit';

import { VdsCustomEvent } from '../../../shared/events/index.js';
import { WebKitPresentationMode } from '../../../shared/types/media.js';

export interface VideoPresentationControllerHost extends LitElement {
  readonly videoElement: HTMLVideoElement | undefined;
}

export interface VideoPresentationControllerEvents {
  'presentation-mode-change': VdsCustomEvent<WebKitPresentationMode>;
}
