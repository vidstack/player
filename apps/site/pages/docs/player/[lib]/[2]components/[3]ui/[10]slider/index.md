---
description: This component is used to create an input for controlling a range of values (e.g., media volume or time).
---

## Usage

The `$tag:vds-slider` component is a custom-built range input (`input[type="range"]`) that is
cross-browser friendly, ARIA friendly, mouse/touch-friendly and easily style-able. The slider
allows users to input numeric values between a minimum and maximum value.

Other sliders in the library such as `$tag:vds-time-slider` and `$tag:vds-volume-slider` extend the
`$tag:vds-slider` component with additional functionality based on their use-case. All
documentation on this page, particularly around styling, is perfectly valid for building out
_any_ slider.

{% code_snippet name="usage" /%}

## Styling

### Attributes

The attributes listed in the table below are applied to a slider element when valid. You can
use the presence, or absence of these attributes to style the slider and any of it's children as
desired. See the [example](#example) below.

| Attribute     | Description                                           |
| ------------- | ----------------------------------------------------- |
| `dragging`    | Slider thumb is currently being dragged.              |
| `pointing`    | Device pointer (mouse/touch) is within slider bounds. |
| `interactive` | Either dragging or pointing is true.                  |

```html
<vds-slider dragging interactive />
```

### CSS Variables

The CSS variables listed in the table below can be used to style your own slider. The `fill`
variables represent the current value, and the `pointer` variables represent the current value
at the device pointer (mouse/thumb).

| Variable                | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `--vds-fill-value`      | Slider fill amount (e.g., `30`).                           |
| `--vds-fill-rate`       | The fill value expressed as a ratio (e.g., `0.3`).         |
| `--vds-fill-percent`    | The fill rate expressed as a percentage (e.g., `30%`).     |
| `--vds-pointer-value`   | Fill amount up to the device pointer (e.g., `30`).         |
| `--vds-pointer-rate`    | The pointer value expressed as a ratio (e.g., `0.3`).      |
| `--vds-pointer-percent` | The pointer rate expressed as a percentage. (e.g., `30%`). |

### Example

The following example showcases how to build a conventional-looking slider with a track and thumb:

{% code_preview name="styling" css=true size="xsmall" copyHighlight=true highlight="react:5-11" /%}

{% callout type="tip" %}
You can take this example even further by reading through the [`<vds-slider-value-text>`](/docs/player/components/ui/slider-value-text/),
and [`<vds-slider-video>`](/docs/player/components/ui/slider-video/) docs when you're ready.
{% /callout %}

## Tailwind

The following section is for Tailwind CSS users who have installed our [Tailwind Plugin](/docs/player/getting-started/styling/tailwind.html).

### Variants {% id="tw-variants" %}

All the [attributes listed above](#attributes) are exposed as variants:

```html
<div class="pointing:bg-indigo-300 dragging:bg-indigo-500" />
```

### CSS Variables {% id="tw-css-vars" %}

You can take advantage of [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
if you're using Tailwind CSS v3+ and use the [CSS variables listed above](#css-variables).

```html
<div class="left-[var(--vds-fill-percent)]" />
```

### Example {% id="tw-example" %}

The following example showcases a slider with a thumb inside positioned at the current value
(indicated by the `--vds-fill-percent` variable). When the device pointer enters the slider,
or the thumb begins to be dragged (indicated by the `interactive` variant), we pin the thumb to the
device pointer position.

{% code_snippet name="tw-example" copy=true /%}
