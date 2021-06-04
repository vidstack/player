import { VdsCustomEvent } from '../../../shared/events';
import { WebKitPresentationMode } from '../../../ts/media';

export interface VideoPresentationControllerEvents {
	'presentation-mode-change': VdsCustomEvent<WebKitPresentationMode>;
}
