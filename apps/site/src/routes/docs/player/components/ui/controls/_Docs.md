## Usage

We don't provide a controls component out of the box because you can easily create one with
some HTML, CSS, and [media attributes](../../../getting-started/styling.md#media-attributes).

The following media attributes can be useful when building a controls container:

| Attribute               | Use-Case                                                                    |
| ----------------------- | --------------------------------------------------------------------------- |
| `autoplay-error:ignore` | Show controls when autoplay fails so the user can start playback manually.  |
| `can-load:ignore`       | Show controls skeleton while media is loading.                              |
| `can-play:ignore`       | Hide controls while media is not ready for playback.                        |
| `user-idle:ignore`      | Hide controls while media is idle (i.e., user is not active).               |
| `can-started:ignore`    | Hide controls after media has started (e.g., hide initial big play button). |
| `can-fullscreen:ignore` | Show alternative controls for when media is in fullscreen.                  |

```css:copy
/* Hide controls while media is loading, or user is idle. */
vds-media:not([can-play]) .media-controls,
vds-media[user-idle] .media-controls {
	opacity: 0;
}

/* Show controls if autoplay fails. */
vds-media[autoplay-error] .media-controls {
	opacity: 1;
}
```

## Styling

In the following example, we create a conventional three-tier (top/middle/bottom) set of controls. You
could put place social icons at the top, play button in the middle, and scrubber at the bottom. It's
completely up to you!

We're using the `user-idle:ignore` and `can-play:ignore` attributes in this example to
hide the controls if media is not ready for playback, or the user is idle.

<slot name="styling" />

```css:copy
.media-controls-container {
	position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* prevent blocking lower elements (e.g., gestures). */
	pointer-events: none;
	/** place above poster (optional). */
	z-index: 1;
}

.media-controls {
	display: flex;
	width: 100%;
  min-height: 48px;
	opacity: 1;
	transition: opacity 200ms ease;
	/** prevent clicks triggering lower elements. */
	pointer-events: auto;
}

/* Avoid double controls on iOS Safari. */
vds-media[hide-ui] .media-controls,
/* Hide controls if media is not ready for playback, or user is idle. */
vds-media[user-idle] .media-controls,
vds-media:not([can-play]) .media-controls {
	opacity: 0;
	visibility: hidden;
}
```
