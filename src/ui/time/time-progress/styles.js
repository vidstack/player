import { css } from 'lit';

export const timeProgressElementStyles = css`
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
