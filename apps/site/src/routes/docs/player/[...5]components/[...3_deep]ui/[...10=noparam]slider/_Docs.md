---
description: This component is used to create an input for controlling a range of values (e.g., media volume or time).
---

## Usage

The `<vds-slider>` component is a custom-built range input (`input[type="range"]`) that is cross-browser
friendly, ARIA friendly, mouse/touch-friendly and easily style-able. The slider allows users
to input numeric values between a minimum and maximum value.

Other sliders in the library such as `<vds-time-slider>` and `<vds-volume-slider>` extend the
`<vds-slider>` component with additional functionality based on their use-case. All documentation on
this page, particularly around styling, is perfectly valid for building out _any_ slider.

<slot name="usage" />

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

| Variable                       | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| `--vds-fill-value:ignore`      | Slider fill amount (e.g., `30`).                           |
| `--vds-fill-rate:ignore`       | The fill value expressed as a ratio (e.g., `0.3`).         |
| `--vds-fill-percent:ignore`    | The fill rate expressed as a percentage (e.g., `30%`).     |
| `--vds-pointer-value:ignore`   | Fill amount up to the device pointer (e.g., `30`).         |
| `--vds-pointer-rate:ignore`    | The pointer value expressed as a ratio (e.g., `0.3`).      |
| `--vds-pointer-percent:ignore` | The pointer rate expressed as a percentage. (e.g., `30%`). |

### Example

The following example showcases how to build a conventional-looking slider with a track and thumb:

:::stackblitz_example name="styling"
:::

:::admonition type="tip"
You can take this example even further by reading through the [`<vds-slider-value-text>`](../slider-value-text/index.md),
and [`<vds-slider-video>`](../slider-video/index.md) docs when you're ready.
:::

## Tailwind

The following section is for Tailwind CSS users who have installed our [Tailwind Plugin](../../../libraries/tailwind.md).

### Variants

All the [attributes listed above](#attributes) are exposed as variants:

<slot name="tw-variants" />

### CSS Variables

You can take advantage of [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
if you're using Tailwind CSS v3+ and use the [CSS variables listed above](#css-variables).

<slot name="tw-variables" />

### Example

The following example showcases a slider with a thumb inside positioned at the current value
(indicated by the `--vds-fill-percent:ignore` variable). When the device pointer enters the slider,
or the thumb begins to be dragged (indicated by the `interactive` variant), we pin the thumb to the
device pointer position.

<slot name="tw-example" />
