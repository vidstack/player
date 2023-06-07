---
description: This component is used to display a media poster or thumbnail image, generally before playback begins.
---

## Usage

The `$tag:media-poster` component loads and displays the current media poster image. This
element will respect the loading strategy defined on the `$tag:media-player`; therefore, the poster
won't load until the media can.

We recommend using `$tag:media-poster` over the HTML5 `poster` attribute because the behavior will
be more consistent browser-to-browser. The native poster will sometimes load and disappear as
soon as the first media frame is ready depending on your `preload` setting. Secondly, you can
place this poster over the media and controls while loading to improve the overall design; you
can't do this if using the native `poster` attribute because it lives inside the browser's
media element.

{% code_preview name="usage" size="large" copyHighlight=true highlight="html:3|react:7" /%}

The poster can also be placed inside the aspect ratio container if there are controls outside
of the media player:

{% code_snippet name="usage-two" highlight="html:3|react:7" /%}

## Data Attributes

The following data attributes are applied to the `media-poster` element:

- `data-loading`: Present when poster image is being downloaded by the browser.
- `aria-hidden='true'`: Present when the poster image has failed to load.

```html
<media-poster data-loading />
```

You can use these attributes to further style the poster as it's being loaded such as
showing a loading visual (skeleton animation), or replacing the poster with a default visual
when the image fails to load.

```css {% copy=true %}
/* Do something while poster image is loading. */
media-poster[data-loading] {
}

/* Do something if poster image fails to load. */
media-poster[aria-hidden='true'] {
}
```
