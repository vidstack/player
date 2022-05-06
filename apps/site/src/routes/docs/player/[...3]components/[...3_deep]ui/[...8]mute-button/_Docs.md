---
description: This component is used to mute and unmute media.
---

## Usage

The `<vds-mute-button>` component will toggle the `muted` state of media as it's pressed by
dispatching a `vds-mute-request:ignore`, and `vds-unmute-request:ignore` event to the media
controller.

<slot name="usage" />

```css copy
/* Hide mute text when media _is_ muted. */
vds-media[muted] .media-mute {
  display: none;
}

/* Hide unmute text when media _is not_ muted. */
vds-media:not([muted]) .media-unmute {
  display: none;
}
```

## Styling

Here's a styled `<vds-mute-button>` example containing a mute and unmute icon:

:::stackblitz_example name="styling"
:::
