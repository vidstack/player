# vds-mute-toggle

A control for toggling the muted state of the player.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-mute-toggle>
  <!-- Showing -->
  <div slot="mute"></div>
  <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
  <div slot="unmute" hidden></div>
</vds-mute-toggle>
```

## Properties

| Property                     | Description                                                                              | Type                 | Default  |
| ---------------------------- | ---------------------------------------------------------------------------------------- | -------------------- | -------- |
| `describedBy`                | ♿ **ARIA:** Identifies the element (or elements) that describes the underlying control. | `string ∣ undefined` |          |
| `disabled`                   | Whether the underlying control should be disabled (not-interactable).                    | `boolean`            | `false`  |
| `label` _(required)_         | ♿ **ARIA:** The `aria-label` property of the underlying playback control.               | `string`             | `'Mute'` |
| `on`                         | Whether the toggle is in the `on` state.                                                 | `boolean`            | `false`  |
| `parts` _(readonly/static)_  |                                                                                          | `string[]`           |          |
| `rootElement` _(readonly)_   | The component's root element.                                                            | `Control`            |          |
| `styles` _(readonly/static)_ |                                                                                          | `CSSResultArray`     |          |

## Slots

| Slot       | Description                                            |
| ---------- | ------------------------------------------------------ |
| `"mute"`   | The content to show when the `muted` state is `false`. |
| `"unmute"` | The content to show when the `muted` state is `true`.  |

## CSS Parts

| Name        | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| `control`   | The root control (`<vds-control>`).                                                   |
| `control-*` | All `vds-control` parts re-exported with the `control` prefix such as `control-root`. |
