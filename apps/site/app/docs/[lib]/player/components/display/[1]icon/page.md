---
description: This component is used to display a media icon from our collection.
---

Media Icons is a collection of icons we've designed at Vidstack to help with building audio and
video player user interfaces. You can preview the entire collection in our
[media icons catalog](/media-icons?lib=html).

## Installation

First, install the [`media-icons`](https://github.com/vidstack/media-icons) package:

```bash
npm i media-icons
```

Next, import the icons element like so:

```ts {% copy=true %}
import 'vidstack/icons';
```

## Usage

The `<media-icon>` component will lazily load and display an icon based on the given
`type` like so:

{% code_preview name="usage" size="small" copy=true /%}

{% callout type="tip" %}
We strongly recommend [installing our VSCode extension](/docs/player/getting-started/editor-setup).
It will provide you with autocomplete suggestions for all icon types and respective preview links.
{% /callout %}

## Styling

Icons can be further customized with CSS like so:

```css {% copy=true %}
/* all icons */
media-icon {
  width: 32px;
  height: 32px;
  color: white;
}

/* specific icon */
media-icon[type='chromecast'] {
}
```
