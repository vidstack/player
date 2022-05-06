---
description: This component is used to enter and exit fullscreen.
---

## Usage

:::admonition type="danger"
The `hidden` attribute will be present on this element in the event fullscreen cannot be
requested (not supported by environment or provider). The button's `display` property will be
set to `none`, so it'll be removed from the layout; therefore, you should account for the button
not being displayed in your design.
:::

The `<vds-fullscreen-button>` component will toggle the `fullscreen` state of media as it's pressed by
dispatching a `vds-enter-fullscreen-request:ignore`, and `vds-exit-fullscreen-request:ignore`
event to the media controller.

<slot name="usage" />

```css copy
/* Hide enter fullscreen text when media _is_ fullscreen. */
vds-media[fullscreen] .media-enter-fs {
  display: none;
}

/* Hide exit fullscreen text when media _is not_ fullscreen. */
vds-media:not([fullscreen]) .media-exit-fs {
  display: none;
}
```

### Fullscreen Target

By default, the `<vds-fullscreen-button>` component will fire a request to enter fullscreen
on the current media (i.e., `<vds-media>`). The request handler will naturally fallback to the current
media provider (e.g., `<vds-video>`) if the native
[Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) is not available.

You can specify that you only want to display the provider in fullscreen and not the entire media
like so:

<slot name="fullscreen-target" />

:::admonition type="warning"
By setting `fullscreen-target` to `provider`, the controller will only request fullscreen on the
media provider element, meaning your custom UI will _not_ be displayed when in fullscreen.
:::

### Avoiding Double Controls (iOS)

The native media controls can not be hidden on iOS when in fullscreen mode even if the `controls`
property is not set. We recommend hiding them to avoid double controls by using the
`hide-ui:ignore` attribute on the `vds-media:ignore` element.

```css
/* Avoid double controls on iOS when in fullscreen. */
vds-media[hide-ui] .media-controls {
  opacity: 0;
  visibility: hidden;
}
```

## Styling

Here's a styled `<vds-fullscreen-button>` example containing enter and exit fullscreen icons:

:::stackblitz_example name="styling"
:::
