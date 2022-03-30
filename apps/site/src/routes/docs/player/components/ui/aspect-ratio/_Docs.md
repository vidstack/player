## Usage

The `<vds-aspect-ratio>` component creates a container that will try to hold the dimensions of the
desired aspect ratio. Fixed dimensions are great for creating uniform and responsive boxes,
or avoiding layout shifts while media loads over the network.

<slot name="usage" />

### `aspect-ratio`

You can skip using this component, and use the [`aspect-ratio:ignore`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)
CSS property if [browser support](https://caniuse.com/mdn-css_properties_aspect-ratio) for it is
suitable to your application.

```css:copy
vds-media,
vds-video,
vds-hls {
  width: 100%;
}

video {
	aspect-ratio: 16 / 9;
}
```
