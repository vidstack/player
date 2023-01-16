---
title: Autoplay
description: How to autoplay media and handle failure with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how to autoplay media and detect when it inevitably
fails.

{% callout type="warning" %}
This page is still a work-in-progress.
{% /callout %}

## Introduction

A perfect starting point on understanding how browsers handle autoplay is [this article by
Chrome Developers](https://developer.chrome.com/blog/autoplay/). In short, the best chance you have
for autoplay working on a site where a user is visiting for the first time or irregularly is by
muting the media. Try to encourage the user to either play or unmute the media themselves to avoid
a poor experience.

## Autoplay

We manually handle autoplay so we can detect when it fails. Therefore, ensure you set `autoplay` on
the provider component instead of the underlying media element like so:

{% code_snippet name="autoplay" highlight="html:1|react:5" /%}

{% callout type="danger" %}
The `autoplay` attribute on the `<audio>` or `<video>` element will take priority over the
`preload` attribute. Never set this attribute because it will break the loading process.
{% /callout %}

## Styling

The following media attributes are available for styling based on the current autoplay
state:

```css
vds-media[autoplay][started]:not([autoplay-error]) {
  /** autoplay has successfully started. */
}

vds-media[autoplay-error] {
  /** autoplay has failed. */
}
```

You can use the CSS selectors above to style child elements as desired based on the autoplay state.
This can be useful for showing fallback controls in the event it fails.

## Events

The following events are available for detecting whether autoplay succeeds or fails:

{% code_snippet name="events" /%}
