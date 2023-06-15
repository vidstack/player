import { DOMEvent, listenEvent } from 'maverick.js/std';

import { canUseVideoPresentation } from '../../../../utils/support';
import type { MediaContext } from '../../../core/api/context';
import type { MediaFullscreenAdapter, MediaPictureInPictureAdapter } from '../../types';

declare global {
  interface GlobalEventHandlersEventMap {
    webkitpresentationmodechanged: Event;
  }
}

export class VideoPresentation {
  _mode: WebKitPresentationMode = 'inline';

  constructor(protected _video: HTMLVideoElement, private _media: MediaContext) {
    listenEvent(this._video, 'webkitpresentationmodechanged', this._onModeChange.bind(this));
  }

  get _supported() {
    return canUseVideoPresentation(this._video);
  }

  async _setPresentationMode(mode: WebKitPresentationMode) {
    if (this._mode === mode) return;
    this._video.webkitSetPresentationMode!(mode);
  }

  private _onModeChange() {
    const prevMode = this._mode;
    this._mode = this._video.webkitPresentationMode!;

    if (__DEV__) {
      this._media.logger
        ?.infoGroup('presentation mode change')
        .labelledLog('Mode', this._mode)
        .labelledLog('Event', event)
        .dispatch();
    }

    this._media.player?.dispatchEvent(
      new DOMEvent<string>('video-presentation-change', {
        detail: this._mode,
        trigger: event,
      }),
    );

    (['fullscreen', 'picture-in-picture'] as const).forEach((type) => {
      if (this._mode === type || prevMode === type) {
        this._media.delegate._dispatch(`${type}-change`, {
          detail: this._mode === type,
          trigger: event,
        });
      }
    });
  }
}

export class FullscreenPresentationAdapter implements MediaFullscreenAdapter {
  get active() {
    return this._presentation._mode === 'fullscreen';
  }

  get supported() {
    return this._presentation._supported;
  }

  constructor(protected _presentation: VideoPresentation) {}

  async enter() {
    this._presentation._setPresentationMode('fullscreen');
  }

  async exit() {
    this._presentation._setPresentationMode('inline');
  }
}

export class PIPPresentationAdapter implements MediaPictureInPictureAdapter {
  get active() {
    return this._presentation._mode === 'picture-in-picture';
  }

  get supported() {
    return this._presentation._supported;
  }

  constructor(protected _presentation: VideoPresentation) {}

  async enter() {
    this._presentation._setPresentationMode('picture-in-picture');
  }

  async exit() {
    this._presentation._setPresentationMode('inline');
  }
}
