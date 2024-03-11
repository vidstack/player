import { Component, effect, provideContext, signal } from 'maverick.js';
import { createDisposalBin } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { plyrLayoutContext } from './context';
import { plyrLayoutProps, type PlyrLayoutProps } from './props';

export class PlyrLayout extends Component<PlyrLayoutProps> {
  static props = plyrLayoutProps;

  protected _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();

    provideContext(plyrLayoutContext, {
      ...this.$props,
      previewTime: signal(0),
    });
  }
}

export function usePlyrLayoutClasses(el: HTMLElement, media: MediaContext) {
  const {
    canAirPlay,
    canFullscreen,
    canPictureInPicture,
    controlsHidden,
    currentTime,
    fullscreen,
    hasCaptions,
    isAirPlayConnected,
    paused,
    pictureInPicture,
    playing,
    pointer,
    poster,
    textTrack,
    viewType,
    waiting,
  } = media.$state;

  el.classList.add('plyr');
  el.classList.add('plyr--full-ui');

  const classes = {
    'plyr--airplay-active': isAirPlayConnected,
    'plyr--airplay-supported': canAirPlay,
    'plyr--fullscreen-active': fullscreen,
    'plyr--fullscreen-enabled': canFullscreen,
    'plyr--hide-controls': controlsHidden,
    'plyr--is-touch': () => pointer() === 'coarse',
    'plyr--loading': waiting,
    'plyr--paused': paused,
    'plyr--pip-active': pictureInPicture,
    'plyr--pip-enabled': canPictureInPicture,
    'plyr--playing': playing,
    'plyr__poster-enabled': poster,
    'plyr--stopped': () => paused() && currentTime() === 0,
    'plyr--captions-active': textTrack,
    'plyr--captions-enabled': hasCaptions,
  };

  const disposal = createDisposalBin();

  for (const token of Object.keys(classes)) {
    disposal.add(effect(() => void el.classList.toggle(token, !!classes[token]())));
  }

  disposal.add(
    effect(() => {
      const token = `plyr--${viewType()}`;
      el.classList.add(token);
      return () => el.classList.remove(token);
    }),
    effect(() => {
      const { $provider } = media,
        type = $provider()?.type,
        token = `plyr--${isHTMLProvider(type) ? 'html5' : type}`;
      el.classList.toggle(token, !!type);
      return () => el.classList.remove(token);
    }),
  );

  return () => disposal.empty();
}

function isHTMLProvider(type: string | undefined) {
  return type === 'audio' || type === 'video';
}
