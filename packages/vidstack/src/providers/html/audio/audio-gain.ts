import type { AudioGainAdapter } from '../../types';
import {
  createElementSource,
  createGainNode,
  destroyElementSource,
  destroyGainNode,
  getOrCreateAudioCtx,
} from './audio-context';

export class AudioGain implements AudioGainAdapter {
  private _gainNode: GainNode | null = null;
  private _srcAudioNode: MediaElementAudioSourceNode | null = null;

  get currentGain() {
    return this._gainNode?.gain?.value ?? null;
  }

  get supported() {
    return true;
  }

  constructor(
    private _media: HTMLMediaElement,
    private _onChange: (gain: number | null) => void,
  ) {}

  setGain(gain: number) {
    const currGain = this.currentGain;

    // Nothing was changed.
    if (gain === this.currentGain) {
      return;
    }

    // Disable audio gain, "1" means - no audio gain.
    if (gain === 1 && currGain !== 1) {
      this.removeGain();
      return;
    }

    if (!this._gainNode) {
      this._gainNode = createGainNode();

      // Reconnect the element source to the gain node after audio gain was unset.
      if (this._srcAudioNode) {
        this._srcAudioNode.connect(this._gainNode);
      }
    }

    if (!this._srcAudioNode) {
      this._srcAudioNode = createElementSource(this._media, this._gainNode);
    }

    this._gainNode.gain.value = gain;
    this._onChange(gain);
  }

  removeGain() {
    if (!this._gainNode) return;

    // Connect el audio source to the default audio output, before destroying the gain node.
    if (this._srcAudioNode) {
      this._srcAudioNode.connect(getOrCreateAudioCtx().destination);
    }

    this._destroyGainNode();
    this._onChange(null);
  }

  destroy() {
    this._destroySrcNode();
    this._destroyGainNode();
  }

  private _destroySrcNode() {
    if (!this._srcAudioNode) return;

    try {
      destroyElementSource(this._srcAudioNode);
    } catch (e) {
      // Ignore any error
    } finally {
      this._srcAudioNode = null;
    }
  }

  private _destroyGainNode() {
    if (!this._gainNode) return;

    try {
      destroyGainNode(this._gainNode);
    } catch (e) {
      // Ignore any error
    } finally {
      this._gainNode = null;
    }
  }
}
