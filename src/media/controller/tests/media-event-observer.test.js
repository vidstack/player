import { expect, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import { VdsEvent } from '../../../foundation/events/index.js';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from '../MediaControllerElement.js';
import { MediaEventObserver } from '../MediaEventObserver.js';

window.customElements.define(
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
);

describe(MediaEventObserver.name, function () {
  it('should observe events', async function () {
    class ObserverElement extends LitElement {
      mediaEventObserver = new MediaEventObserver(this, {
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
    }

    window.customElements.define('vds-media-observer', ObserverElement);

    const controller = document.createElement(
      MEDIA_CONTROLLER_ELEMENT_TAG_NAME
    );

    const observer = /** @type {ObserverElement} */ (
      document.createElement('vds-media-observer')
    );

    window.document.body.append(observer);

    setTimeout(() => {
      observer.append(controller);
    }, 0);

    await oneEvent(observer, 'vds-media-controller-connect');

    const playEvent = new VdsEvent('vds-play');
    const timeUpdateEvent = new VdsEvent('vds-time-update', { detail: 10 });

    controller.dispatchEvent(playEvent);
    controller.dispatchEvent(timeUpdateEvent);

    expect(observer.events).to.have.length(2);
    expect(observer.events[0]).to.eql([observer, playEvent]);
    expect(observer.events[1]).to.eql([observer, timeUpdateEvent]);
  });
});
