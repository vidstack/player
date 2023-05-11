---
description: This component is used to load and display thumbnail images over the time slider.
---

## Usage

The `$tag:media-slider-thumbnail` component can be used to load preview thumbnails from
[WebVTT](#webvtt) files and display them over the time slider.

The thumbnail image will be displayed when the user is hovering over or dragging the time slider,
and the time ranges in the WebVTT file will automatically be matched based on the current pointer
position.

{% code_preview name="usage" copyHighlight=true highlight="html:4|react:7" /%}

## WebVTT

See the docs on how to correctly set up the
[thumbnails VTT file](/docs/player/components/display/thumbnail#webvtt).

{% code_snippet name="player" highlight="1" /%}

## Styling

```css
media-slider-thumbnail {
}

/* Apply styles to thumbnail element. */
media-slider-thumbnail [part='thumbnail'] {
}

/* Apply styles when thumbnails are loading. */
media-slider-thumbnail [part='thumbnail'][data-loading] {
}

/* Apply styles when thumbnail fails to load. */
media-slider-thumbnail [part='thumbnail'][aria-hidden='true'] {
}

/* Apply styles to <img> element part. */
media-slider-thumbnail [part='img'] {
}
```

### CSS Variables

The following snippet contains a complete list of CSS variables and their default values. Any
of the variables can be set to adjust the default slider thumbnail styles:

```css {% copy=true %}
media-slider {
  --media-thumbnail-bg: black;
  /* Applies when scaling thumbnails up. */
  --media-thumbnail-min-width: 120px;
  --media-thumbnail-min-height: 80px;
  /* Applies when scaling thumbnails down. */
  --media-thumbnail-max-width: 180px;
  --media-thumbnail-max-height: 160px;
}
```

## Tailwind

{% code_snippet name="tailwind" copy=true  /%}

A complete [Tailwind slider example](/docs/player/components/sliders/time-slider#tailwind) is
available in the `$tag:media-time-slider` docs.
