# vds-time-progress

Formats and displays the progression of playback. The output is displayed as
`{currentTime}{timeSeparator}{duration}`.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-time-progress
  current-time-label="Current time"
  duration-label="Duration"
  pad-hours
  always-show-hours
></vds-time-progress>
```

```css
vds-time-progress::part(current-time) {
  font-size: 16px;
}

vds-time-progress::part(duration) {
  font-size: 16px;
}

vds-time-progress::part(separator) {
  margin: 0 2px;
  font-size: 16px;
}
```

## Properties

| Property                        | Description                                                                               | Type              | Default           |
| ------------------------------- | ----------------------------------------------------------------------------------------- | ----------------- | ----------------- |
| `alwaysShowHours`               | Whether the time should always show the hours unit, even if the time is less than 1 hour. | `boolean`         | `false`           |
| `currentTimeLabel`              | ♿ **ARIA:** The `aria-label` property for the current time.                              | `string`          | `'Current time'`  |
| `durationLabel`                 | ♿ **ARIA:** The `aria-label` property for the duration.                                  | `string`          | `'Duration'`      |
| `padHours`                      | Whether the hours unit should be padded with zeroes to a length of 2.                     | `boolean`         | `false`           |
| `parts` _(readonly/static)_     |                                                                                           | `string[]`        |                   |
| `rootElement` _(readonly)_      | The component's root element.                                                             | `HTMLDivElement`  | `HTMLDivElement`  |
| `separatorElement` _(readonly)_ | The separator element.                                                                    | `HTMLSpanElement` | `HTMLSpanElement` |
| `styles` _(readonly/static)_    |                                                                                           | `CSSResultArray`  |                   |
| `timeCurrent` _(readonly)_      | The underlying `vds-time-current` component.                                              | `TimeCurrent`     | `TimeCurrent`     |
| `timeDuration` _(readonly)_     | The underlying `vds-time-duration` component.                                             | `TimeDuration`    | `TimeDuration`    |
| `timeSeparator`                 | A string that is used to separate the current time and duration.                          | `string`          | `'/'`             |

## CSS Parts

| Name             | Description                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `current-time`   | The `vds-time-current` component.                                                            |
| `current-time-*` | All `vds-time` parts re-exported with the `current-time` prefix such as `current-time-root`. |
| `duration`       | The `vds-time-duration` component.                                                           |
| `duration-*`     | All `vds-time` parts re-exported with the `duration` prefix such as `duration-root`.         |
| `root`           | The component's root element (`<div>`).                                                      |
| `separator`      | The time separator element (`<span>`).                                                       |
