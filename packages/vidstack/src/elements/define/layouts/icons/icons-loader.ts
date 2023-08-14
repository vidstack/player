import { render, type TemplateResult } from 'lit-html';
import { onDispose } from 'maverick.js';
import { SlotObserver } from '../slot-observer';

export type IconsRecord = Record<string, Element | TemplateResult>;

export abstract class IconsLoader {
  protected _icons: IconsRecord = {};
  protected _loaded = false;
  readonly slots = new SlotObserver(this._insertIcons.bind(this));

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
    this._resetSlots();
    this.slots.disconnect();
  }

  private _resetSlots() {
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
      slot.textContent = '';

      if (icon instanceof Node) {
        slot.append(icon);
      } else {
        render(icon, slot);
      }

      if (!slot.style.display) {
        (slot as HTMLElement).style.display = 'contents';
      }

      const iconEl = slot.firstElementChild;
      if (!iconEl) return;

      const classList = slot.getAttribute('data-class');
      if (classList) iconEl.classList.add(...classList.split(' '));
    }
  }
}
