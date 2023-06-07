---
description: This page showcases how to create a container for a collection of media controls.
---

## Usage

We don't provide a controls component out of the box because you can easily create one with
some HTML, CSS, and [media attributes](/docs/player/components/media/player#data-attributes).

The following media data attributes can be useful when building a controls container:

| Attribute             | Use-Case                                                                    |
| --------------------- | --------------------------------------------------------------------------- |
| `data-autoplay-error` | Show controls when autoplay fails so the user can start playback.           |
| `data-can-load`       | Show controls skeleton while media is loading.                              |
| `data-can-play`       | Hide controls while media is not ready for playback.                        |
| `data-user-idle`      | Hide controls while media is idle (i.e., user is not active).               |
| `data-started`        | Hide controls after media has started (e.g., hide initial big play button). |
| `data-can-fullscreen` | Show alternative controls for when media is in fullscreen.                  |

```css {% copy=true %}
/* Avoid double controls on iOS when in fullscreen. */
media-player[data-ios-controls] .media-controls,
/* Hide controls while media is loading, or user is idle. */
media-player:not([data-can-play]) .media-controls,
media-player[data-user-idle] .media-controls {
  opacity: 0;
  pointer-events: none;
}

/* Show controls if autoplay fails. */
media-player[data-autoplay-error] .media-controls {
  opacity: 1;
}
```

## Styling

In the following example, we create a conventional three-tier (top/middle/bottom) set of controls. You
could place social icons at the top, play button in the middle, and scrubber at the bottom. It's
completely up to you!

{% code_preview name="styling" size="medium" css=true copyHighlight=true highlight="html:3-7|react:7-11" /%}

## Tailwind

The [styling](#styling) example above built with Tailwind:

{% code_snippet name="tailwind" copy=true /%}

## Examples

See the media outlet docs for additional examples:

- [Layouts](/docs/react/player/components/media/outlet#layouts)
- [External Controls](/docs/react/player/components/media/outlet#slotting)
