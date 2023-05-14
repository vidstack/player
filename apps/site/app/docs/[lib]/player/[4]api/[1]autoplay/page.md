---
title: Autoplay
description: How to autoplay media and handle failure with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how to autoplay media and detect when it inevitably
fails.

## Introduction

A perfect starting point on understanding how browsers handle autoplay is [this article by
Chrome Developers](https://developer.chrome.com/blog/autoplay/). In short, the best chance you have
for autoplay working on a site where a user is visiting for the first time, or irregularly is by
muting the media. Try to encourage the user to either play or unmute the media themselves to avoid
a poor experience.

{% code_snippet name="autoplay" highlight="html:1|react:5" /%}

## Styling

The following media data attributes are available for styling based on the current autoplay
state:

```css
media-player[data-autoplay][data-playing] {
  /** autoplay has successfully started. */
}

media-player[data-autoplay-error] {
  /** autoplay has failed. */
}
```

You can use the CSS selectors above to style child elements as desired based on the autoplay state.
This can be useful for showing fallback controls in the event it fails.

## Events

The following events are available for detecting whether autoplay succeeds or fails:

{% code_snippet name="events" /%}
