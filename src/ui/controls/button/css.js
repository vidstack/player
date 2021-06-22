import { css } from 'lit';

export const buttonElementStyles = css`
	:host {
		display: table;
		contain: content;
	}

	/* Only show focus outline on 'button' element. */
	:host(:focus) {
		outline: 0;
	}

	button {
		min-width: 48px;
		min-height: 48px;
	}
`;
