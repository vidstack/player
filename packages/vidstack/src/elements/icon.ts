import { html } from 'lit-html';
import type { DirectiveResult } from 'lit-html/directive.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { type ReadSignal } from 'maverick.js';
import { isString } from 'maverick.js/std';

import { $signal } from './lit/directives/signal';

export function Icon({ name, class: _class, state, paths }: IconProps) {
  return html`<svg
    class="${'vds-icon' + (_class ? ` ${_class}` : '')}"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    data-icon=${ifDefined(name ?? state)}
  >
    ${!isString(paths) ? $signal(paths) : unsafeSVG(paths)}
  </svg>`;
}

export interface IconProps {
  name?: string;
  class?: string;
  state?: string;
  paths: string | ReadSignal<string> | ReadSignal<DirectiveResult>;
}
