import { css } from 'lit';

export const buttonElementStyles = css`
  :host {
    display: table;
    contain: content;
  }

  :host(:focus) {
    outline: 0;
  }

  button {
    min-width: 48px;
    min-height: 48px;
  }
`;
