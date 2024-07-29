import type { AudioGainAdapter } from '../../types';
import {
  createElementSource,
  createGainNode,
  destroyElementSource,
  destroyGainNode,
  getOrCreateAudioCtx,
} from './audio-context';

export class AudioGain implements AudioGainAdapter {
  #media: HTMLMediaElement;
  #onChange: (gain: number | null) => void;
  #gainNode: GainNode | null = null;
  #srcAudioNode: MediaElementAudioSourceNode | null = null;

  get currentGain() {
    return this.#gainNode?.gain?.value ?? null;
  }

  get supported() {
    return true;
  }

  constructor(media: HTMLMediaElement, onChange: (gain: number | null) => void) {
    this.#media = media;
    this.#onChange = onChange;
  }

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

    if (!this.#gainNode) {
      this.#gainNode = createGainNode();

      // Reconnect the element source to the gain node after audio gain was unset.
      if (this.#srcAudioNode) {
        this.#srcAudioNode.connect(this.#gainNode);
      }
    }

    if (!this.#srcAudioNode) {
      this.#srcAudioNode = createElementSource(this.#media, this.#gainNode);
    }

    this.#gainNode.gain.value = gain;
    this.#onChange(gain);
  }

  removeGain() {
    if (!this.#gainNode) return;

    // Connect el audio source to the default audio output, before destroying the gain node.
    if (this.#srcAudioNode) {
      this.#srcAudioNode.connect(getOrCreateAudioCtx().destination);
    }

    this.#destroyGainNode();
    this.#onChange(null);
  }

  destroy() {
    this.#destroySrcNode();
    this.#destroyGainNode();
  }

  #destroySrcNode() {
    if (!this.#srcAudioNode) return;

    try {
      destroyElementSource(this.#srcAudioNode);
    } catch (e) {
      // Ignore any error
    } finally {
      this.#srcAudioNode = null;
    }
  }

  #destroyGainNode() {
    if (!this.#gainNode) return;

    try {
      destroyGainNode(this.#gainNode);
    } catch (e) {
      // Ignore any error
    } finally {
      this.#gainNode = null;
    }
  }
}
