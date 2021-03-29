# vds-playback-toggle

A control for toggling the playback state (play/pause) of the current media.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-playback-toggle>
  <!-- Showing -->
  <div slot="play"></div>
  <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
  <div slot="pause" hidden></div>
</vds-playback-toggle>
```

## Properties

| Property                     | Description                                                                              | Type                 | Default     |
| ---------------------------- | ---------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `describedBy`                | ♿ **ARIA:** Identifies the element (or elements) that describes the underlying control. | `string ∣ undefined` | `undefined` |
| `disabled`                   | Whether the underlying control should be disabled (not-interactable).                    | `boolean`            | `false`     |
| `label` _(required)_         | ♿ **ARIA:** The `aria-label` property of the underlying playback control.               | `string`             | `'Play'`    |
| `on`                         | Whether the toggle is in the `on` state.                                                 | `boolean`            | `false`     |
| `parts` _(readonly/static)_  |                                                                                          | `string[]`           | `undefined` |
| `rootElement` _(readonly)_   | The component's root element.                                                            | `Control`            | `undefined` |
| `styles` _(readonly/static)_ |                                                                                          | `CSSResultArray`     | `undefined` |

## Slots

| Slot      | Description                                             |
| --------- | ------------------------------------------------------- |
| `"pause"` | The content to show when the `paused` state is `false`. |
| `"play"`  | The content to show when the `paused` state is `true`.  |

## CSS Parts

| Name        | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| `control`   | The root control (`<vds-control>`).                                                   |
| `control-*` | All `vds-control` parts re-exported with the `control` prefix such as `control-root`. |
