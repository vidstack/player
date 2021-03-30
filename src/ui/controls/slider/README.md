# vds-slider

A custom built `input[type="range"]` that is cross-browser friendly, ARIA friendly, mouse/touch
friendly and easily styleable. This component allows users to input numeric values between a
minimum and maxmimum value. Generally used in the player for volume or scrubber controls.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-slider min="0" max="100" value="50" throttle="10"></vds-slider>
```

```css
vds-slider {
  --vds-slider-active-color: pink;
}

vds-slider::part(thumb) {
  box-shadow: transparent 0px 0px 0px 1px inset;
}

vds-slider::part(track),
vds-slider::part(track-fill) {
  border-radius: 3px;
}
```

## Properties

| Property                                        | Description                                                                                                                                                  | Type                        | Default          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- | ---------------- |
| `disabled`                                      | Whether the slider should be disabled (not-interactable).                                                                                                    | `boolean`                   | `false`          |
| `fillPercent` _(readonly)_                      | The fill rate expressed as a percentage (`fillRate * 100`).                                                                                                  | `number`                    | `50`             |
| `fillRate` _(readonly)_                         | The current value to range ratio.                                                                                                                            | `number`                    | `0.5`            |
| `hasThumbReachedHumanPerceivedEnd` _(readonly)_ | Whether the thumb has been dragged to what a human would perceive as the end.                                                                                | `boolean`                   | `false`          |
| `hidden`                                        |                                                                                                                                                              | `boolean`                   | `false`          |
| `isDragging` _(readonly)_                       | Whether the slider thumb is currently being dragged.                                                                                                         | `boolean`                   | `false`          |
| `isOrientationHorizontal` _(readonly)_          | Whether the current orientation is horizontal.                                                                                                               | `boolean`                   | `true`           |
| `isOrientationVertical` _(readonly)_            | Whether the current orientation is vertical.                                                                                                                 | `boolean`                   | `false`          |
| `label`                                         | ♿ **ARIA:** The `aria-label` property of the slider.                                                                                                        | `string ∣ undefined`        | `undefined`      |
| `max`                                           | The greatest slider value in the range of permitted values.                                                                                                  | `number`                    | `100`            |
| `min`                                           | The lowest slider value in the range of permitted values.                                                                                                    | `number`                    | `0`              |
| `orientation`                                   | ♿ **ARIA:** Indicates the orientation of the slider.                                                                                                        | `"horizontal" ∣ "vertical"` | `'horizontal'`   |
| `parts` _(readonly/static)_                     |                                                                                                                                                              | `string[]`                  | `undefined`      |
| `rootElement` _(readonly)_                      | The component's root element.                                                                                                                                | `HTMLDivElement`            | `HTMLDivElement` |
| `step`                                          | A number that specifies the granularity that the slider value must adhere to.                                                                                | `number`                    | `1`              |
| `stepMultiplier`                                | A number that will be used to multiply the `step` when the `Shift` key is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. | `number`                    | `10`             |
| `styles` _(readonly/static)_                    |                                                                                                                                                              | `CSSResultArray`            | `undefined`      |
| `throttle`                                      | The amount of milliseconds to throttle the slider thumb during `mousemove` / `touchmove` events.                                                             | `number`                    | `10`             |
| `thumbContainerElement` _(readonly)_            | The thumb container element.                                                                                                                                 | `HTMLDivElement`            | `HTMLDivElement` |
| `thumbElement` _(readonly)_                     | The thumb element.                                                                                                                                           | `HTMLDivElement`            | `HTMLDivElement` |
| `trackElement` _(readonly)_                     | The track element.                                                                                                                                           | `HTMLDivElement`            | `HTMLDivElement` |
| `trackFillElement` _(readonly)_                 | The track fill element.                                                                                                                                      | `HTMLDivElement`            | `HTMLDivElement` |
| `value`                                         | The current slider value.                                                                                                                                    | `number`                    | `50`             |
| `valueText`                                     | ♿ **ARIA:** Human-readable text alternative for the current value. Defaults to `value:max` ratio as a percentage.                                           | `string ∣ undefined`        | `undefined`      |

## Slots

| Slot                | Description                                           |
| ------------------- | ----------------------------------------------------- |
|                     | Used to pass in additional content inside the slider. |
| `"thumb"`           | Used to pass content inside the thumb.                |
| `"thumb-container"` | Used to pass content into the thumb container.        |
| `"track"`           | Used to pass content inside the track.                |
| `"track-fill"`      | Used to pass content inside the track fill.           |

## CSS Custom Properties

| Name                               | Description                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `--vds-slider-active-color`        | The slider thumb and track fill background color when focused, active or being dragged. |
| `--vds-slider-disabled-color`      | The slider thumb, track, and track fill background color when disabled.                 |
| `--vds-slider-fill-percentage`     | The fill rate expressed as a precetange such as `30%`.                                  |
| `--vds-slider-fill-rate`           | The ratio of the slider that is filled such as `0.3`.                                   |
| `--vds-slider-fill-value`          | The current amount the slider is filled such as `30`.                                   |
| `--vds-slider-thumb-bg`            | The background color of the slider handle.                                              |
| `--vds-slider-thumb-border-radius` | The border radius of the slider handle.                                                 |
| `--vds-slider-thumb-height`        | The slider handle height.                                                               |
| `--vds-slider-thumb-scale`         | The base scale of thumb when it is inactive, it'll scale to 1 when active.              |
| `--vds-slider-thumb-transition`    | The CSS transitions to use for the thumb, defaults to `transform 100ms ease-out 0s`.    |
| `--vds-slider-thumb-width`         | The slider handle width.                                                                |
| `--vds-slider-track-bg`            | The background color of the slider track.                                               |
| `--vds-slider-track-fill-bg`       | The background color of the slider track fill.                                          |
| `--vds-slider-track-height`        | The height of the slider track.                                                         |

## CSS Parts

| Name              | Description                                                                         |
| ----------------- | ----------------------------------------------------------------------------------- |
| `root`            | The component's root element, in this case the slider container (`<div>`).          |
| `thumb`           | The slider's handle the user drags left/right (`<div>`).                            |
| `thumb-container` | The container for the slider's handle.                                              |
| `track`           | The background of the slider in which the thumb slides along (`<div>`).             |
| `track-fill`      | The part of the track that is currently filled which fills left-to-right (`<div>`). |
