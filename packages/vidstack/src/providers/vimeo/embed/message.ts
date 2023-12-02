import type { VimeoCommand } from './command';
import type { VimeoEventPayload } from './event';

export interface VimeoMessage {
  data?: any;
  value?: any;
  method?: VimeoCommand;
  event?: keyof VimeoEventPayload;
}
