# vds-time-duration

Formats and displays the `duration` of the current media. Do not mess with the component's
`seconds` property as it's automatically managed.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-time-duration
  label="Duration"
  pad-hours
  always-show-hours
></vds-time-duration>
```

```css
vds-time-duration::part(root) {
  font-size: 16px;
}
```

## Properties

| Property                     | Description                                                                               | Type                 | Default     |
| ---------------------------- | ----------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `alwaysShowHours`            | Whether the time should always show the hours unit, even if the time is less than 1 hour. | `boolean`            | `false`     |
| `label`                      | ♿ **ARIA:** The `aria-label` property of the time.                                       | `string ∣ undefined` | `undefined` |
| `padHours`                   | Whether the hours unit should be padded with zeroes to a length of 2.                     | `boolean`            | `false`     |
| `parts` _(readonly/static)_  |                                                                                           | `string[]`           |             |
| `rootElement` _(readonly)_   | The component's root element.                                                             | `HTMLTimeElement`    |             |
| `seconds`                    | The length of time in seconds.                                                            | `number`             | `0`         |
| `styles` _(readonly/static)_ |                                                                                           | `CSSResultArray`     |             |

## CSS Parts

| Name   | Description                              |
| ------ | ---------------------------------------- |
| `root` | The component's root element (`<time>`). |

## Dependencies

### Used by

- [vds-time-progress](../time-progress)
