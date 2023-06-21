import { html } from 'lit-html';
import { isReadSignal } from 'maverick.js';

import { $signal } from './directives/signal';

/**
 * Extends `lit-html` by setting all signal values as a `SignalDirective`.
 */
export const $html = (strings: TemplateStringsArray, ...values: any[]) => {
  return html(strings, ...values.map((val) => (isReadSignal(val) ? $signal(val) : val)));
};
