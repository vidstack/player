import { css } from 'lit';

export const mediaUiElementStyles = css`
  :host {
    display: block;
    contain: content;
  }

  :host([hidden]) {
    display: none;
  }
`;
