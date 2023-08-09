import { Component, effect } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { PlayerQueryList } from '../../core';

class MediaUI extends Component<{ when: string }> {
  static props = {
    when: '',
  };
}

/**
 * @docs {@link https://www.vidstack.io/docs/player/styling#responsive}
 * @example
 * ```html
 * <media-ui when="(view-type: video)">
 *   <template>
 *     <!-- ... -->
 *   </template>
 * </media-ui>
 * ```
 */
export class MediaUIElement extends Host(HTMLElement, MediaUI) {
  static tagName = 'media-ui';

  query!: PlayerQueryList;

  protected onSetup() {
    this.query = PlayerQueryList.create(this.$props.when);
  }

  protected onConnect() {
    effect(this._watchQuery.bind(this));
  }

  private _watchQuery() {
    if (!this.query.matches) {
      for (const el of this.children) {
        if (el.localName !== 'template') el.remove();
      }

      return;
    }

    const template = this.querySelector('template');
    if (template) this.append(template.cloneNode(true));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-ui': MediaUIElement;
  }
}
