import { Component, effect } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { PlayerQueryList } from '../../../core';

class MediaLayout extends Component<{ when: string }> {
  static props = {
    when: '',
  };
}

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/layouts#custom}
 * @example
 * ```html
 * <media-layout when="(view-type: video)">
 *   <template>
 *     <!-- ... -->
 *   </template>
 * </media-layout>
 * ```
 */
export class MediaLayoutElement extends Host(HTMLElement, MediaLayout) {
  static tagName = 'media-layout';

  query!: PlayerQueryList;

  protected onSetup() {
    this.query = PlayerQueryList.create(this.$props.when);
  }

  protected onConnect() {
    effect(this._watchQuery.bind(this));
  }

  private _watchQuery() {
    const root = this.firstElementChild,
      isTemplate = root?.localName === 'template',
      isHTMLElement = root instanceof HTMLElement;

    if (!this.query.matches) {
      if (isTemplate) {
        this.textContent = '';
        this.appendChild(root);
      } else if (isHTMLElement) {
        root.style.display = 'none';
      }

      return;
    }

    if (isTemplate) {
      this.append((root as HTMLTemplateElement).content.cloneNode(true));
    } else if (isHTMLElement) {
      root.style.display = '';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-layout': MediaLayoutElement;
  }
}
