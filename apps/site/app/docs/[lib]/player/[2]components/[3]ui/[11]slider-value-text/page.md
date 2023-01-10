---
description: This component is used to display the current value of a slider in various formats such as a raw value, percentage, or time.
---

## Usage

The `$tag:vds-slider-value-text` component displays the current value of a parent slider, or the
value at the device pointer (e.g., the position at which the user is hovering their mouse over
the slider).

The value can be displayed as a:

- `value` (e.g., `70`),
- `percent`: uses the slider's current and max value (e.g., `70%`),
- `time`: uses the slider's current value, assuming seconds (e.g., value of `70` = `1:10`).

{% code_snippet name="usage" copyHighlight=true highlight="html:2|react:5-7" /%}

The `$tag:vds-slider-value-text` component can be combined with the `$tag:vds-time-slider` to
display the current time as the user hovers over the scrubber:

{% code_snippet name="time-slider" copyHighlight=true highlight="html:3-5|react:7-9" /%}

Or, with the `$tag:vds-volume-slider` to display the current volume:

{% code_snippet name="volume-slider" copyHighlight=true highlight="html:3-5|react:7-9" /%}

## Styling

In the following example, we add a small tooltip that displays the current time the user is
hovering over above the slider:

{% code_preview name="styling" css=true size="medium" copyHighlight=true highlight="html:3-15|react:7-19" /%}
