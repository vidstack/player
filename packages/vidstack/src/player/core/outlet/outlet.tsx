import { signal } from 'maverick.js';
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
  private _rendered = signal(false);
  private _domSources = signal<MediaSrc[]>([]);
  private _domTracks = signal<TextTrackInit[]>([]);

  constructor(instance: ComponentInstance<OutletAPI>) {
    super(instance);
    this._media = useMedia();
    new SourceSelection(this._domSources, this._rendered, this._media);
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

  protected _onResize() {
    const player = this._media.player!,
      width = this.el!.offsetWidth,
      height = this.el!.offsetHeight;
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
  }

  override render() {
    return () => {
      const loader = this._media.$loader();

      if (!loader) {
        this._rendered.set(false);
        return;
      }

      this._rendered.set(true);
      return loader.render(this._media.$store);
    };
  }
}

export interface OutletAPI {}

export interface MediaOutletElement extends HTMLCustomElement<Outlet> {}
