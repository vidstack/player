import { expect, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import { VdsEvent } from '../../../base/events';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from '../../controller/MediaControllerElement';
import { DurationChangeEvent, PlayEvent, TimeUpdateEvent } from '../../events';
import { MediaEventListener, mediaEventListener } from '../MediaEventListener';

class MediaListenerElement extends LitElement {
  mediaEventlistener = new MediaEventListener(this, {
    'vds-play': this.handlePlay,
    'vds-time-update': this.handleTimeUpdate
  });

  events: [any, Event][] = [];

  handlePlay(event: PlayEvent) {
    this.events.push([this, event]);
  }

  handleTimeUpdate(event: TimeUpdateEvent) {
    this.events.push([this, event]);
  }

  // WITH DECORATOR
  @mediaEventListener('vds-duration-change')
  handleDurationUpdate(event: DurationChangeEvent) {
    this.events.push([this, event]);
  }
}

window.customElements.define(
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
);

window.customElements.define('vds-media-listener', MediaListenerElement);

describe(MediaEventListener.name, function () {
  it('should listen to media events', async function () {
    const controller = document.createElement(
      MEDIA_CONTROLLER_ELEMENT_TAG_NAME
    );

    const listener = document.createElement(
      'vds-media-listener'
    ) as MediaListenerElement;

    window.document.body.append(listener);

    setTimeout(() => {
      listener.append(controller);
    }, 0);

    await oneEvent(listener, 'vds-media-controller-connect');

    const playEvent = new VdsEvent('vds-play');
    const timeUpdateEvent = new VdsEvent('vds-time-update', { detail: 10 });
    const durationChangeEvent = new VdsEvent('vds-duration-change', {
      detail: 10
    });

    controller.dispatchEvent(playEvent);
    controller.dispatchEvent(timeUpdateEvent);
    controller.dispatchEvent(durationChangeEvent);

    expect(listener.events).to.have.length(3);
    expect(listener.events[0]).to.eql([listener, playEvent]);
    expect(listener.events[1]).to.eql([listener, timeUpdateEvent]);
    expect(listener.events[2]).to.eql([listener, durationChangeEvent]);
  });
});
