import { type TemplateResult } from 'lit-html';
import { onDispose } from 'maverick.js';

import { SlotObserver } from '../slot-observer';

export type IconsRecord = Record<string, Element | TemplateResult>;

export abstract class IconsLoader {
  protected _icons: IconsRecord = {};
  protected _loaded = false;

  readonly slots: SlotObserver;

  constructor(protected _roots: HTMLElement[]) {
    this.slots = new SlotObserver(_roots, this._insertIcons.bind(this));
  }

  connect() {
    this.slots.connect();
    onDispose(this.disconnect.bind(this));
  }

  load() {
    this._load().then((icons) => {
      this._icons = icons;
      this._loaded = true;
      this._insertIcons();
    });
  }

  disconnect() {
    for (const { slot } of this._iterate()) {
      slot.textContent = '';
    }
  }

  abstract _load(): Promise<IconsRecord>;

  private *_iterate() {
    for (const iconName of Object.keys(this._icons)) {
      const slotName = `${iconName}-icon`;
      for (const slot of this.slots.elements) {
        if (slot.name !== slotName) continue;
        yield { icon: this._icons[iconName], slot };
      }
    }
  }

  protected _insertIcons() {
    if (!this._loaded) return;
    for (const { icon, slot } of this._iterate()) {
      this.slots.assign(icon, slot);
    }
  }
}
