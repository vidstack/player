import { css } from 'lit-element';

export const sliderStyles = css`
  * {
    box-sizing: border-box;
    touch-action: none;
  }

  :host {
    display: block;
    contain: content;
  }

  :host(:focus),
  :host(:active) {
    outline: 0;
  }

  #root {
    display: flex;
    align-items: center;
    border: 0;
    outline: 0;
    height: 100%;
    margin: 0 calc(var(--vds-slider-thumb-width, 16px) / 2);
    position: relative;
    min-width: 12.5px;
    user-select: none;
    min-height: max(
      var(--vds-slider-thumb-height, 16px),
      var(--vds-slider-track-height, 2.5px)
    );
  }

  #thumb {
    position: absolute;
    border: 0;
    outline: 0;
    top: 0px;
    z-index: 30;
    width: var(--vds-slider-thumb-width, 16px);
    height: var(--vds-slider-thumb-height, 16px);
    outline: none;
    border-radius: var(--vds-slider-thumb-border-radius, 50%);
    cursor: pointer;
    background: var(--vds-slider-thumb-bg, #161616);
    transform: translate(-50%, 0);
  }

  #track {
    position: absolute;
    top: 0;
    left: 0;
    top: 50%;
    z-index: 10;
    width: 100%;
    height: var(--vds-slider-track-height);
    min-height: 2.5px;
    cursor: pointer;
    background: var(--vds-slider-track-bg, #b3b3b3);
    transform: translateY(-50%);
  }

  #track-fill {
    z-index: 20;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: var(--vds-slider-track-height);
    min-height: 2.5px;
    pointer-events: none;
    background: var(--vds-slider-track-fill-bg, #161616);
    transform-origin: left center;
    transform: translate(0%, -50%) scaleX(var(--vds-slider-fill-rate));
  }

  :host(:focus) #thumb,
  :host(:active) #thumb,
  #root.dragging #thumb,
  :host(:focus) #track-fill,
  :host(:active) #track-fill,
  #root.dragging #track-fill {
    border: 0;
    outline: 0;
    background-color: var(--vds-slider-active-color, #ff2a5d);
  }

  :host([disabled]) #thumb,
  :host([disabled]) #track,
  :host([disabled]) #track-fill {
    background-color: var(--vds-slider-disabled-color, #e0e0e0);
  }

  input {
    display: none;
  }
`;
