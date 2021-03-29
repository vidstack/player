# vds-control

Base control that is basically a naked (not styled) button that helps manage ARIA
attributes and normalizes any web-component or cross-browser related issues.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-control>
  <!-- ... -->
</vds-control>
```

```css
vds-control::part(root) {
  transform: scale(1);
  transition: transform 0.3s linear;
}

vds-control::part(root):hover,
vds-control::part(root):focus {
  outline: 0;
  transform: scale(1.05);
}
```

## Properties

| Property                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Type                                     | Default     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| `controls`                   | ♿ **ARIA:** Identifies the element (or elements) whose contents or presence are controlled by the current control. See related `aria-owns`.                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `string ∣ undefined`                     | `undefined` |
| `describedBy`                | ♿ **ARIA:** Identifies the element (or elements) that describes the control. See related `aria-labelledby`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `string ∣ undefined`                     | `undefined` |
| `disabled`                   | Whether the control should be disabled (not-interactable).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `boolean`                                | `false`     |
| `expanded`                   | ♿ **ARIA:** Indicates whether the control, or another grouping element it controls, is currently expanded or collapsed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `boolean ∣ undefined`                    | `undefined` |
| `hasPopup`                   | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by the control.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `boolean ∣ undefined`                    | `undefined` |
| `hidden`                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `boolean`                                | `false`     |
| `label`                      | ♿ **ARIA:** The `aria-label` property of the control.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `string ∣ undefined`                     | `undefined` |
| `parts` _(readonly/static)_  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `string[]`                               | `undefined` |
| `pressed`                    | ♿ **ARIA:** Indicates the current "pressed" state of toggle buttons. See related `aria-checked` and `aria-selected`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `boolean ∣ undefined`                    | `undefined` |
| `rootElement` _(readonly)_   | The component's root element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `HTMLButtonElement`                      | `undefined` |
| `styles` _(readonly/static)_ |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `CSSResultArray`                         | `undefined` |
| `type`                       | Sets the default behaviour of the button. - `submit`: The button submits the form data to the server. This is the default if the attribute is not specified for buttons associated with a <form>, or if the attribute is an empty or invalid value. - `reset`: The button resets all the controls to their initial values, like `<input type="reset">`. (This behavior tends to annoy users.) - `button`: The button has no default behavior, and does nothing when pressed by default. It can have client-side scripts listen to the element's events, which are triggered when the events occur. | `"button" ∣ "menu" ∣ "reset" ∣ "submit"` | `'button'`  |

## Slots

| Slot | Description                                       |
| ---- | ------------------------------------------------- |
|      | Used to pass content into the control `<button>`. |

## CSS Parts

| Name   | Description                                |
| ------ | ------------------------------------------ |
| `root` | The component's root element (`<button>`). |
