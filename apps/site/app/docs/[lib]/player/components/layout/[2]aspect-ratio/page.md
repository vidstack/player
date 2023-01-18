---
description: This component is used to create a container with a fixed aspect ratio around a media provider.
---

## Usage

The `$tag:vds-aspect-ratio` component creates a container that will try to hold the dimensions of the
desired aspect ratio. Fixed dimensions are great for creating uniform and responsive boxes,
or avoiding layout shifts while media loads over the network.

{% code_preview name="usage" size="medium" copyHighlight=true highlight="html:2,7|react:6,9" /%}

### `aspect-ratio`

You can skip using this component, and use the [`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)
CSS property if [browser support](https://caniuse.com/mdn-css_properties_aspect-ratio) for it is
suitable to your application.

```css {% copy=true %}
video {
  aspect-ratio: 16 / 9;
}
```
