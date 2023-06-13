---
title: Outlet
description: This component is used as a render target for the current provider.
---

## Usage

The `$tag:media-outlet` component serves as a render target for providers and gives you complete
control of where the provider will be rendered in the DOM. For example, the
`VideoProvider` will render the HTML `<video>` element inside of it.

In a typical video player setup, you'll place the outlet directly in the player and overlay
some UI (e.g., controls) over it like so:

{% code_snippets name="usage" css=true copy=true /%}

## Layouts

The media outlet makes it simple to create player layouts that can be swapped between since you
have control of where the provider will be rendered. You can adapt layouts based on the current
device (e.g., mobile/desktop), media type (e.g., audio/video/live), modes (e.g., focus/theatre), etc.

Do note, the aspect ratio setting on the player is only applied to the `$tag:media-outlet`
component so any UI elements outside will be unaffected.

{% code_snippets name="layouts" copy=true /%}

{% callout type="info" %}
The layouts example above is mostly for demonstration of how media outlet's can be used, but similar
layouts can also be achieved with CSS. Try to always start with CSS; only switch to a JS-based solution
if you hit a wall.

```css
media-player[data-live] {
}

media-player:not([data-live]) {
}
```

{% /callout %}

## Slotting

Arbitrary content can be inserted inside the provider output by placing it inside the media outlet
and positioning it with CSS. This can be useful if parts of the media UI such as controls live
outside the provider region.

{% code_preview name="slotting" copy=true highlight="html:2-5|react:6-9" /%}

## Moving

The media outlet can be safely detached from the player and moved around the DOM after it has
connected. This can be useful for creating floating, popout, and mini players.

{% code_preview name="moving" size="large" css=true copy=true /%}
