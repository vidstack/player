## Usage

We don't provide a controls component out of the box because you can easily create one with
some HTML, CSS, and [media attributes](../../../getting-started/styling.md#media-attributes).

The following media attributes can be useful when building a controls container:

| Attribute                     | Use-Case                                                                    |
| ----------------------------- | --------------------------------------------------------------------------- |
| `media-autoplay-error:ignore` | Show controls when autoplay fails so the user can start playback manually.  |
| `media-can-load:ignore`       | Show controls skeleton while media is loading.                              |
| `media-can-play:ignore`       | Hide controls while media is not ready for playback.                        |
| `media-can-idle:ignore`       | Hide controls while media is idle (i.e., user is not active).               |
| `media-can-started:ignore`    | Hide controls after media has started (e.g., hide initial big play button). |
| `media-can-fullscreen:ignore` | Show alternative controls for when media is in fullscreen.                  |

```css:copy
/* Hide controls while media is loading, or user is idle. */
:not([media-can-play]) .controls,
[media-idle] .controls {
	opacity: 0;
}

/* Show controls if autoplay fails. */
[media-autoplay-error] .controls {
	opacity: 1;
}
```

## Styling

In the following example, we create a conventional three-tier (top/middle/bottom) set of controls. You
could put place social icons at the top, play button in the middle, and scrubber at the bottom. It's
completely up to you!

We're using the `media-idle:ignore` and `media-can-play:ignore` attributes in this example to
hide the controls if media is not ready for playback, or the user is idle.

<slot name="styling" />

```css:copy
.controls-container {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* prevent blocking lower elements (e.g., gestures). */
	pointer-events: none;
	/** place above poster (optional). */
	z-index: 1;
}

.controls {
	display: flex;
	width: 100%;
	opacity: 1;
	transition: opacity 200ms ease;
	/** prevent clicks triggering lower elements. */
	pointer-events: auto;
}

.controls.top {
	align-self: flex-start;
}

.controls.middle {
	align-self: center;
}

.controls.bottom {
	align-self: flex-end;
}

/* Hide controls if media is not ready for playback, or user is idle. */
[media-idle] .controls,
:not([media-can-play]) .controls {
	opacity: 0;
	visibility: hidden;
}
```
