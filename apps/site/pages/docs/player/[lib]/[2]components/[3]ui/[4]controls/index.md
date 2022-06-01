---
description: This page showcases how to create a container for a collection of media controls.
---

## Usage

We don't provide a controls component out of the box because you can easily create one with
some HTML, CSS, and [media attributes](/docs/player/getting-started/styling/#media-attributes).

The following media attributes can be useful when building a controls container:

| Attribute        | Use-Case                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| `autoplay-error` | Show controls when autoplay fails so the user can start playback manually.  |
| `can-load`       | Show controls skeleton while media is loading.                              |
| `can-play`       | Hide controls while media is not ready for playback.                        |
| `user-idle`      | Hide controls while media is idle (i.e., user is not active).               |
| `can-started`    | Hide controls after media has started (e.g., hide initial big play button). |
| `can-fullscreen` | Show alternative controls for when media is in fullscreen.                  |

```css {% copy=true %}
/* Avoid double controls on iOS when in fullscreen. */
vds-media[hide-ui] .media-controls,
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
could place social icons at the top, play button in the middle, and scrubber at the bottom. It's
completely up to you!

We're using the `user-idle` and `can-play` attributes in this example to hide the controls if media
is not ready for playback, or the user is idle.

{% code_preview name="styling" size="medium" css=true copyHighlight=true highlight="html:3-7|react:7-11" /%}
