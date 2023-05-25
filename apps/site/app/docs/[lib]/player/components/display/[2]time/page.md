---
description: This component is used to display certain media states as a unit of time, such as the current time or duration.
---

## Usage

The `$tag:media-time` component displays time formatted text (e.g., `01:30` represents 1 minute
30 seconds). The time can be based on either the current time, buffered amount, seekable amount,
or duration.

{% code_snippet name="usage" copyHighlight=true highlight="html:3|react:7" /%}

The `type` property can be set to:

- `current`: The current playback time.
- `buffered`: The buffered amount of media.
- `duration`: The total length of media.

{% code_preview name="demo" size="medium" /%}

## Remaining Time

You can use the `remainder` property to display the duration minus the selected `type`.

{% code_snippet name="remainder" copyHighlight=true highlight="html:4|react:8" /%}

## Styling

### CSS Variables

The following snippet contains a complete list of CSS variables and their default values. Any
of the variables can be set to adjust the default time styles:

```css {% copy=true %}
media-player {
  --media-time-font-size: 14px;
  --media-time-font-weight: 500;
  --media-font-family: sans-serif;
  --media-time-color: inherit;
  --media-time-bg: unset;
  --media-time-border-radius: unset;
  --media-time-letter-spacing: 0.025em;
}
```
