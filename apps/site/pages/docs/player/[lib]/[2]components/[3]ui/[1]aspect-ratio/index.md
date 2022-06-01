---
description: This component is used to create a container with a fixed aspect ratio around a media provider.
---

## Usage

The `$tag:vds-aspect-ratio` component creates a container that will try to hold the dimensions of the
desired aspect ratio. Fixed dimensions are great for creating uniform and responsive boxes,
or avoiding layout shifts while media loads over the network.

{% code_preview name="usage" size="medium" css=true copyHighlight=true highlight="html:2,7|react:6,9" /%}

## Styling

For the media to be rendered correctly, you need to ensure the media elements fill their
container like so:

```css {% copy=true %}
vds-media {
  width: 100%;
}
```

### `aspect-ratio`

You can skip using this component, and use the [`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)
CSS property if [browser support](https://caniuse.com/mdn-css_properties_aspect-ratio) for it is
suitable to your application.

```css {% copy=true %}
vds-media {
  width: 100%;
}

video {
  aspect-ratio: 16 / 9;
}
```
