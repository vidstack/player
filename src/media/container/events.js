import { VdsCustomEvent } from '../../foundation/events/index.js';

export class MediaContainerEvent extends VdsCustomEvent {}

export class MediaContainerConnectEvent extends MediaContainerEvent {
  static TYPE = 'vds-media-container-connect';
  constructor(eventInit) {
    super(MediaContainerConnectEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}
