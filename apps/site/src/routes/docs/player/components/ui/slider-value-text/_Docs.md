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

In the following code snippets, we extend the work we started in the [slider example](../slider/index.md#example),
by adding a small tooltip that displays the current slider value at the position the user is
hovering over.

Start by adding the following highlighted markup inside the slider:

<slot name="styling" />

Next, we extend the CSS in the slider example with the following:

```css:copy
vds-slider-value-text {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	/* slightly above the thumb. */
	top: -32px;
	left: 0;
	/* fixed width so value updates don't re-size. */
	width: calc(var(--thumb-width) + 8px);
	opacity: 0;
	transition: opacity ease 150ms;
	/* re-position to center. */
	transform: translateX(-50%);
	will-change: left;
	color: #000;
	border-radius: 2px;
	background-color: #fff;
}

/* position text at pointer when device pointing in slider. */
[pointing] vds-slider-value-text {
	opacity: 1;
	left: var(--vds-slider-pointer-percent);
}
```

Done! Just like that we added a hover tooltip to the slider. This example remains the same whether
you decide to show the preview time inside a time slider (`format="time"`), or percentage of
volume inside a volume slider (`format="percentage"`). It's a flexible component designed to
fit multiple use cases.
