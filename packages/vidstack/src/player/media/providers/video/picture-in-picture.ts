import { listenEvent } from 'maverick.js/std';

import { canUsePictureInPicture } from '../../../../utils/support';
import type { MediaContext } from '../../context';
import type { MediaPictureInPictureAdapter } from '../types';

declare global {
  interface GlobalEventHandlersEventMap {
    enterpictureinpicture: Event;
    leavepictureinpicture: Event;
  }
}

export class VideoPictureInPicture implements MediaPictureInPictureAdapter {
  constructor(protected _video: HTMLVideoElement, { delegate }: MediaContext) {
    const onChange = (active: boolean, event: Event) => {
      delegate.dispatch('picture-in-picture-change', {
        detail: active,
        trigger: event,
      });
    };

    listenEvent(this._video, 'enterpictureinpicture', (event) => onChange(true, event));
    listenEvent(this._video, 'leavepictureinpicture', (event) => onChange(false, event));
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
}
