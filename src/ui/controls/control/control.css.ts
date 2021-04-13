import { css } from 'lit-element';

export const controlStyles = css`
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
