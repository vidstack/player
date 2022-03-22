---
description: Introduction to styling Vidstack Player.
---

# Player Styling

:::tip
Remove the `controls` attribute we added in the install step if you're building a custom UI to
avoid double controls (i.e., native and custom).
:::

All UI elements in the library are headless, meaning they contain no styling out of the box. It's
up to you how they look, as they only provide some core functionality. For example,
the `vds-play-button` element will dispatch play and pause requests when pressed, but other than
that, it is completely blank.

## Media UI

The player exposes media state as attributes and CSS variables on the `vds-media-ui` element:

```html
<vds-video-player src="...">
  <vds-media-ui
    media-paused
    media-waiting
    media-can-play
    ...
    style="--media-current-time: 500; --media-duration: 1000; ..."
  >
    <!-- ... -->
  </vds-media-ui>
</vds-video-player>
```

You can use the presence and absence of these attributes to style children of the
`<vds-media-ui>` element with CSS. Here's a quick example where we add a controls container and
hide it based on some media state:

```html:title=player.html
<vds-media-ui>
	<div class="controls">
		<vds-play-button></vds-play-button>
		<!-- ... -->
	</div>
</vds-media-ui>
```

```css:title=player.css
.controls {
	display: flex;
	opacity: 1;
	width: 100%;
	transition: opacity ease 300ms;
}

/*
 * Hide controls if either media is idle (no user activity), or media is
 * not ready for playback.
 */
[media-idle] > .controls,
:not([media-can-play]) > .controls {
	opacity: 0;
}
```

[`[attr]`](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) selects
elements based on the presence or value of an attribute, and the [`:not()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:not)
pseudo-class represents elements that do _not_ match a list of selectors. We can combine these to
create powerful selectors based on the media state being updated on the `vds-media-ui` element.

## Media Attributes

Here's a reference table that displays all the media attributes that are set on the `vds-media-ui`
element.

<script>
import MediaAttrsTable from '$components/reference/MediaAttrsTable.md';
</script>

<MediaAttrsTable  />

## Media CSS Variables

Here's a reference table that displays all the media CSS variables that are set on the `vds-media-ui`
element.

<script>
import MediaVarsTable from '$components/reference/MediaVarsTable.md';
</script>

<MediaVarsTable />
