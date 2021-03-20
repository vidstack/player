# UI Design Patterns

## Functional Components

Functional components are naked (no styling) and only contain logic for accessbility and
core functionality. This gives consumers complete freedom to style the component as they desire.
For example, a `ToggleMuteControl` will only contain the logic for toggling the muted state of the
player, and handling ARIA attributes on the button.

Functional components are made possible thanks to the `<slot />` element and
[CSS parts][mdn-css-part]. Following the `ToggleMuteControl` example, it may create CSS parts
such as `mute-control`, `unmute-control` to enable consumers to style the component from the
light DOM.

[mdn-css-parts]: https://developer.mozilla.org/en-US/docs/Web/CSS/::part

### Multiple States

If a functional component contains logic for multiple states then multiple `<slot />` elements can
be used. For example, a Toggle might have a `on` and `off` state which would translate to
`<slot name="on" />` and `<slot name="off" />`. Keep in mind, both slots should be rendered to
enable the consumer to style transitions between states.

### Dynamic Styling

A component may be styled based on some dynamic value. For example, styling a Scrubber
might require a `background-fill` based on the % of the video that's seekable. This can be
solved with [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*). In this
example a `--vds-scrubber-seekable-percent` property could be exposed to enable the consumer to
achieve the styling they desire.
