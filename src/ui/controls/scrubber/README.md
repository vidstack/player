<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-scrubber
 slider-label="Time scrubber"
 progress-label="Amount seekable"
>
 <!-- `hidden` attribute will automatically be applied/removed -->
 <div class="preview" slot="preview" hidden>Preview</div>
</vds-scrubber
```

```css
vds-scrubber {
  --vds-scrubber-progress-bg: pink;
}

.preview {
  position: absolute;
  left: 0;
  bottom: 12px;
  opacity: 1;
  transition: opacity 0.3s ease-in;
}

.preview[hidden] {
  opacity: 0;
}
```

## Properties

| Property                             | Description                                                                                                                                                                                                                                            | Type                         | Default                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | ----------------------------------- |
| `currentPreviewElement` _(readonly)_ | The root element passed in to the `preview` slot.                                                                                                                                                                                                      | `HTMLElement ∣ undefined`    | `undefined`                         |
| `disabled`                           | Whether the scubber is disabled.                                                                                                                                                                                                                       | `boolean`                    | `false`                             |
| `hidden`                             |                                                                                                                                                                                                                                                        | `boolean`                    | `false`                             |
| `isSeeking` _(readonly)_             | Whether the user is seeking by either hovering over the scrubber or by dragging the thumb.                                                                                                                                                             | `boolean`                    | `false`                             |
| `noPreviewTrack`                     | Whether to remove the preview track.                                                                                                                                                                                                                   | `boolean`                    | `false`                             |
| `orientation`                        | ♿ **ARIA:** Indicates the orientation of the slider.                                                                                                                                                                                                  | `"horizontal" ∣ "vertical"`  | `'horizontal'`                      |
| `parts` _(readonly/static)_          |                                                                                                                                                                                                                                                        | `string[]`                   |                                     |
| `pauseWhileDragging`                 | Whether the scrubber should request playback to pause while the user is dragging the thumb. If the media was playing before the dragging starts, the state will be restored by dispatching a user play request once the dragging ends.                 | `boolean`                    | `false`                             |
| `previewThrottle`                    | The amount of milliseconds to throttle preview time/position updates by.                                                                                                                                                                               | `number`                     | `30`                                |
| `previewTrackElement` _(readonly)_   | Returns the underlying preview track fill element (`<div>`). This will be `undefined` if you set the `noPreviewTrack` property to true.                                                                                                                | `HTMLDivElement ∣ undefined` | `HTMLDivElement`                    |
| `progressElement` _(readonly)_       | Returns the underlying `<progress>` element.                                                                                                                                                                                                           | `HTMLProgressElement`        | `HTMLProgressElement`               |
| `progressLabel`                      | ♿ **ARIA:** The `aria-label` for the buffered progress bar.                                                                                                                                                                                           | `string`                     | `'Amount seekable'`                 |
| `progressText`                       | ♿ **ARIA:** Human-readable text alternative for the current scrubber progress. If you pass in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with the spoken form such as `20 minutes out of 1 hour, 20 minutes. ` | `string`                     | `'{currentTime} out of {duration}'` |
| `rootElement` _(readonly)_           | The component's root element.                                                                                                                                                                                                                          | `HTMLDivElement`             | `HTMLElement`                       |
| `slider` _(readonly)_                | Returns the underlying `vds-slider` component.                                                                                                                                                                                                         | `Slider`                     |                                     |
| `sliderLabel`                        | ♿ **ARIA:** The `aria-label` for the slider.                                                                                                                                                                                                          | `string`                     | `'Time scrubber'`                   |
| `step`                               | A number that specifies the granularity that the slider value must adhere to.                                                                                                                                                                          | `number`                     | `0.01`                              |
| `stepMultiplier`                     | A number that will be used to multiply the `step` when the `Shift` key is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`.                                                                                           | `number`                     | `5`                                 |
| `styles` _(readonly/static)_         |                                                                                                                                                                                                                                                        | `CSSResultArray`             |                                     |
| `throttle`                           | The amount of milliseconds to throttle the slider thumb during `mousemove` / `touchmove` events.                                                                                                                                                       | `number`                     | `10`                                |
| `userSeekingThrottle`                | The amount of milliseconds to throttle user seeking events being dispatched.                                                                                                                                                                           | `number`                     | `150`                               |

## Events

| Event                              | Description                                                  | Type                     |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------ |
| `vds-scrubber-preview-hide`        | Emitted when the preview transitions from showing to hidden. | `VdsCustomEvent<void>`   |
| `vds-scrubber-preview-show`        | Emitted when the preview transitions from hidden to showing. | `VdsCustomEvent<void>`   |
| `vds-scrubber-preview-time-update` | Emitted when the time being previewed changes.               | `VdsCustomEvent<number>` |

## Slots

| Slot         | Description                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------- |
|              | Used to pass content into the root.                                                                 |
| `"preview"`  | Used to pass in a preview to be shown while the user is interacting (hover/drag) with the scrubber. |
| `"progress"` | Used to pass content into the progress element (`<div>`).                                           |
| `"slider"`   | Used to pass content into the slider component (`<vds-slider>`).                                    |

## CSS Custom Properties

| Name                                  | Description                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `--vds-preview-track-bg`              | The background color of the preview track.                                              |
| `--vds-scrubber-current-time`         | Current time of playback.                                                               |
| `--vds-scrubber-duration`             | The length of media playback.                                                           |
| `--vds-scrubber-preview-time`         | The current time in seconds that is being previewed (hover/drag).                       |
| `--vds-scrubber-preview-track-height` | The height of the preview track (defaults to `--vds-slider-track-height`).              |
| `--vds-scrubber-progress-bg`          | The background color of the amount that is seekable.                                    |
| `--vds-scrubber-progress-height`      | The height of the progress bar (defaults to `--vds-slider-track-height`).               |
| `--vds-scrubber-seekable`             | The amount of media that is seekable.                                                   |
| `--vds-slider-*`                      | All slider CSS properties can be used to style the underlying `<vds-slider>` component. |

## CSS Parts

| Name                   | Description                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `preview-track`        | The part of the slider track that displays                                                      |
| `preview-track-hidden` | Targets the `preview-track` part when it's hidden.                                              |
| `progress`             | The progress element (`<div>`).                                                                 |
| `root`                 | The component's root element (`<div>`).                                                         |
| `slider`               | The slider component (`<vds-slider>`).                                                          |
| `slider-*`             | All slider parts re-exported with the `slider` prefix such as `slider-root` and `slider-thumb`. |

## Dependencies

### Depends on

- [vds-slider](../slider)
