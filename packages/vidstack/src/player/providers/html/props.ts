import type { ElementPropDefinitions } from 'maverick.js/element';

import { mediaProviderPropDefs } from '../../media/provider/props';
import type { MediaProviderProps } from '../../media/provider/types';

export const htmlMediaElementPropDefs: ElementPropDefinitions<HtmlMediaElementProps> = {
  ...mediaProviderPropDefs,
  preload: { initial: 'metadata' },
};

export interface HtmlMediaElementProps extends MediaProviderProps {
  /**
   * Configures the preload setting of the underlying media element once it can load (see
   * `loading` property). This will overwrite any existing `preload` value on the `<audio>`
   * or `<video>` element.
   *
   * The `preload` attribute provides a hint to the browser about what the author thinks will
   * lead to the best user experience with regards to what content is loaded before the video is
   * played. The recommended default is `metadata`.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload}
   */
  preload: 'none' | 'metadata' | 'auto';
}
