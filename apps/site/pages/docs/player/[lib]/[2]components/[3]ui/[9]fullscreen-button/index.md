---
description: This component is used to enter and exit fullscreen.
---

## Usage

The `$tag:vds-fullscreen-button` component will toggle the `fullscreen` state of media as it's
pressed by dispatching a `vds-enter-fullscreen-request`, and `vds-exit-fullscreen-request`
event to the media controller.

{% code_snippets name="usage" css=true copyHighlight=true highlight="html:3-6|react:7-10" /%}

{% callout type="danger" %}
The `hidden` attribute will be present on this element in the event fullscreen cannot be
requested (not supported by environment or provider). The button's `display` property will be
set to `none`, so it'll be removed from the layout; therefore, you should account for the button
not being displayed in your design.
{% /callout %}

### Fullscreen Target

By default, the `$tag:vds-fullscreen-button` component will fire a request to enter fullscreen
on the current media (i.e., `$tag:vds-media`). The request handler will naturally fallback to the
current media provider if the native
[Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) is not available.

You can specify that you only want to display the provider in fullscreen and not the entire media
like so:

{% code_snippet name="fullscreen-target" /%}

{% callout type="warning" %}
By setting `fullscreen-target` to `provider`, the controller will only request fullscreen on the
media provider element, meaning your custom UI will _not_ be displayed when in fullscreen.
{% /callout %}

### Avoiding Double Controls (iOS)

The native media controls can not be hidden on iOS when in fullscreen mode even if the `controls`
property is not set. We recommend hiding them to avoid double controls by using the
`hide-ui` attribute on the `vds-media` element.

```css {% copy=true %}
/* Avoid double controls on iOS when in fullscreen. */
vds-media[hide-ui] .media-controls {
  opacity: 0;
  visibility: hidden;
}
```

## Styling

Here's a simple styled `$tag:vds-fullscreen-button` example containing a enter and exit icons:

{% code_preview name="styling" size="medium" css=true copyHighlight=true highlight="html:3-16|react:7-20" /%}
