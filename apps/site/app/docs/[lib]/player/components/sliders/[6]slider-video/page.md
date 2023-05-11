---
description: This component is used to load and display a preview video over the time slider.
---

## Usage

The `$tag:media-slider-video` component can be used to load a video in a slider.
This is _generally_ used to show a preview video (low-resolution) as the user interacts with the
time slider.

The preview video will be displayed when the user is hovering over or dragging the time slider,
and it will automatically be updated to be in-sync with the current pointer position. Therefore,
ensure it has the same length as the original media (i.e., same duration) to avoid displaying
incorrect previews.

{% code_preview name="usage" copyHighlight=true highlight="html:4-7|react:7" /%}

## Events

The native video `canplay` and `error` events are re-dispatched by this component for you to
listen to if needed.

{% code_snippet name="video-events" /%}

## Styling

You can override the default styles with CSS like so:

```css
/* Override default styles. */
media-slider-video {
}

/* Apply styles to <video> element part. */
media-slider-video [part='video'] {
  width: 156px;
}

/* Apply styles when video is loading. */
media-slider-video[data-loading] {
}

/* Apply styles when video fails to load. */
media-slider-video[aria-hidden='true'] {
}
```

## Tailwind

A complete [Tailwind slider example](/docs/player/components/sliders/time-slider#tailwind) is
available in the `$tag:media-time-slider` docs.
