import type { HTMLCustomElement } from 'maverick.js/element';

import type { TimeProps } from './props';

export { TimeProps };

/**
 * Outputs a media duration (eg: `currentTime`, `duration`, `bufferedAmount`, etc.) value as time
 * formatted text.
 *
 * @tagname vds-time
 * @example
 * ```html
 * <vds-time type="current"></vds-time>
 * ```
 * @example
 * ```html
 * <!-- Remaining time. -->
 * <vds-time type="current" remainder></vds-time>
 * ```
 */
export interface TimeElement extends HTMLCustomElement<TimeProps> {}
