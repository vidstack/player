/* c8 ignore next 1000 */

import { mediaContext } from '../../context.js';
import {
  CanPlay,
  MediaProviderElement,
  PauseEvent,
  PlayEvent,
  TimeUpdateEvent,
  VolumeChangeEvent
} from '../../index.js';

export const FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME = 'vds-fake-media-provider';

/**
 * A fake media provider that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the provider in the desired state.
 */
export class FakeMediaProviderElement extends MediaProviderElement {
  constructor() {
    super();
    this.defineContextAccessors();
  }

  /**
   * Used to define accessors that are used during testing to update the context object.
   *
   * @protected
   */
  defineContextAccessors() {
    Object.keys(mediaContext).forEach((ctxProp) => {
      Object.defineProperty(this, `${ctxProp}Context`, {
        get: () => {
          return this.context[ctxProp];
        },
        set: (newValue) => {
          // Only run context updates after we've connected to the DOM so we update the inject
          // media context object on the `MediaControllerElement`.
          this.connectedQueue.queue(`contextUpdate[${ctxProp}]`, () => {
            this.context[ctxProp] = newValue;
          });
        }
      });
    });
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  connectedCallback() {
    super.connectedCallback();
    if (this.canPlay) this.forceMediaReady();
  }

  // -------------------------------------------------------------------------------------------
  // Provider Methods
  // -------------------------------------------------------------------------------------------

  forceMediaReady() {
    this.handleMediaReady();
  }

  getCurrentTime() {
    return this.context.currentTime;
  }

  setCurrentTime(time) {
    this.context.currentTime = time;
    this.dispatchEvent(new TimeUpdateEvent({ detail: time }));
  }

  getMuted() {
    return this.context.muted;
  }

  setMuted(muted) {
    this.context.muted = muted;
    this.dispatchEvent(
      new VolumeChangeEvent({
        detail: {
          volume: this.context.volume,
          muted
        }
      })
    );
  }

  getPaused() {
    return this.context.paused;
  }

  getVolume() {
    return this.context.volume;
  }

  setVolume(volume) {
    this.context.volume = volume;
    this.dispatchEvent(
      new VolumeChangeEvent({
        detail: {
          volume,
          muted: this.context.muted
        }
      })
    );
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get engine() {
    return undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Playback
  // -------------------------------------------------------------------------------------------

  canPlayType() {
    return CanPlay.No;
  }

  async play() {
    this.context.paused = false;
    this.dispatchEvent(new PlayEvent());
  }

  async pause() {
    this.context.paused = true;
    this.dispatchEvent(new PauseEvent());
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  async requestFullscreen() {
    this.context.fullscreen = true;
  }

  async exitFullscreen() {
    this.context.fullscreen = false;
  }
}
