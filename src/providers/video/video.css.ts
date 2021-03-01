import { css } from 'lit-element';

export const videoStyles = css`
  video {
    border-radius: inherit;
    vertical-align: middle;
    outline: 0;
    border: 0;
    height: auto;
    user-select: none;
  }

  video:not([width]) {
    width: 100%;
  }
`;
