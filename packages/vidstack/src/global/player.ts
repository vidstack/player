import '../elements/bundles/player';

import { defineCustomElement } from 'maverick.js/element';
import { isString, kebabToCamelCase } from 'maverick.js/std';

import type { MediaPlayerProps } from '../core/api/player-props';
import type { TextTrackInit } from '../core/tracks/text/text-track';
import {
  isHTMLAudioElement,
  isHTMLIFrameElement,
  isHTMLVideoElement,
} from '../providers/type-check';
import { isHTMLElement } from '../utils/dom';
import { VidstackPlayerLayout } from './layouts/default';
import type { VidstackPlayerLayoutLoader } from './layouts/loader';
import { PlyrLayout } from './layouts/plyr';

const LAYOUT_LOADED = Symbol();

export class VidstackPlayer {
  static async create({ target, layout, tracks, ...props }: VidstackPlayerConfig) {
    if (__SERVER__) {
      throw Error('[vidstack] can not create player on server.');
    }

    if (isString(target)) {
      target = document.querySelector(target) as HTMLElement;
    }

    if (!isHTMLElement(target)) {
      throw Error(`[vidstack] target must be of type \`HTMLElement\`, found \`${typeof target}\``);
    }

    let player = document.createElement('media-player'),
      provider = document.createElement('media-provider'),
      layouts: HTMLElement[] | undefined,
      isTargetContainer =
        !isHTMLAudioElement(target) && !isHTMLVideoElement(target) && !isHTMLIFrameElement(target);

    player.setAttribute('keep-alive', '');

    if (props.poster && layout?.name !== 'plyr') {
      if (!customElements.get('media-poster')) {
        const { MediaPosterElement } = await import('../elements/define/poster-element');
        defineCustomElement(MediaPosterElement);
      }

      const poster = document.createElement('media-poster');
      if (layout?.name === 'vidstack') poster.classList.add('vds-poster');
      provider.append(poster);
    }

    if (layout) {
      target.removeAttribute('controls');

      if (!layout[LAYOUT_LOADED]) {
        await layout.load();
        layout[LAYOUT_LOADED] = true;
      }

      layouts = await layout.create();
    }

    const title = target.getAttribute('title');
    if (title) player.setAttribute('title', title);

    const width = target.getAttribute('width'),
      height = target.getAttribute('height');

    if (width || height) {
      if (width) player.style.width = width;
      if (height) player.style.height = height;
      player.style.aspectRatio = 'unset';
    }

    for (const attr of target.attributes) {
      const name = attr.name.replace('data-', ''),
        propName = kebabToCamelCase(name);

      if (propName in player) {
        player.setAttribute(name, attr.value);
      } else if (layouts?.length) {
        for (const layout of layouts) {
          if (propName in layout) {
            layout.setAttribute(name, attr.value);
          }
        }
      }
    }

    for (const [prop, value] of Object.entries(props)) {
      player[prop] = value;
    }

    if (tracks) {
      for (const track of tracks) player.textTracks.add(track);
    }

    player.append(provider);

    if (layouts) {
      for (const layout of layouts) player.append(layout);
    }

    if (isTargetContainer) {
      target.append(player);
    } else {
      // Copy over source/track elements.
      for (const child of [...target.children]) provider.append(child);
      target.replaceWith(player);
    }

    return player;
  }
}

export type VidstackPlayerTarget = string | HTMLElement;

export interface VidstackPlayerConfig extends Partial<MediaPlayerProps> {
  /**
   * A document query selector string or `HTMLElement` to mount on. If an `<audio>`, `<video>`, or
   * `<iframe>` element is given it will be enhanced.
   */
  target: VidstackPlayerTarget;
  /**
   * Text tracks to be included on initialization.
   */
  tracks?: TextTrackInit[];
  /**
   * Specify a layout to be loaded.
   */
  layout?: VidstackPlayerLayoutLoader;
}

export { VidstackPlayerLayout, PlyrLayout, type VidstackPlayerLayoutLoader };

if (__CDN__) {
  (VidstackPlayer as any).Layout = {
    Default: VidstackPlayerLayout,
    Plyr: PlyrLayout,
  };

  (window as any).VidstackPlayer = VidstackPlayer;
}
