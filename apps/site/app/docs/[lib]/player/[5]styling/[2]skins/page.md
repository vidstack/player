---
title: Skins
description: Introduction to using Vidstack Player skins.
---

# {% $frontmatter.title %}

Skins are perfect for when you're looking for a beautiful pre-built player design out of the box
rather than building your own.

## Community Skin

### Installation

Follow the [installation guide](/docs/player/getting-started/installation) to get started with
the Community Skin.

### Audio Preview

{% cs_audio_player /%}

### Video Preview

{% cs_video_player /%}

### Features

Follow any of the links below to configure certain player features:

- [Audio Tracks](/docs/player/api/audio)
- [Captions](/docs/player/api/text-tracks)
- [Video Qualities](/docs/player/api/quality)
- [Thumbnails](/docs/player/components/sliders/slider-thumbnail#webvtt)
- [Chapters](/docs/player/components/sliders/time-slider#chapters)
- [Live Streams](/docs/player/api/live) - not supported by the skin yet.

### Audio CSS Vars

The following is a complete list of CSS variables available for customizing the Community Audio
Skin. This is in addition to the [Component CSS variables](#component-css-vars) listed below.

```css
media-community-skin[data-audio] {
  --audio-brand: #f5f5f5;
  --audio-focus-ring: 0 0 0 3px var(--audio-brand);
  --audio-bg: black;
  --audio-border: 1px solid rgb(255 255 255 / 0.2);
  --audio-border-radius: 6px;
  --audio-font-family: sans-serif;
  --audio-controls-color: #f5f5f5;

  --audio-title-font-size: 14px;
  --audio-title-font-weight: 500;
  --audio-title-color: rgb(255 255 255 / 0.64);

  --audio-time-divider-color: rgb(224, 224, 224);

  --audio-button-size: 40px;
  --audio-play-button-size: 30px;
  --audio-play-button-bg: white;
  --audio-play-button-color: black;
  --audio-play-button-border-radius: 100%;

  --audio-buffering-stripe-color: rgb(0 0 0 / 0.25);
  --audio-buffering-stripe-size: 30px;

  --audio-slider-chapter-title-color: black;

  --audio-menu-max-height: 320px;

  --audio-captions-min-height: 28px;
  --audio-captions-offset: 8px;
  --audio-captions-bg: transparent;
  --audio-cue-bg: black;
  --audio-cue-font-size: 14px;
}
```

### Video CSS Vars

The following is a complete list of CSS variables available for customizing the Community Video
Skin. This is in addition to the [Component CSS variables](#component-css-vars) listed below.

```css {% copy=true %}
media-community-skin[data-video] {
  --video-brand: #f5f5f5;
  --video-focus-ring: 0 0 0 3px var(--video-brand);
  --video-font-family: sans-serif;
  --video-controls-color: #f5f5f5;
  --video-border: 1px solid rgb(255 255 255 / 0.2);

  --video-title-color: #dedede;
  --video-title-font-size: 16px;
  --video-title-font-weight: 500;
  --video-title-font-family: sans-serif;
  --video-fullscreen-title-font-size: 16px;

  --video-mobile-button-size: 32px;
  --video-volume-slider-max-width: 72px;
  --video-gesture-seek-width: 20%;

  --video-scrim-bg: rgb(0 0 0 / 0.3);
  --video-scrim-in-transition: opacity 0.15s ease-in;
  --video-scrim-out-transition: opacity 0.15s ease-out;

  --video-controls-in-transition: opacity 0.2s ease-in;
  --video-controls-out-transition: opacity 0.2s ease-out;

  --video-captions-transition: bottom 0.2s linear;
  --video-captions-offset: 72px;
  --video-mobile-captions-offset: 48px;

  --video-time-divider-color: rgb(224, 224, 224);
  --video-fullscreen-time-font-size: 16px;

  --video-mobile-play-button-bg: rgb(0 0 0 / 0.6);
  --video-mobile-play-button-size: 40px;
  --video-mobile-play-button-size: 40px;
  --video-mobile-play-button-transform: translateY(25%);

  --video-mobile-start-duration-padding: 3px 6px;
  --video-mobile-start-duration-color: var(--video-controls-color);
  --video-mobile-start-duration-bg: rgb(0 0 0 / 0.64);
}
```

### Component CSS Vars

Follow any of the links below to find a comprehensive list of CSS variables available for
customizing specific components:

- [Buttons](/docs/player/components/buttons/toggle-button#css-variables)
- [Sliders](/docs/player/components/sliders/slider#css-variables)
- [Time](/docs/player/components/display/time#css-variables)
- [Captions](/docs/player/components/display/captions#css-variables)
- [Buffering Indicator](/docs/player/components/display/buffering-indicator#css-variables)
- [Live Indicator](/docs/player/components/display/live-indicator#css-variables)
- [Menus](/docs/player/components/menu/menu#css-variables)
- [Chapters Menu](/docs/player/components/menu/chapters-menu#css-variables)

### Internationalization

The Community Skin supports dynamically changing the language used throughout the player UI
by setting the `translations` property like so:

{% code_snippet name="i18n" copy=true /%}

{% callout type="tip" %}
Set `translations` back to `null` for the default English language.
{% /callout %}

## Plyr Skin

❌️ The Plyr Skin is currently not available. We have an
[issue](https://github.com/vidstack/player/issues/74) on GitHub tracking it. You can watch the
[player repository](https://github.com/vidstack/player), follow us on
[Twitter](https://twitter.com/vidstackjs?lang=en), or join our [Discord](https://discord.gg/QAjfh2gZE4)
channel to be notified when it's ready.
