---
description: This component is used to display the current value of a slider in various formats such as a raw value, percentage, or time.
---

## Usage

The `<vds-slider-value-text>` component displays the current value of a parent slider, or the
value at the device pointer (e.g., the position at which the user is hovering their mouse over
the slider).

The value can be displayed as a:

- Value (e.g., `70`),
- Percentage: uses the slider's current and max value (e.g., `70%`),
- Time: uses the slider's current value, assuming seconds (e.g., value of `70` = `1:10`).

<slot name="usage" />

The `<vds-slider-value-text>` component can be combined with the `<vds-time-slider>` to
display the current time as the user hovers over the scrubber:

<slot name="time-slider" />

Or, with the `<vds-volume-slider>` to display the current volume:

<slot name="volume-slider" />

## Styling

In the following example, we add a small tooltip that displays the current time the user is
hovering over above the slider:

:::stackblitz_example name="styling"
:::
