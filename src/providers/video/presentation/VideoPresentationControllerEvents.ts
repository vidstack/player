import { VdsCustomEvent } from '../../../shared/events';
import { WebKitPresentationMode } from '../../../shared/types.global';

export interface VideoPresentationControllerEvents {
  'presentation-mode-change': VdsCustomEvent<WebKitPresentationMode>;
}
