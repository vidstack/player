import { defineElement, type HTMLCustomElement } from 'maverick.js/element';
import { closedCaptionsPaths } from 'media-icons';

import { MenuButton, type MenuButtonAPI } from '../menu-button';
import type { MenuButtonProps } from '../menu-button';
import { renderMenuButtonContent } from '../render';

declare global {
  interface MaverickElements {
    'media-captions-menu-button': MediaCaptionsMenuButtonElement;
  }
}

/**
 * This component is a pre-styled menu button that controls the opening and closing of a captions
 * menu.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/captions-menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-captions-menu-button label="Captions"></media-captions-menu-button>
 *   <media-captions-menu-items></media-captions-menu-items>
 * </media-menu>
 * ```
 */
export class CaptionsMenuButton extends MenuButton<CaptionsMenuButtonAPI> {
  static override el = defineElement<CaptionsMenuButtonAPI>({
    tagName: 'media-captions-menu-button',
    props: { disabled: false, label: 'Captions' },
  });

  override render() {
    const { label } = this.$props;
    return renderMenuButtonContent({
      label,
      iconPaths: closedCaptionsPaths,
    });
  }
}

export interface CaptionsMenuButtonAPI extends MenuButtonAPI {
  props: CaptionsMenuButtonProps;
}

export interface CaptionsMenuButtonProps extends MenuButtonProps {
  label: string;
}

export interface MediaCaptionsMenuButtonElement extends HTMLCustomElement<CaptionsMenuButton> {}
