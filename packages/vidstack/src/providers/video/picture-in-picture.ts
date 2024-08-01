import { EventsController, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import { canUsePictureInPicture } from '../../utils/support';
import type { MediaPictureInPictureAdapter } from '../types';

declare global {
  interface GlobalEventHandlersEventMap {
    enterpictureinpicture: Event;
    leavepictureinpicture: Event;
  }
}

export class VideoPictureInPicture implements MediaPictureInPictureAdapter {
  readonly #video: HTMLVideoElement;
  readonly #media: MediaContext;

  constructor(video: HTMLVideoElement, media: MediaContext) {
    this.#video = video;
    this.#media = media;

    new EventsController(video)
      .add('enterpictureinpicture', this.#onEnter.bind(this))
      .add('leavepictureinpicture', this.#onExit.bind(this));
  }

  get active() {
    return document.pictureInPictureElement === this.#video;
  }

  get supported() {
    return canUsePictureInPicture(this.#video);
  }

  async enter() {
    return this.#video.requestPictureInPicture();
  }

  exit() {
    return document.exitPictureInPicture();
  }

  #onEnter(event: Event) {
    this.#onChange(true, event);
  }

  #onExit(event: Event) {
    this.#onChange(false, event);
  }

  #onChange = (active: boolean, event: Event) => {
    this.#media.notify('picture-in-picture-change', active, event);
  };
}
