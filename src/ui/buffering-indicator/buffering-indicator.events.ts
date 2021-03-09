import { buildVdsEvent } from '../../shared/events';

export class ShowBufferingIndicatorEvent extends buildVdsEvent<void>(
  'show-buffering-indicator',
) {}

export class HideBufferingIndicatorEvent extends buildVdsEvent<void>(
  'hide-buffering-indicator',
) {}
