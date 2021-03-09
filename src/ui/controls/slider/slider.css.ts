import { css } from 'lit-element';

/**
 * @prop --vds-slider-thumb-bg: The background color of the slider thumb.
 * @prop --vds-slider-thumb-width: The width of the slider thumb.
 * @prop --vds-slider-thumb-height: The height of the slider thumb.
 * @prop --vds-slider-thumb-shadow: The shadow cast around the slider thumb.
 * @prop --vds-slider-track-height: The height of the track.
 * @prop --vds-slider-track-focused-height: The height of the track when it is focused.
 * @prop --vds-slider-track-color: The color of the track.
 * @prop --vds-slider-value-color: The color of the part of the track filled upto the current value.
 */
export const sliderStyles = css`
  :host {
    display: block;
    contain: content;
  }

  input {
    width: 100%;
    border: 0;
    -webkit-appearance: none;
    background: transparent;
    box-sizing: border-box;
    border-radius: calc(var(--vds-slider-thumb-height) * 2);
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;

    /* Color is used in JS to populate lower fill for WebKit */
    color: var(--vds-slider-value-color);
    display: block;
    height: var(--vds-slider-track-height);
    margin: 0;
    padding: 0;
    transition: box-shadow 0.3s ease;
  }

  input::-webkit-slider-runnable-track {
    border: 0;
    background: transparent;
    border-radius: calc(var(--vds-slider-track-height) / 2);
    height: var(--vds-slider-track-height);
    transition: box-shadow 0.3s ease;
    user-select: none;
    background-image: linear-gradient(
      to right,
      currentColor var(--vds-slider-value, 0%),
      transparent var(--vds-slider-value, 0%)
    );
    background-color: var(--vds-slider-track-color);
  }

  input::-webkit-slider-thumb {
    opacity: 0;
    background: var(--vds-slider-thumb-bg);
    border: 0;
    border-radius: 100%;
    position: relative;
    transition: all 0.2s ease;
    width: var(--vds-slider-thumb-width);
    height: var(--vds-slider-thumb-height);
    box-shadow: var(--vds-slider-thumb-shadow);
    -webkit-appearance: none;
    margin-top: calc(
      0px -
        calc(
          calc(var(--vds-slider-thumb-height) - var(--vds-slider-track-height)) /
            2
        )
    );
  }

  input::-moz-range-track {
    background: transparent;
    border: 0;
    border-radius: calc(var(--vds-slider-track-height) / 2);
    height: var(--vds-slider-track-height);
    transition: box-shadow 0.3s ease;
    user-select: none;
    background-color: var(--vds-slider-track-color);
  }

  input::-moz-range-thumb {
    opacity: 0;
    background: var(--vds-slider-thumb-bg);
    border: 0;
    border-radius: 100%;
    position: relative;
    transition: all 0.2s ease;
    width: var(--vds-slider-thumb-width);
    height: var(--vds-slider-thumb-height);
    box-shadow: var(--vds-slider-thumb-shadow);
  }

  input::-moz-range-progress {
    background: currentColor;
    border-radius: calc(var(--vds-slider-track-height) / 2);
    height: var(--vds-slider-track-height);
  }

  input::-ms-track {
    border: 0;
    border-radius: calc(var(--vds-slider-track-height) / 2);
    height: var(--vds-slider-track-height);
    transition: box-shadow 0.3s ease;
    user-select: none;
    color: transparent;
    background-color: var(--vds-slider-track-color);
  }

  input::-ms-fill-upper {
    background: transparent;
    border: 0;
    border-radius: calc(var(--vds-slider-track-height) / 2);
    height: var(--vds-slider-track-height);
    transition: box-shadow 0.3s ease;
    user-select: none;
  }

  input::-ms-fill-lower {
    border: 0;
    border-radius: calc(var(--vds-slider-track-height) / 2);
    height: var(--vds-slider-track-height);
    transition: box-shadow 0.3s ease;
    user-select: none;
    background: currentColor;
  }

  input::-ms-thumb {
    opacity: 0;
    background: var(--vds-slider-thumb-bg);
    border: 0;
    border-radius: 100%;
    position: relative;
    transition: all 0.2s ease;
    width: var(--vds-slider-thumb-width);
    height: var(--vds-slider-thumb-height);
    box-shadow: var(--vds-slider-thumb-shadow);
    /* For some reason, Edge uses the -webkit margin above */
    margin-top: 0;
  }

  input::-ms-tooltip {
    display: none;
  }

  input:hover::-webkit-slider-runnable-track {
    height: var(--vds-slider-track-focused-height);
  }

  input:hover::-moz-range-track {
    height: var(--vds-slider-track-focused-height);
  }

  input:hover::-ms-track {
    height: var(--vds-slider-track-focused-height);
  }

  input:hover::-ms-fill-upper {
    height: var(--vds-slider-track-focused-height);
  }

  input:hover::-ms-fill-lower {
    height: var(--vds-slider-track-focused-height);
  }

  input:hover::-webkit-slider-thumb {
    opacity: 1;
  }

  input:hover::-moz-range-thumb {
    opacity: 1;
  }

  input:hover::-ms-thumb {
    opacity: 1;
  }

  input:focus {
    outline: 0;
  }

  input:focus::-webkit-slider-runnable-track {
    outline: 0;
    height: var(--vds-slider-track-focused-height);
  }

  input:focus::-moz-range-track {
    outline: 0;
    height: var(--vds-slider-track-focused-height);
  }

  input:focus::-ms-track {
    outline: 0;
    height: var(--vds-slider-track-focused-height);
  }

  input::-moz-focus-outer {
    border: 0;
  }
`;
