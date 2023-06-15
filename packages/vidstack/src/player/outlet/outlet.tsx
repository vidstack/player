import { onDispose, peek, signal, tick } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';
import { animationFrameThrottle, listenEvent, setStyle } from 'maverick.js/std';
import type { CaptionsFileFormat } from 'media-captions';

import { scopedRaf } from '../../utils/dom';
import { IS_SAFARI } from '../../utils/support';
import { useMedia, type MediaContext } from '../core/api/context';
import type { MediaSrc } from '../core/api/types';
import type { TextTrackInit } from '../core/tracks/text/text-track';
import type { MediaProviderLoader } from '../providers/types';
import { SourceSelection } from './source-select';
import { Tracks } from './tracks';

declare global {
  interface MaverickElements {
    'media-outlet': MediaOutletElement;
  }
}

/**
 * Used to render the current provider.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/outlet}
 * @slot - Used to pass content inside the provider output.
 * @example
 * ```html
 * <media-player>
 *   <media-outlet></media-outlet>
 *   <!-- ... -->
 * </media-player>
 * ```
 */
export class Outlet extends Component<OutletAPI> {
  static el = defineElement<OutletAPI>({
    tagName: 'media-outlet',
  });

  private _media!: MediaContext;
  private _domSources = signal<MediaSrc[]>([]);
  private _domTracks = signal<TextTrackInit[]>([]);
  private _loader = signal<MediaProviderLoader | null>(null);

  constructor(instance: ComponentInstance<OutletAPI>) {
    super(instance);
    this._media = useMedia();
    new SourceSelection(this._domSources, this._media, this._loader);
    new Tracks(this._domTracks, this._media);
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('keep-alive', '');
  }

  protected override onConnect(el: HTMLElement) {
    const resize = new ResizeObserver(animationFrameThrottle(this._onResize.bind(this)));
    resize.observe(el);

    const mutation = new MutationObserver(this._onMutation.bind(this));
    mutation.observe(el, { attributes: true, childList: true });

    if (IS_SAFARI) {
      // Prevent delay on pointer/click events.
      listenEvent(el, 'touchstart', (e) => e.preventDefault(), { passive: false });
    }

    scopedRaf(() => {
      this._onResize();
      this._onMutation();
    });

    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }

  protected override onDestroy() {
    this._media.$store.currentTime.set(0);
  }

  protected _onResize() {
    const player = this._media.player,
      width = this.el!.offsetWidth,
      height = this.el!.offsetHeight;

    if (!player) return;

    player.$store.mediaWidth.set(width);
    player.$store.mediaHeight.set(height);

    setStyle(player, '--media-width', width + 'px');
    setStyle(player, '--media-height', height + 'px');
  }

  private _onMutation() {
    const sources: MediaSrc[] = [],
      tracks: TextTrackInit[] = [],
      children = this.el!.children;

    for (const el of children) {
      if (el instanceof HTMLSourceElement) {
        sources.push({
          src: el.src,
          type: el.type,
        });
      } else if (el instanceof HTMLTrackElement) {
        tracks.push({
          id: el.id,
          src: el.src,
          kind: el.track.kind,
          language: el.srclang,
          label: el.label,
          default: el.default,
          type: el.getAttribute('data-type') as CaptionsFileFormat,
        });
      }
    }

    this._domSources.set(sources);
    this._domTracks.set(tracks);
    tick();
  }

  override render() {
    let currentProvider;

    onDispose(() => currentProvider?.destroy?.());

    return () => {
      currentProvider?.destroy();

      const loader = this._loader();
      if (!loader) return null;

      const el = loader.render(this._media.$store);

      if (!__SERVER__) {
        peek(() => {
          loader!.load(this._media).then((provider) => {
            // The src/loader might've changed by the time we load the provider.
            if (peek(this._loader) !== loader) return;

            this._media.delegate._dispatch('provider-change', {
              detail: provider,
            });

            currentProvider = provider;
          });
        });
      }

      return el;
    };
  }
}

export interface OutletAPI {}

export interface MediaOutletElement extends HTMLCustomElement<Outlet> {}
