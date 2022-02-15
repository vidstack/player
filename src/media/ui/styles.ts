import { css } from 'lit';

export const mediaUiElementStyles = css`
  :host {
    display: block;
    contain: content;
    pointer-events: none;
  }

  :host([hidden]) {
    display: none;
  }

  ::slotted(*) {
    pointer-events: auto;
  }
`;
