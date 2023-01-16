---
description: This component is used to mute and unmute media.
---

## Usage

The `$tag:vds-mute-button` component will toggle the `muted` state of media as it's pressed by
dispatching a `media-mute-request`, and `media-unmute-request` event to the media controller.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:6" /%}

## Styling

You can override the default styles with CSS like so:

```css
vds-mute-button {
  color: pink;
  transition: opacity 0.2s ease-in;
}

/* Apply styles when media is muted. */
vds-mute-button[muted] {
}

/* Apply styles when media is _not_ muted. */
vds-mute-button:not([muted]) {
}

/* Apply styles when media volume is low (0% < x < 50%). */
vds-mute-button[volume-low] {
}

/* Apply styles when media volume is high (≥50%). */
vds-mute-button[volume-high] {
}

/* Style default icons. */
vds-mute-button [slot='volume-muted'] {
}
vds-mute-button [slot='volume-low'] {
}
vds-mute-button [slot='volume-high'] {
}
```

## Custom Icons

Here's an example containing custom muted and volume icons:

{% code_snippet name="custom-icons" copyHighlight=true highlight="html:3-13|react:6-10" /%}
