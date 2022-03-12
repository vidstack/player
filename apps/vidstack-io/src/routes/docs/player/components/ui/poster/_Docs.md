## Usage

The `<vds-poster>` component loads and displays the current media poster image. When
this component is present, the `poster` attribute will not be applied to the media provider to
prevent double loading.

We recommend using `<vds-poster>` over the HTML5 `poster` attribute because the behavior will
be more consistent browser-to-browser. The native poster will sometimes load and disappear as soon as the
first media frame is ready depending on your `preload` setting. Secondly, you can place this
poster over the media and controls while loading to improve the overall design; you can't do this
if using the native `poster` attribute because it lives inside the browser's media element.

<slot name="usage" />

You can position the poster using CSS like so:

```css:copy
/* Fill entire background. */
vds-poster {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
}
```

### Loading Strategy

You can specify a loading strategy if desired (`eager` or `lazy`); otherwise, it'll fall back to
the strategy defined on the media player.

- `eager` will load the poster immediately.
- `lazy` will load the poster once it has entered the browser's viewport.

<slot name="loading-strategy" />

:::no
Declaring a loading strategy on both the media player and poster is unnecessary:
:::

<slot name="double-loading-strategy" />

### Loading Attributes

The following loading attributes are applied to the `vds-poster:ignore` element:

- `img-loading:ignore`: Present when poster image is being downloaded by the browser.
- `img-loaded:ignore`: Present when the poster image has successfully loaded.
- `img-error:ignore`: Present when the poster image has failed to load.

```html
<!-- Example. -->
<vds-poster img-loading />
```

You can use these attributes to further style the poster as it's being loaded such as
showing a loading visual (skeleton animation), or replacing the poster with a default visual
when the image fails to load.

```css
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

In the following code snippets, we put together a poster with a big play button on top, once
playback starts they'll both fade out.

<slot name="styling" />

```css:copy
vds-poster {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
}

/* Hide poster if it fails to load. */
/* It'd be better if we replaced it with something else. */
vds-poster[img-error] {
	display: none;
}

.big-play-button-container {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	transition: opacity 300ms ease-in;
	z-index: 1; /** Above `vds-poster`. */
}

.big-play-button-container .play-icon {
	color: white;
	width: 56px;
	height: 56px;
}

/* Show when media is ready. */
[media-can-play] .big-play-button-container {
	opacity: 1;
}

/* Hide when playback starts. */
[media-started] vds-poster,
[media-started] .big-play-button-container {
	opacity: 0;
	pointer-events: none;
}
```
