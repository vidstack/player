import { Component, effect, provideContext, signal } from 'maverick.js';

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
  const { $provider } = media,
    {
      fullscreen,
      canFullscreen,
      canPictureInPicture,
      pictureInPicture,
      hasCaptions,
      textTrack,
      canAirPlay,
      isAirPlayConnected,
      viewType,
      playing,
      paused,
      controlsVisible,
      pointer,
      waiting,
      currentTime,
      poster,
    } = media.$state;

  el.classList.add('plyr');
  el.classList.add('plyr--full-ui');

  function isHTMLProvider() {
    const { $provider } = media,
      type = $provider()?.type;
    return type === 'audio' || type === 'video';
  }

  const classes = {
    'plyr--airplay-active': isAirPlayConnected,
    'plyr--airplay-supported': canAirPlay,
    'plyr--fullscreen-active': fullscreen,
    'plyr--fullscreen-enabled': canFullscreen,
    'plyr--hide-controls': () => !controlsVisible(),
    'plyr--html5': isHTMLProvider,
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

  for (const key of Object.keys(classes)) {
    effect(() => void el.classList.toggle(key, !!classes[key]()));
  }

  effect(() => {
    const token = `plyr--${viewType()}`;
    el.classList.add(token);
    return () => el.classList.remove(token);
  });

  effect(() => {
    const token = `plyr--${$provider()?.type}`;
    el.classList.toggle(token, !!$provider());
    return () => el.classList.remove(token);
  });
}
