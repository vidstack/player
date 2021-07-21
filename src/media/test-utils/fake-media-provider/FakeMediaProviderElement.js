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
    this._defineContextAccessors();
  }

  /**
   * Used to define accessors that are used during testing to update the context object.
   *
   * @protected
   */
  _defineContextAccessors() {
    Object.keys(mediaContext).forEach((ctxProp) => {
      Object.defineProperty(this, `${ctxProp}Context`, {
        get: () => {
          return this.ctx[ctxProp];
        },
        set: (newValue) => {
          // Only run context updates after we've connected to the DOM so we update the inject
          // media context object on the `MediaControllerElement`.
          this._connectedQueue.queue(`contextUpdate[${ctxProp}]`, () => {
            this.ctx[ctxProp] = newValue;
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
    this._handleMediaReady();
  }

  _getCurrentTime() {
    return this.ctx.currentTime;
  }

  _setCurrentTime(time) {
    this.ctx.currentTime = time;
    this.dispatchEvent(new TimeUpdateEvent({ detail: time }));
  }

  _getMuted() {
    return this.ctx.muted;
  }

  _setMuted(muted) {
    this.ctx.muted = muted;
    this.dispatchEvent(
      new VolumeChangeEvent({
        detail: {
          volume: this.ctx.volume,
          muted
        }
      })
    );
  }

  _getPaused() {
    return this.ctx.paused;
  }

  _getVolume() {
    return this.ctx.volume;
  }

  _setVolume(volume) {
    this.ctx.volume = volume;
    this.dispatchEvent(
      new VolumeChangeEvent({
        detail: {
          volume,
          muted: this.ctx.muted
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
    this.ctx.paused = false;
    this.dispatchEvent(new PlayEvent());
  }

  async pause() {
    this.ctx.paused = true;
    this.dispatchEvent(new PauseEvent());
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  async requestFullscreen() {
    this.ctx.fullscreen = true;
  }

  async exitFullscreen() {
    this.ctx.fullscreen = false;
  }
}
