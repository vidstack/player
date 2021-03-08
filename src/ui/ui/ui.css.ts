import { css } from 'lit-element';

export const uiStyles = css`
  :host {
    display: block;
    contain: content;
    /* Position above provider players such as <video>. */
    z-index: 1;
  }

  div[part*='root'] {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;
