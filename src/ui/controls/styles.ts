import { css } from 'lit';

export const controlsElementStyles = css`
  :host {
    display: block;
    contain: content;
  }

  :host([hidden]) {
    display: none;
  }
`;
