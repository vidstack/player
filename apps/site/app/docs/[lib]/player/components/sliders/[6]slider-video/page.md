---
description: This component is used to load and display a preview video over the time slider.
---

## Usage

The `$tag:media-slider-video` component can be used to load a video in a slider.
This is _generally_ used to show a preview video (low-resolution) as the user interacts with the
time slider.

The point at which the user is hovering or dragging (`pointerValue`) is the preview time position.
The video will automatically be synced with said value, so ensure both the preview and loaded
video are of the same length (i.e., duration).

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
media-slider-video[data-hidden] {
}
```

## Tailwind

{% code_snippet name="tailwind" copyHighlight=true highlight="html:3-8|react:3-5,8-" /%}

{% callout type="info" %}
A more complete [slider example](/docs/react/player/components/sliders/time-slider#tailwind) is
available in the `$tag:media-time-slider` docs.
{% /callout %}
