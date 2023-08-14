import { listenEvent } from 'maverick.js/std';
import type { MediaPlayerElement } from '../../player-element';
import { IconsLoader } from './icons-loader';

export abstract class LayoutIconsLoader extends IconsLoader {
  constructor(protected _el: HTMLElement) {
    super();
  }

  override connect() {
    const player = this._findPlayerElement();
    if (!player) return;

    super.connect();
    this.slots.observe(this._el);

    if (player.$state.canLoad()) {
      this.load();
    } else {
      listenEvent(player, 'can-load' as any, () => this.load(), { once: true });
    }
  }

  protected _findPlayerElement() {
    let node = this._el.parentElement;

    while (node && node.localName !== 'media-player') {
      node = node.parentElement;
    }

    return node as MediaPlayerElement | null;
  }
}
