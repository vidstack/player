## Usage

:::danger
The `hidden` attribute will be present on this element in the event fullscreen cannot be
requested (not supported by environment or provider). The button's `display` property will be
set to `none`, so it'll be removed from the layout; therefore, you should account for the button
not being displayed in your design.
:::

The `<vds-fullscreen-button>` component will toggle the `fullscreen` state of media as it's pressed by
dispatching a `vds-enter-fullscreen-request:ignore`, and `vds-exit-fullscreen-request:ignore`
event to the media controller.

<slot name="usage" />

```css:copy
/* Hide enter fullscreen text when media _is_ fullscreen. */
[media-fullscreen] .enter-fs {
	display: none;
}

/* Hide exit fullscreen text when media _is not_ fullscreen. */
:not([media-fullscreen]) .exit-fs {
	display: none;
}
```

## Styling

Here's a styled `<vds-fullscreen-button>` example containing enter and exit fullscreen icons:

<slot name="styling" />

```css:copy
vds-fullscreen-button {
	position: relative;
	width: 24px;
	height: 24px;
	border-radius: 4px;
	cursor: pointer;
	color: white;
}

vds-fullscreen-button > svg {
	/** `absolute` so icons are placed on top of each other. */
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 1;
	transition: opacity ease 150ms;
}

[media-fullscreen] .enter-fs-icon {
	opacity: 0;
}

:not([media-fullscreen]) .exit-fs-icon {
	opacity: 0;
}
```
