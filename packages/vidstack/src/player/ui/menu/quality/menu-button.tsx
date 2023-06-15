import { defineElement, type HTMLCustomElement } from 'maverick.js/element';
import settingsMenuPaths from 'media-icons/dist/icons/settings-menu.js';

import { MenuButton, type MenuButtonAPI } from '../menu-button';
import type { MenuButtonProps } from '../menu-button';
import { renderMenuButtonContent } from '../render';

declare global {
  interface MaverickElements {
    'media-quality-menu-button': MediaQualityMenuButtonElement;
  }
}

/**
 * This component is a pre-filled menu button that controls the opening and closing of a quality
 * rate menu.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/quality-menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-quality-menu-button label="Quality"></media-quality-menu-button>
 *   <media-quality-menu-items></media-quality-menu-items>
 * </media-menu>
 * ```
 */
export class QualityMenuButton extends MenuButton<QualityMenuButtonAPI> {
  static override el = defineElement<QualityMenuButtonAPI>({
    tagName: 'media-quality-menu-button',
    props: { disabled: false, label: 'Quality' },
  });

  override render() {
    const { label } = this.$props;
    return renderMenuButtonContent({
      label,
      iconPaths: settingsMenuPaths,
    });
  }
}

export interface QualityMenuButtonAPI extends MenuButtonAPI {
  props: QualityMenuButtonProps;
}

export interface QualityMenuButtonProps extends MenuButtonProps {
  label: string;
}

export interface MediaQualityMenuButtonElement extends HTMLCustomElement<QualityMenuButton> {}
