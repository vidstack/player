## Usage

We don't provide a buffering indicator component out of the box because you can easily create one with
some HTML, CSS, and [media attributes](../../../getting-started/styling.md#media-attributes).

The `media-waiting:ignore` attribute can be used to show the indicator while media is buffering. Optionally,
the `media-can-play:ignore` attribute could also be used to display the indicator while media is intiailly loading.

```css:copy
/* Show buffering indicator while media is not ready, or buffering. */
:not([media-can-play]) .buffering-icon,
[media-waiting] .buffering-icon {
	opacity: 1;
}
```

## Styling

In the following example, we put together a convetional buffering spinner, and position it at the
center of the player:

<slot name="styling" />

```css:copy
.buffering-container {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* prevent blocking lower elements (e.g., gestures). */
	pointer-events: none;
	/** place above poster (optional). */
	z-index: 1;
}

.buffering-icon {
	width: 64px;
	height: 64px;
	color: white;
	opacity: 0;
	transition: opacity 200ms ease;
}

.buffering-track {
	opacity: 0.25;
}

.buffering-track-fill {
	opacity: 0.75;
	stroke-dasharray: 100;
	stroke-dashoffset: 50;
}

/* Show buffering indicator while media is not ready, or buffering. */
:not([media-can-play]) .buffering-icon,
[media-waiting] .buffering-icon {
	opacity: 1;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
```
