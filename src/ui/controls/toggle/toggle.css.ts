import { css } from 'lit-element';

export const toggleStyles = css`
  :host {
    display: table;
    contain: content;
  }

  :host(:focus) {
    outline: 0;
  }
`;
