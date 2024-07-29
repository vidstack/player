import { DOMEvent, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../../core/api/media-context';
import { canUseVideoPresentation } from '../../../utils/support';
import type { MediaFullscreenAdapter, MediaPictureInPictureAdapter } from '../../types';

declare global {
  interface GlobalEventHandlersEventMap {
    webkitpresentationmodechanged: Event;
  }
}

export class VideoPresentation {
  #video: HTMLVideoElement;
  #media: MediaContext;
  #mode: WebKitPresentationMode = 'inline';

  get mode() {
    return this.#mode;
  }

  constructor(video: HTMLVideoElement, media: MediaContext) {
    this.#video = video;
    this.#media = media;
    listenEvent(video, 'webkitpresentationmodechanged', this.#onModeChange.bind(this));
  }

  get supported() {
    return canUseVideoPresentation(this.#video);
  }

  async setPresentationMode(mode: WebKitPresentationMode) {
    if (this.#mode === mode) return;
    this.#video.webkitSetPresentationMode!(mode);
  }

  #onModeChange(event: Event) {
    const prevMode = this.#mode;
    this.#mode = this.#video.webkitPresentationMode!;

    if (__DEV__) {
      this.#media.logger
        ?.infoGroup('presentation mode change')
        .labelledLog('Mode', this.#mode)
        .labelledLog('Event', event)
        .dispatch();
    }

    this.#media.player?.dispatch(
      new DOMEvent<string>('video-presentation-change', {
        detail: this.#mode,
        trigger: event,
      }),
    );

    (['fullscreen', 'picture-in-picture'] as const).forEach((type) => {
      if (this.#mode === type || prevMode === type) {
        this.#media.notify(`${type}-change`, this.#mode === type, event);
      }
    });
  }
}

export class FullscreenPresentationAdapter implements MediaFullscreenAdapter {
  #presentation: VideoPresentation;

  get active() {
    return this.#presentation.mode === 'fullscreen';
  }

  get supported() {
    return this.#presentation.supported;
  }

  constructor(presentation: VideoPresentation) {
    this.#presentation = presentation;
  }

  async enter() {
    this.#presentation.setPresentationMode('fullscreen');
  }

  async exit() {
    this.#presentation.setPresentationMode('inline');
  }
}

export class PIPPresentationAdapter implements MediaPictureInPictureAdapter {
  #presentation: VideoPresentation;

  get active() {
    return this.#presentation.mode === 'picture-in-picture';
  }

  get supported() {
    return this.#presentation.supported;
  }

  constructor(presentation: VideoPresentation) {
    this.#presentation = presentation;
  }

  async enter() {
    this.#presentation.setPresentationMode('picture-in-picture');
  }

  async exit() {
    this.#presentation.setPresentationMode('inline');
  }
}
