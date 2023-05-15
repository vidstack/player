---
description: This component is used to load and display thumbnail images.
---

## Usage

The `$tag:media-thumbnail` component can be used to load and display preview thumbnails from
[WebVTT](#webvtt) files that are configured on the player.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:5" /%}

## WebVTT

The [Web Video Text Tracks](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) (WebVTT)
format specifies the time ranges of when to display images, with the respective image URL
and coordinates (only required if using a sprite).

- The WebVTT file URL can be absolute `https://foo.com/media/thumbnails.vtt` or relative `/media/thumbnails.vtt`.
- The image URLs specified in the WebVTT file can be absolute
  `https://foo.com/media/thumbnail-1.jpg` or relative `/media/thumbnail-1.jpg`.
- The width and height of each thumbnail image should be kept the same. If sizes differ, the aspect
  ratio should remain the same to avoid jumping when previewing.

### Sprite

Sprites are [large storyboard images](https://media-files.vidstack.io/storyboard.jpg) that contain
multiple small tiled thumbnails. They're preferred over loading [multiple images](#multiple-images)
because:

- Sprites reduce total file size due to compression.
- Avoid loading delays for each thumbnail.
- Reduce the number of server requests.

The WebVTT file must append the coordinates of each thumbnail like so:

```js
WEBVTT

00:00:00.000 --> 00:00:04.629
storyboard.jpg#xywh=0,0,284,160

00:00:04.629 --> 00:00:09.258
storyboard.jpg#xywh=284,0,284,160

...
```

### Multiple Images

[Sprites](#sprite) should generally be preferred but in the case you only have multiple individual
thumbnail images, they can be specified like so:

```js
WEBVTT

00:00:00.000 --> 00:00:04.629
/media/thumbnail-1.jpg

00:00:04.629 --> 00:00:09.258
/media/thumbnail-2.jpg

...
```

## Styling

```css {% copy=true %}
media-thumbnail {
}

/* Apply styles when thumbnail is loading. */
media-thumbnail[data-loading] {
}

/* Apply styles when thumbnail fails to load. */
media-thumbnail[aria-hidden='true'] {
}

/* Apply styles to underlying img element. */
media-thumbnail [part='img'] {
}
```

### CSS Variables

The following snippet contains a complete list of CSS variables and their default values. Any
of the variables can be set to adjust the default thumbnail styles:

```css {% copy=true %}
media-thumbnail {
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

{% code_snippet name="tailwind" copy=true /%}
