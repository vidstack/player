import { listenEvent } from 'maverick.js/std';

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
  constructor(
    protected _video: HTMLVideoElement,
    private _media: MediaContext,
  ) {
    listenEvent(this._video, 'enterpictureinpicture', this._onEnter.bind(this));
    listenEvent(this._video, 'leavepictureinpicture', this._onExit.bind(this));
  }

  get active() {
    return document.pictureInPictureElement === this._video;
  }

  get supported() {
    return canUsePictureInPicture(this._video);
  }

  async enter() {
    return this._video.requestPictureInPicture();
  }

  exit() {
    return document.exitPictureInPicture();
  }

  private _onEnter(event: Event) {
    this._onChange(true, event);
  }

  private _onExit(event: Event) {
    this._onChange(false, event);
  }

  private _onChange = (active: boolean, event: Event) => {
    this._media.delegate._notify('picture-in-picture-change', active, event);
  };
}
