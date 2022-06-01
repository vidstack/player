---
description: This component is used to display a media poster or thumbnail image, generally before playback begins.
---

## Usage

The `$tag:vds-poster` component loads and displays the current media poster image. When
this component is present, the `poster` attribute will not be applied to the media provider to
prevent double loading. Furthermore, this element will respect the loading strategy defined
on the media provider; therefore, the poster won't load until the media can (lazy).

We recommend using `$tag:vds-poster` over the HTML5 `poster` attribute because the behavior will
be more consistent browser-to-browser. The native poster will sometimes load and disappear as
soon as the first media frame is ready depending on your `preload` setting. Secondly, you can
place this poster over the media and controls while loading to improve the overall design; you
can't do this if using the native `poster` attribute because it lives inside the browser's
media element.

{% code_preview name="usage" css=true copyHighlight=true highlight="html:6|react:7" /%}

### Loading Attributes

The following loading attributes are applied to the `vds-poster` element:

- `img-loading`: Present when poster image is being downloaded by the browser.
- `img-loaded`: Present when the poster image has successfully loaded.
- `img-error`: Present when the poster image has failed to load.

```html
<vds-poster img-loading />
```

You can use these attributes to further style the poster as it's being loaded such as
showing a loading visual (skeleton animation), or replacing the poster with a default visual
when the image fails to load.

```css {% copy=true %}
/* Do something while image is loading. */
vds-poster[img-loading] {
  background-color: #e8e8e8;
}

/* Hide poster if it fails to load. */
vds-poster[img-error] {
  display: none;
}
```

## Styling

In the following example, we put together a poster with a big play button on top, once
playback starts they'll both fade out:

{% code_preview name="styling" css=true copySteps=true highlight="html:2-5,11-24|react:1,8-21" /%}
