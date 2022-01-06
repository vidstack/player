import { expect, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import { VdsEvent } from '../../../base/events';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from '../../controller/MediaControllerElement';
import { PlayEvent, TimeUpdateEvent } from '../../events';
import { hostedMediaEventListener } from '../hostedMediaEventListener';

class MediaListenerElement extends LitElement {
  events: [any, Event][] = [];

  handlePlay = hostedMediaEventListener(
    this,
    'vds-play',
    (event: PlayEvent) => {
      this.events.push([this, event]);
    }
  );

  handleTimeUpdate = hostedMediaEventListener(
    this,
    'vds-time-update',
    (event: TimeUpdateEvent) => {
      this.events.push([this, event]);
    }
  );
}

window.customElements.define(
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
);

window.customElements.define('vds-media-listener', MediaListenerElement);

describe(hostedMediaEventListener.name, function () {
  test('it should listen to media events', async function () {
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

    controller.dispatchEvent(playEvent);
    controller.dispatchEvent(timeUpdateEvent);

    expect(listener.events).to.have.length(3);
    expect(listener.events[0]).to.eql([listener, playEvent]);
    expect(listener.events[1]).to.eql([listener, timeUpdateEvent]);
  });
});
