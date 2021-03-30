# vds-fullscreen-toggle

A control for toggling the fullscreen mode of the player.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-fullscreen-toggle>
  <!-- Showing -->
  <div slot="enter"></div>
  <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
  <div slot="exit" hidden></div>
</vds-fullscreen-toggle>
```

## Properties

| Property                     | Description                                                                              | Type                 | Default        |
| ---------------------------- | ---------------------------------------------------------------------------------------- | -------------------- | -------------- |
| `describedBy`                | ♿ **ARIA:** Identifies the element (or elements) that describes the underlying control. | `string ∣ undefined` |                |
| `disabled`                   | Whether the underlying control should be disabled (not-interactable).                    | `boolean`            | `false`        |
| `label` _(required)_         | ♿ **ARIA:** The `aria-label` property of the underlying playback control.               | `string`             | `'Fullscreen'` |
| `on`                         | Whether the toggle is in the `on` state.                                                 | `boolean`            | `false`        |
| `parts` _(readonly/static)_  |                                                                                          | `string[]`           |                |
| `rootElement` _(readonly)_   | The component's root element.                                                            | `Control`            |                |
| `styles` _(readonly/static)_ |                                                                                          | `CSSResultArray`     |                |

## Slots

| Slot      | Description                                                 |
| --------- | ----------------------------------------------------------- |
| `"enter"` | The content to show when the `fullscreen` state is `false`. |
| `"exit"`  | The content to show when the `fullscreen` state is `true`.  |

## CSS Parts

| Name        | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| `control`   | The root control (`<vds-control>`).                                                   |
| `control-*` | All `vds-control` parts re-exported with the `control` prefix such as `control-root`. |
