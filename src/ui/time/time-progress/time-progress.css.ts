import { css } from 'lit-element';

export const timeProgressStyles = css`
  :host {
    display: inline-block;
    contain: content;
  }

  #root {
    display: flex;
    align-items: center;
  }

  #separator {
    display: inline-block;
    margin: 0 4px;
  }
`;
