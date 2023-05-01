import { effect, peek, signal } from 'maverick.js';
import { Component, defineElement, type HTMLCustomElement } from 'maverick.js/element';
import { lazyPaths, paths } from 'media-icons';

import type { IconProps } from './types';

declare global {
  interface MaverickElements {
    'media-icon': MediaIconElement;
  }
}

/**
 * The `<media-icon>` component dynamically loads and renders our custom Vidstack icons. See our
 * [media icons catalog](https://www.vidstack.io/media-icons) to preview them all. Do note, the icon `type` can
 * be dynamically changed.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/icons}
 * @example
 * ```html
 * <media-icon type="play"></media-icon>
 * <media-icon type="pause"></media-icon>
 * ```
 */
export class Icon extends Component<IconAPI> {
  static el = defineElement<IconAPI>({
    tagName: 'media-icon',
    props: { type: undefined },
  });

  private _hydrate = false;
  private _paths = signal<string>('');

  protected override onAttach(el: HTMLElement): void {
    if (__SERVER__) {
      const type = this.$props.type();
      if (type && paths[type]) this._paths.set(paths[type]);
      return;
    }

    this._hydrate = el.hasAttribute('mk-h');
    effect(this._loadIcon.bind(this));
  }

  protected _loadIcon() {
    const type = this.$props.type();

    if (this._hydrate) {
      this._hydrate = false;
      return;
    }

    if (type && lazyPaths[type]) {
      lazyPaths[type]().then(({ default: paths }) => {
        // Check type because it may have changed by the time the icon loads.
        if (type === peek(this.$props.type)) this._paths.set(paths);
      });
    } else {
      this._paths.set('');
    }
  }

  override render() {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        data-media-icon="true"
        $prop:innerHTML={this._paths()}
      ></svg>
    );
  }
}

export interface IconAPI {
  props: IconProps;
}

export interface MediaIconElement extends HTMLCustomElement<Icon> {}
