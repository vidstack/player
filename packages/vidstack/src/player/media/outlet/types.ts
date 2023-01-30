import type { HTMLCustomElement } from 'maverick.js/element';

/**
 * Used to render the current provider.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/layout/media-outlet}
 * @slot - Used to pass content inside the provider output.
 * @example
 * ```html
 * <media-player>
 *   <media-outlet></media-outlet>
 *   <!-- ... -->
 * </media-player>
 * ```
 */
export interface MediaOutletElement extends HTMLCustomElement {}
