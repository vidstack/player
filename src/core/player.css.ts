import { css } from 'lit-element';

export const playerStyles = css`
  .player {
    box-sizing: border-box;
    direction: ltr;
    font-family: var(--vds-player-font-family);
    -moz-osx-font-smoothing: auto;
    -webkit-font-smoothing: subpixel-antialiased;
    -webkit-tap-highlight-color: transparent;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
    line-height: 1.7;
    width: 100%;
    display: block;
    position: relative;
    max-width: 100%;
    min-width: 275px;
    min-height: 40px;
    text-shadow: none;
    outline: 0;
  }

  .player.audio {
    background-color: var(--vds-player-bg, transparent);
  }

  .player.video {
    height: 0;
    overflow: hidden;
    background-color: var(--vds-player-bg, #000);
  }

  .provider-ui-blocker {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: inline-block;
    z-index: var(--vds-blocker-z-index, 1);
  }
`;
