import { VdsCustomEvent } from '../../../shared/events';
import { WebKitPresentationMode } from '../../../types/media';

export interface VideoPresentationControllerEvents {
	'presentation-mode-change': VdsCustomEvent<WebKitPresentationMode>;
}
