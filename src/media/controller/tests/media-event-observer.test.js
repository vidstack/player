import { expect, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import { PlayEvent, TimeUpdateEvent } from '../../events.js';
import { MediaControllerConnectEvent } from '../index.js';
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
        [PlayEvent.TYPE]: this.handlePlay,
        [TimeUpdateEvent.TYPE]: this.handleTimeUpdate
      });

      /**
       * @type {[any, Event][]}
       */
      events = [];

      /**
       * @param {PlayEvent} event
       */
      handlePlay(event) {
        this.events.push([this, event]);
      }

      /**
       * @param {TimeUpdateEvent} event
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

    await oneEvent(observer, MediaControllerConnectEvent.TYPE);

    const playEvent = new PlayEvent();
    const timeUpdateEvent = new TimeUpdateEvent({ detail: 10 });

    controller.dispatchEvent(playEvent);
    controller.dispatchEvent(timeUpdateEvent);

    expect(observer.events).to.have.length(2);
    expect(observer.events[0]).to.eql([observer, playEvent]);
    expect(observer.events[1]).to.eql([observer, timeUpdateEvent]);
  });
});
