import { vdsEvent } from '@vidstack/foundation';

import { MediaProviderElement } from '../provider';
import { createTimeRanges } from '../time-ranges';

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

    Object.keys(this._store).forEach((key) => {
      Object.defineProperty(this, `emulate-${key.toLowerCase()}`, {
        set(value) {
          this._connectedQueue.queue(`emulate-${key}`, () => {
            this._store[key].set(value);

            if (key === 'canPlay') {
              if (value) {
                this.mediaQueue.start();
              } else {
                this.mediaQueue.stop();
              }
            }
          });
        },
      });
    });
  }

  override connectedCallback() {
    super.connectedCallback();

    if (this.state.canPlay) {
      // Set false so `_handleMediaReady` return early.
      this.forceMediaReady();
    }
  }

  // -------------------------------------------------------------------------------------------
  // Provider Methods
  // -------------------------------------------------------------------------------------------

  async forceMediaReady() {
    return this._handleMediaReady({ duration: 0 });
  }

  protected _getPaused() {
    return this.state.paused;
  }

  protected _getCurrentTime() {
    return this.state.currentTime;
  }

  protected _setCurrentTime(time: number) {
    this.dispatchEvent(vdsEvent('vds-seeking', { detail: time }));
    this.dispatchEvent(
      vdsEvent('vds-time-update', {
        detail: {
          currentTime: time,
          played: createTimeRanges(0, time),
        },
      }),
    );
    this.dispatchEvent(vdsEvent('vds-seeked', { detail: time }));
  }

  protected _getMuted() {
    return this.state.muted;
  }

  protected _setMuted(muted: boolean) {
    this.dispatchEvent(
      vdsEvent('vds-volume-change', {
        detail: {
          volume: this.state.volume,
          muted,
        },
      }),
    );
  }

  protected _getVolume() {
    return this.state.volume;
  }

  protected _setVolume(volume: number) {
    this.dispatchEvent(
      vdsEvent('vds-volume-change', {
        detail: {
          volume,
          muted: this.state.muted,
        },
      }),
    );
  }

  handleDefaultSlotChange() {
    // no-op
  }

  // -------------------------------------------------------------------------------------------
  // Playback
  // -------------------------------------------------------------------------------------------

  async play() {
    this.dispatchEvent(vdsEvent('vds-play'));
  }

  async pause() {
    this.dispatchEvent(vdsEvent('vds-pause'));
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  override async enterFullscreen() {
    await super.enterFullscreen();
    this.dispatchEvent(vdsEvent('vds-fullscreen-change', { detail: true }));
  }

  override async exitFullscreen() {
    await super.exitFullscreen();
    this.dispatchEvent(vdsEvent('vds-fullscreen-change', { detail: false }));
  }
}
