import { css } from 'lit-element';

export const timeProgressStyles = css`
  :host {
    display: table;
    contain: content;
  }

  #root {
    display: flex;
    align-items: center;
  }

  #separator {
    display: table;
    margin: 0 4px;
  }
`;
