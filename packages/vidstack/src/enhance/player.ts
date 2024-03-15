import '../elements/bundles/player';

import { isString, kebabToCamelCase } from 'maverick.js/std';

import type { DefaultLayoutProps, PlyrLayoutProps } from '../components';
import type { MediaPlayerProps, TextTrackInit } from '../core';
import { isHTMLAudioElement, isHTMLIFrameElement, isHTMLVideoElement } from '../providers';
import { isHTMLElement } from '../utils/dom';

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

    const player = document.createElement('media-player'),
      provider = document.createElement('media-provider'),
      layouts: HTMLElement[] = [],
      isTargetContainer =
        !isHTMLAudioElement(target) && !isHTMLVideoElement(target) && !isHTMLIFrameElement(target);

    if (layout?.type === 'default') {
      await import('../elements/bundles/player-ui');
      await import('../elements/bundles/player-layouts/default');

      layouts.push(
        document.createElement('media-video-layout'),
        document.createElement('media-audio-layout'),
      );
    } else if (layout?.type === 'plyr') {
      await import('../elements/bundles/player-layouts/plyr');

      layouts.push(document.createElement('media-plyr-layout'));
    }

    if (layout && layouts.length) {
      const { type, ...props } = layout;
      for (const [name, value] of Object.entries(props)) {
        for (const layout of layouts) layout[name] = value;
      }
    }

    target.removeAttribute('controls');

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
      } else if (layouts.length) {
        for (const layout of layouts) {
          if (propName in layout) layout.setAttribute(name, attr.value);
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

    for (const layout of layouts) {
      player.append(layout);
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
  layout?: DefaultLayoutConfig | PlyrLayoutConfig;
}

export interface DefaultLayoutConfig extends Partial<DefaultLayoutProps> {
  type: 'default';
}

export interface PlyrLayoutConfig extends Partial<PlyrLayoutProps> {
  type: 'plyr';
}

if (typeof window !== 'undefined') {
  (window as any).VidstackPlayer = VidstackPlayer;
}
