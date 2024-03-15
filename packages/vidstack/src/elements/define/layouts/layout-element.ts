import { Component, computed, effect } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { isBoolean } from 'maverick.js/std';

import { type MediaPlayerQuery } from '../../../core';
import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { isHTMLElement } from '../../../utils/dom';

class MediaLayout extends Component<MediaLayoutProps> {
  static props: MediaLayoutProps = {
    when: false,
  };
}

export interface MediaLayoutProps {
  when: boolean | MediaPlayerQuery;
}

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/layouts#custom}
 * @example
 * ```html
 * <media-layout class="video-layout">
 *   <template>
 *     <!-- ... -->
 *   </template>
 * </media-layout>
 *
 * <script>
 *   const layout = document.querySelector(".video-layout");
 *   // All player state is available.
 *   layout.when = ({ viewType }) => viewType === 'video';
 * </script>
 * ```
 */
export class MediaLayoutElement extends Host(HTMLElement, MediaLayout) {
  static tagName = 'media-layout';

  protected _media!: MediaContext;

  protected onSetup() {
    this._media = useMediaContext();
  }

  protected onConnect() {
    effect(this._watchWhen.bind(this));
  }

  private _watchWhen() {
    const root = this.firstElementChild,
      isTemplate = root?.localName === 'template',
      when = this.$props.when(),
      matches = isBoolean(when) ? when : computed(() => when(this._media.player.state))();

    if (!matches) {
      if (isTemplate) {
        this.textContent = '';
        this.appendChild(root);
      } else if (isHTMLElement(root)) {
        root.style.display = 'none';
      }

      return;
    }

    if (isTemplate) {
      this.append((root as HTMLTemplateElement).content.cloneNode(true));
    } else if (isHTMLElement(root)) {
      root.style.display = '';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-layout': MediaLayoutElement;
  }
}
