# vds-toggle

A toggle component to render different state depending on whether it's `on` or `off`. This
component will always render both the `on` and `off` slots regardless of the current
state so you can perform CSS animations. A `hidden` attribute will be applied to the slot
that's currently `off`.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-toggle on>
  <!-- Showing -->
  <div slot="on"></div>
  <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
  <div slot="off" hidden></div>
</vds-toggle>
```

## Properties

| Property                     | Description                              | Type             | Default     |
| ---------------------------- | ---------------------------------------- | ---------------- | ----------- |
| `on`                         | Whether the toggle is in the `on` state. | `boolean`        | `false`     |
| `styles` _(readonly/static)_ |                                          | `CSSResultArray` | `undefined` |

## Slots

| Slot    | Description                                   |
| ------- | --------------------------------------------- |
| `"off"` | The content to show when the toggle is `off`. |
| `"on"`  | The content to show when the toggle is `on`.  |
