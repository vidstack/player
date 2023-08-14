import { effect, peek, type ReadSignal } from 'maverick.js';
import type { IconsRecord } from './icons-loader';
import { LayoutIconsLoader } from './layout-icons-loader';

export class TemplateIconsLoader extends LayoutIconsLoader {
  constructor(
    el: HTMLElement,
    private _id: ReadSignal<string>,
    private _class: string,
  ) {
    super(el);
  }

  override connect(): void {
    super.connect();
    effect(this._watchTemplate.bind(this));
  }

  private _watchTemplate() {
    const id = this._id();
    if (!this._loaded) return;
    this._resolveIcons(id).then((icons) => {
      this._icons = icons;
      this._insertIcons();
    });
  }

  override async _load() {
    return this._resolveIcons(peek(this._id));
  }

  protected async _resolveIcons(id: string): Promise<IconsRecord> {
    const icons: Record<string, Element> = {},
      template = id && document.getElementById(id);

    if (template instanceof HTMLTemplateElement) {
      const fragment = template.content.cloneNode(true);
      for (const el of fragment.childNodes) {
        if (el.nodeType === 1) {
          const iconName = (el as Element).getAttribute('data-icon');
          (el as HTMLElement).classList.add(this._class);
          if (iconName) icons[iconName] = el as Element;
        }
      }
    }

    return icons;
  }
}
