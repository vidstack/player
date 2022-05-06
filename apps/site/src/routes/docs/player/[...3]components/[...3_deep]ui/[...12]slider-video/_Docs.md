---
description: This component is used to load and display a preview video over a slider.
---

## Usage

The `<vds-slider-video>` component can be used to load a video in [`<vds-slider>`](../slider/index.md).
This is _generally_ used to show a preview video (low-resolution) as the user interacts with the
time slider.

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

In the following example, we show a preview time and video at the point the user is hovering
over on the slider:

:::stackblitz_example name="styling"
:::
