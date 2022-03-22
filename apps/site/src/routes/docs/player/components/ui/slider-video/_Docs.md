## Usage

The `<vds-slider-video>` component can be used to load a video in [`<vds-slider>`](../slider/index.md). This is _generally_ used to show a preview
video (low-resolution) as the user interacts with the time slider.

The point at which the user is hovering or dragging (`pointerValue`) is the preview time position.
The video will automatically be synced with said value, so ensure both the preview and loaded
video are of the same length (i.e., duration).

<slot name="usage" />

## Video Attributes

The following video attributes are applied to the `vds-slider-video:ignore` element:

- `video-can-play:ignore`: Present when the video is ready for playback.
- `video-error:ignore`: Present when media loading fails.

```html
<!-- Example. -->
<vds-slider-video video-error />
```

You can use these attributes to further style the slider video as it's being loaded, such as hiding
it before media is ready or if it fails to load.

```css
/* Temporarily hide video while loading. */
vds-slider-video:not([video-can-play]) {
  opacity: 0;
}

/* Hide video if it fails to load. */
vds-slider-video[video-error] {
  display: none;
}
```

## Video Events

The native video `canplay` and `error` events are re-dispatched by this component for you to
listen to if needed.

<slot name="video-events" />

## Styling

In the following code snippets, we extend the work we started in the [slider example](../slider/index.md#example),
by displaying the preview video at the position the user is hovering over.

<slot name="styling" />

```css:copy
vds-slider-video {
	--width: 156px;
	--width-half: calc(var(--width) / 2);
	--top: calc(-1 * var(--width-half) - 24px);
	--opacity-duration: 200ms;

	/* clamp video to left and right of slider. */
	--left-clamp: max(var(--width-half), var(--vds-slider-pointer-percent));
	--right-clamp: calc(100% - var(--width-half));
	--left: min(var(--left-clamp), var(--right-clamp));

	position: absolute;
	top: var(--top);
	left: var(--left);
	width: var(--width);
	opacity: 0;
	transition: opacity ease-out var(--opacity-duration);
	/* re-position to center. */
	transform: translateX(-50%);
	will-change: left;
	border-radius: 2px;
	background-color: #000;
}

/* show video while device pointer is inside slider. */
[pointing] vds-slider-video {
	opacity: 1;
	transition: opacity ease-in var(--opacity-duration);
}

/* Temporarily hide video while loading. */
vds-slider-video:not([video-can-play]) {
	opacity: 0 !important;
}

/* Hide video if it fails to load. */
vds-slider-video[video-error] {
	display: none;
}
```
