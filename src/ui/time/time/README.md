# vds-time

Formats and displays a length of time given in `seconds`.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-time seconds="50"></vds-time>
```

```html
<vds-time
  label="Current time"
  seconds="3650"
  pad-hours
  always-show-hours
></vds-time>
```

```css
vds-time::part(root) {
  font-size: 16px;
}
```

## Properties

| Property                     | Description                                                                               | Type                 | Default |
| ---------------------------- | ----------------------------------------------------------------------------------------- | -------------------- | ------- |
| `alwaysShowHours`            | Whether the time should always show the hours unit, even if the time is less than 1 hour. | `boolean`            | `false` |
| `label`                      | ♿ **ARIA:** The `aria-label` property of the time.                                       | `string ∣ undefined` |         |
| `padHours`                   | Whether the hours unit should be padded with zeroes to a length of 2.                     | `boolean`            | `false` |
| `parts` _(readonly/static)_  |                                                                                           | `string[]`           |         |
| `rootElement` _(readonly)_   | The component's root element.                                                             | `HTMLTimeElement`    |         |
| `seconds`                    | The length of time in seconds.                                                            | `number`             | `0`     |
| `styles` _(readonly/static)_ |                                                                                           | `CSSResultArray`     |         |

## CSS Parts

| Name   | Description                              |
| ------ | ---------------------------------------- |
| `root` | The component's root element (`<time>`). |
