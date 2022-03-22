## Usage

The `<vds-mute-button>` component will toggle the `muted` state of media as it's pressed by
dispatching a `vds-mute-request:ignore`, and `vds-unmute-request:ignore` event to the media
controller.

<slot name="usage" />

```css:copy
/* Hide mute text when media _is_ muted. */
[media-muted] .mute {
	display: none;
}

/* Hide unmute text when media _is not_ muted. */
:not([media-muted]) .unmute {
	display: none;
}
```

## Styling

Here's a styled `<vds-mute-button>` example containing a mute and unmute icon:

<slot name="styling" />

```css:copy
vds-mute-button {
	position: relative;
	width: 24px;
	height: 24px;
	border-radius: 4px;
	cursor: pointer;
	color: white;
}

vds-mute-button > svg {
	/** `absolute` so icons are placed on top of each other. */
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 1;
	transition: opacity ease 150ms;
}

[media-muted] .mute-icon {
	opacity: 0;
}

:not([media-muted]) .unmute-icon {
	opacity: 0;
}
```
