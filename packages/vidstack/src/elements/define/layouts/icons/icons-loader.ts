import { type TemplateResult } from 'lit-html';

import { SlotObserver } from '../slot-observer';

export type IconsRecord = Record<string, Element | TemplateResult>;

export abstract class IconsLoader {
  #icons: IconsRecord = {};
  #loaded = false;

  readonly slots: SlotObserver;

  constructor(roots: HTMLElement[]) {
    this.slots = new SlotObserver(roots, this.#insertIcons.bind(this));
  }

  connect() {
    this.slots.connect();
  }

  load() {
    this.loadIcons().then((icons) => {
      this.#icons = icons;
      this.#loaded = true;
      this.#insertIcons();
    });
  }

  abstract loadIcons(): Promise<IconsRecord>;

  *#iterate() {
    for (const iconName of Object.keys(this.#icons)) {
      const slotName = `${iconName}-icon`;
      for (const slot of this.slots.elements) {
        if (slot.name !== slotName) continue;
        yield { icon: this.#icons[iconName], slot };
      }
    }
  }

  #insertIcons() {
    if (!this.#loaded) return;
    for (const { icon, slot } of this.#iterate()) {
      this.slots.assign(icon, slot);
    }
  }
}
