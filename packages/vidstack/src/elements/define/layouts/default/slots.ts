import { html } from 'lit-html';

export function IconSlot(name: string, classes = '') {
  return html`<slot
    name=${`${name}-icon`}
    data-class=${`vds-icon vds-${name}-icon${classes ? ` ${classes}` : ''}`}
  ></slot>`;
}

export function IconSlots(names: string[]) {
  return names.map((name) => IconSlot(name));
}
