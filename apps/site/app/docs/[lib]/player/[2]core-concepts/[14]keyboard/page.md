---
title: Keyboard
description: Introduction to keyboard support with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how keyboard navigation can be configured with Vidstack Player.

## Key Target

The `keyTarget` property can be used to specify the target on which to listen to key events. The
available targets include:

- `document`: key down events will be listened to on the entire document. In the case that
  multiple players are on the page, only the player that was recently interacted with will
  receive input.

- `player`: key down events will be listened to on the player itself when it or one of its
  children were recently interacted with.

{% code_snippet name="key-target" /%}

## Configuring Shortcuts

The `keyShortcuts` property extends global player key shortcuts. The shortcuts can be specified
as a space-separated list of combinations (e.g., `p Control+Space`). This property is loosely
modelled after the [`aria-keyshortcuts`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts)
attribute, see the link for more information and tips for picking good shortcuts.

{% code_snippet name="key-shortcuts" copyHighlight=true highlight="html:6-15|react:5-14" /%}

## ARIA Key Shortcuts

Keyboard shortcuts can be specified on individual buttons like so:

{% code_snippet name="aria-key-shortcuts" /%}

If `aria-keyshortcuts` is specified on a component, it will take precedence over the global
configuration. If it is not set, the player will set the attribute on the component based
on the global config so screen readers can announce shortcuts.

👉 See the [`aria-keyshortcuts`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts)
docs for more information.

## Disabling Keyboard

We strongly recommend not disabling keyboard shortcuts for accessibility reasons, but if required
you can disable them like so:

{% code_snippet name="disable" /%}

This will not disable standard ARIA keyboard controls for individual components when focused.
