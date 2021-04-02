import { css } from 'lit-element';

export const toggleStyles = css`
  :host {
    display: inline-block;
    contain: content;
  }

  :host(:focus) {
    outline: 0;
  }
`;
