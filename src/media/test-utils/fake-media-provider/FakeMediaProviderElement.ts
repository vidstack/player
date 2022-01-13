import { html } from 'lit';

import { vdsEvent } from '../../../base/events';
import { CanPlay } from '../../CanPlay';
import { MediaProviderElement } from '../../provider/MediaProviderElement';

/**
 * A fake media provider that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the provider in the desired state.
 */
export class FakeMediaProviderElement extends MediaProviderElement {
  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  constructor() {
    super();

    Object.keys(this._mediaStore).forEach((key) => {
      Object.defineProperty(this, `emulate-${key.toLowerCase()}`, {
        set(value) {
          this._connectedQueue.queue(`emulate-${key}`, () => {
            this._mediaStore[key].set(value);

            if (key === 'canPlay') {
              if (value) {
                this.mediaRequestQueue.start();
              } else {
                this.mediaRequestQueue.stop();
              }
            }
          });
        }
      });
    });
  }

  override connectedCallback() {
    super.connectedCallback();

    if (this.canPlay) {
      // Set false so `_handleMediaReady` return early.
      this.forceMediaReady();
    }
  }

  override render() {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Provider Methods
  // -------------------------------------------------------------------------------------------

  async forceMediaReady() {
    return this._handleMediaReady({ duration: 0 });
  }

  _setCurrentTime(time: number) {
    this.dispatchEvent(vdsEvent('vds-seeking', { detail: time }));
    this.dispatchEvent(vdsEvent('vds-time-update', { detail: time }));
    this.dispatchEvent(vdsEvent('vds-seeked', { detail: time }));
  }

  _setMuted(muted: boolean) {
    this.dispatchEvent(
      vdsEvent('vds-volume-change', {
        detail: {
          volume: this.volume,
          muted
        }
      })
    );
  }

  _setVolume(volume: number) {
    this.dispatchEvent(
      vdsEvent('vds-volume-change', {
        detail: {
          volume,
          muted: this.muted
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
    this.dispatchEvent(vdsEvent('vds-play'));
  }

  async pause() {
    this.dispatchEvent(vdsEvent('vds-pause'));
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  override async requestFullscreen() {
    await super.requestFullscreen();
    this.dispatchEvent(vdsEvent('vds-fullscreen-change', { detail: true }));
  }

  override async exitFullscreen() {
    await super.exitFullscreen();
    this.dispatchEvent(vdsEvent('vds-fullscreen-change', { detail: false }));
  }
}
