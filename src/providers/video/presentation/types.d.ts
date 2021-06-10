import { LitElement } from 'lit';

import { VdsCustomEvent } from '../../../shared/events';
import { WebKitPresentationMode } from '../../../shared/types/media';

export interface VideoPresentationControllerHost extends LitElement {
	readonly videoElement: HTMLVideoElement | undefined;
}

export interface VideoPresentationControllerEvents {
	'presentation-mode-change': VdsCustomEvent<WebKitPresentationMode>;
}
