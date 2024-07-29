import { effect, signal } from 'maverick.js';
import { Host, type Attributes } from 'maverick.js/element';
import { listenEvent } from 'maverick.js/std';

import { DefaultAudioLayout } from '../../../../components/layouts/default/audio-layout';
import { useDefaultLayoutContext } from '../../../../components/layouts/default/context';
import type { DefaultLayoutProps } from '../../../../components/layouts/default/props';
import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import { isHTMLElement } from '../../../../utils/dom';
import { $signal } from '../../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../../lit/lit-element';
import { setLayoutName } from '../layout-name';
import { SlotManager } from '../slot-manager';
import { DefaultAudioLayout as Layout } from './audio-layout';
import { DefaultLayoutIconsLoader } from './icons-loader';
import { createMenuContainer } from './ui/menu/menu-portal';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/layouts/default-layout}
 * @example
 * ```html
 * <media-player>
 *   <media-provider></media-provider>
 *   <media-audio-layout></media-audio-layout>
 * </media-player>
 * ```
 */
export class MediaAudioLayoutElement
  extends Host(LitElement, DefaultAudioLayout)
  implements LitRenderer
{
  static tagName = 'media-audio-layout';

  static override attrs: Attributes<DefaultLayoutProps> = {
    smallWhen: {
      converter(value) {
        return value !== 'never' && !!value;
      },
    },
  };

  #media!: MediaContext;
  #scrubbing = signal(false);

  protected onSetup() {
    // Avoid memory leaks if `keepAlive` is true. The DOM will re-render regardless.
    this.forwardKeepAlive = false;

    this.#media = useMediaContext();

    this.classList.add('vds-audio-layout');

    this.#setupWatchScrubbing();
  }

  protected onConnect() {
    setLayoutName('audio', () => this.isMatch);
    this.#setupMenuContainer();
  }

  render() {
    return $signal(this.#render.bind(this));
  }

  #render() {
    return this.isMatch ? Layout() : null;
  }

  #setupMenuContainer() {
    const { menuPortal } = useDefaultLayoutContext();

    effect(() => {
      if (!this.isMatch) return;

      const container = createMenuContainer(
          this,
          this.menuContainer,
          'vds-audio-layout',
          () => this.isSmallLayout,
        ),
        roots = container ? [this, container] : [this];

      const iconsManager = this.$props.customIcons()
        ? new SlotManager(roots)
        : new DefaultLayoutIconsLoader(roots);

      iconsManager.connect();

      menuPortal.set(container);

      return () => {
        container.remove();
        menuPortal.set(null);
      };
    });
  }

  #setupWatchScrubbing() {
    const { pointer } = this.#media.$state;
    effect(() => {
      if (pointer() !== 'coarse') return;
      effect(this.#watchScrubbing.bind(this));
    });
  }

  #watchScrubbing() {
    if (!this.#scrubbing()) {
      listenEvent(this, 'pointerdown', this.#onStartScrubbing.bind(this), { capture: true });
      return;
    }

    listenEvent(this, 'pointerdown', (e) => e.stopPropagation());
    listenEvent(window, 'pointerdown', this.#onStopScrubbing.bind(this));
  }

  #onStartScrubbing(event: Event) {
    const { target } = event,
      hasTimeSlider = !!(isHTMLElement(target) && target.closest('.vds-time-slider'));

    if (!hasTimeSlider) return;

    event.stopImmediatePropagation();
    this.setAttribute('data-scrubbing', '');
    this.#scrubbing.set(true);
  }

  #onStopScrubbing() {
    this.#scrubbing.set(false);
    this.removeAttribute('data-scrubbing');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-audio-layout': MediaAudioLayoutElement;
  }
}
