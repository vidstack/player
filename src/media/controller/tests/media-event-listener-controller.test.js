import { VdsEvent } from '@base/events/index.js';
import { expect, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from '../MediaControllerElement.js';
import {
  mediaEventListener,
  MediaEventListenerController
} from '../MediaEventListenerController.js';

window.customElements.define(
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
);

describe(MediaEventListenerController.name, function () {
  it('should listen to media events', async function () {
    class MediaListenerElement extends LitElement {
      mediaEventlistener = new MediaEventListenerController(this, {
        'vds-play': this.handlePlay,
        'vds-time-update': this.handleTimeUpdate
      });

      /**
       * @type {[any, Event][]}
       */
      events = [];

      /**
       * @param {import('../../events').PlayEvent} event
       */
      handlePlay(event) {
        this.events.push([this, event]);
      }

      /**
       * @param {import('../../events').TimeUpdateEvent} event
       */
      handleTimeUpdate(event) {
        this.events.push([this, event]);
      }

      /**
       * @param {import('../../events').DurationChangeEvent} event
       */
      @mediaEventListener('vds-duration-change')
      handleDurationUpdate(event) {
        this.events.push([this, event]);
      }
    }

    window.customElements.define('vds-media-listener', MediaListenerElement);

    const controller = document.createElement(
      MEDIA_CONTROLLER_ELEMENT_TAG_NAME
    );

    const listener = /** @type {MediaListenerElement} */ (
      document.createElement('vds-media-listener')
    );

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
