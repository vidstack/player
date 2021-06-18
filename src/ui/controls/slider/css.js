import { css } from 'lit';

export const sliderElementStyles = css`
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
		cursor: pointer;
		outline: 0;
		height: 100%;
		/* Margin on left and right to contain slider thumb when pulled to edges. */
		margin: 0 calc(var(--vds-slider-thumb-width, 16px) / 2);
		position: relative;
		min-width: 12.5px;
		user-select: none;
		-webkit-user-select: none;
		min-height: max(48px, var(--vds-slider-thumb-height, 16px));
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	}

	#thumb-container {
		position: absolute;
		top: 0px;
		/*
     * It'd be nice to use translateX() for performance/animation reasons but had issues with
     * track's bounding box not being correct for random number of RAF cycles.
     */
		left: var(--vds-slider-fill-percent);
		width: var(--vds-slider-thumb-width, 16px);
		height: 100%;
		user-select: none;
		-webkit-user-select: none;
		will-change: left;
		z-index: 300;
		transform: translateX(-50%);
		outline: 0;
	}

	#thumb {
		position: absolute;
		border: 0;
		top: 50%;
		left: 0px;
		user-select: none;
		-webkit-user-select: none;
		width: var(--vds-slider-thumb-width, 16px);
		height: var(--vds-slider-thumb-height, 16px);
		outline: none;
		border-radius: var(--vds-slider-thumb-border-radius, 50%);
		cursor: pointer;
		background: var(--vds-slider-thumb-bg, #161616);
		transform: translateY(-50%) scale(var(--vds-slider-thumb-scale, 0.75));
		transition: var(--vds-slider-thumb-transition, transform 100ms ease-out 0s);
		will-change: transform;
	}

	:host([dragging]) #thumb {
		transform: translateY(-50%) scale3d(1, 1, 1);
	}

	#track {
		position: absolute;
		top: 0;
		left: 0;
		top: 50%;
		z-index: 100;
		width: 100%;
		height: var(--vds-slider-track-height);
		min-height: 2.5px;
		cursor: pointer;
		background: var(--vds-slider-track-bg, #b3b3b3);
		transform: translateY(-50%);
	}

	#track-fill {
		z-index: 200;
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
		will-change: transform;
	}

	:host(:focus) #thumb,
	:host(:active) #thumb,
	:host([dragging]) #thumb,
	:host(:focus) #track-fill,
	:host(:active) #track-fill,
	:host([dragging]) #track-fill {
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
