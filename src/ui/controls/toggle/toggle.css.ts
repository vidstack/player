import { css } from 'lit-element';

export const toggleStyles = css`
  :host {
    display: contents;
    contain: content;
  }

  :host(:focus) {
    outline: 0;
  }
`;
