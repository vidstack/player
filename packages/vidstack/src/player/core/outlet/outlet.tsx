import { peek, signal } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';
import { setStyle } from 'maverick.js/std';
import type { CaptionsFileFormat } from 'media-captions';

import { useMedia, type MediaContext } from '../api/context';
import type { MediaSrc } from '../api/types';
import type { MediaProviderLoader } from '../providers/types';
import type { TextTrackInit } from '../tracks/text/text-track';
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
    this._onResize();
    this._onMutation();

    const resize = new ResizeObserver(this._onResize.bind(this));
    resize.observe(el);

    const mutation = new MutationObserver(this._onMutation.bind(this));
    mutation.observe(el, { childList: true });

    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }

  protected override onDestroy() {
    this._media.$store.currentTime.set(0);
  }

  protected _rafId = -1;
  protected _onResize() {
    if (this._rafId >= 0) return;
    this._rafId = window.requestAnimationFrame(() => {
      const player = this._media.player!,
        width = this.el!.offsetWidth,
        height = this.el!.offsetHeight;

      setStyle(player, '--media-width', width + 'px');
      setStyle(player, '--media-height', height + 'px');

      this._rafId = -1;
    });
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
  }

  override render() {
    return () => {
      const loader = this._loader();
      if (!loader) return null;

      const el = loader.render(this._media.$store);

      peek(() => {
        loader.load(this._media).then((provider) => {
          // The src/loader might've changed by the time we load the provider.
          if (peek(this._loader) !== loader) return;
          this._media.delegate._dispatch('provider-change', {
            detail: provider,
          });
        });
      });

      return el;
    };
  }
}

export interface OutletAPI {}

export interface MediaOutletElement extends HTMLCustomElement<Outlet> {}
