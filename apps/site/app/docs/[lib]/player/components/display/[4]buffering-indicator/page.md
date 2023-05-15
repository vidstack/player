---
description: This component is used to display a loading indicator when media is buffering.
---

## Usage

{% code_preview name="usage" size="medium" copyHighlight=true highlight="html:3|react:7" /%}

## Custom

You can create a custom buffering indicator with some HTML, CSS,
and [media data attributes](/docs/player/styling/references#media-attributes). The `data-waiting`
attribute can be used to show the indicator while media is buffering. Optionally, the
`data-can-play` attribute could also be used to display the indicator while media is initially
loading.

```css {% copy=true %}
/* Show buffering indicator while media is not ready, or buffering. */
media-player:not([data-can-play]) .media-buffering-indicator,
media-player[data-waiting] .media-buffering-indicator {
  opacity: 1;
}
```

## Styling

```css {% copy=true %}
media-buffering-indicator {
}

/* Apply styles to indicator when buffering. */
media-buffering-indicator[data-buffering] {
}

/* Apply styles to svg. */
media-buffering-indicator [part='icon'] {
}

/* Apply styles to track. */
media-buffering-indicator [part='track'] {
}

/* Apply styles to track fill. */
media-buffering-indicator [part='track-fill'] {
}
```

### CSS Variables

The following snippet contains a complete list of CSS variables and their default values. Any
of the variables can be set to adjust the default buffering indicator styles:

```css {% copy=true %}
media-player {
  --media-buffering-size: 84px;
  --media-buffering-transition: opacity 200ms ease;
  --media-buffering-animation: media-buffering-spin 1s linear infinite;

  --media-buffering-track-color: #f5f5f5;
  --media-buffering-track-opacity: 0.25;
  --media-buffering-track-width: 8;

  --media-buffering-track-fill-color: #f5f5f5;
  --media-buffering-track-fill-opacity: 0.75;
  --media-buffering-track-fill-width: 9;
  --media-buffering-track-fill-offset: 50;
}
```

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copy=true /%}
