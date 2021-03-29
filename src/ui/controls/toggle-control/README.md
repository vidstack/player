# vds-toggle-control

The foundation for any toggle control such as a `playback-toggle` or `mute-toggle`.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-toggle-control label="Some action">
  <!-- Showing -->
  <div slot="on"></div>
  <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
  <div slot="off" hidden></div>
</vds-toggle-control>
```

## Properties

| Property                     | Description                                                                              | Type                 | Default     |
| ---------------------------- | ---------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `describedBy`                | ♿ **ARIA:** Identifies the element (or elements) that describes the underlying control. | `string ∣ undefined` | `undefined` |
| `disabled`                   | Whether the underlying control should be disabled (not-interactable).                    | `boolean`            | `false`     |
| `label` _(required)_         | ♿ **ARIA:** The `aria-label` property of the underlying playback control.               | `string ∣ undefined` | `undefined` |
| `on`                         | Whether the toggle is in the `on` state.                                                 | `boolean`            | `false`     |
| `parts` _(readonly/static)_  |                                                                                          | `string[]`           | `undefined` |
| `rootElement` _(readonly)_   | The component's root element.                                                            | `Control`            | `undefined` |
| `styles` _(readonly/static)_ |                                                                                          | `CSSResultArray`     | `undefined` |

## CSS Parts

| Name        | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| `control`   | The root control (`<vds-control>`).                                                   |
| `control-*` | All `vds-control` parts re-exported with the `control` prefix such as `control-root`. |
