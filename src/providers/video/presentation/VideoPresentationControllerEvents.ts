import { VdsCustomEvent } from '../../../shared/events';
import { WebKitPresentationMode } from '../../../shared/types';

export interface VideoPresentationControllerEvents {
  'presentation-mode-change': VdsCustomEvent<WebKitPresentationMode>;
}
