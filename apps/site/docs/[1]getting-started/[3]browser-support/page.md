---
title: Browser Support
description: The browsers Vidstack supports.
---

# {% $frontmatter.title %}

Ensure the following browser support table is suitable for your application. We've built the
library for the modern web; thus, we try to avoid bloated polyfills and outdated environments as
much as possible. At the moment, we only support browsers that fully implement
the [Custom Elements V1](https://caniuse.com/custom-elementsv1) spec.

## Browsers

We've tried to be conservative with these numbers; take this as a lower bound. We likely support a
greater range of browsers and versions, but we won't note it here until we test it; if you're not
sure, best try it yourself and let us know!

{% callout type="info" %}
We support at _minimum_ ~92.74% of users tracked on [caniuse](https://caniuse.com).
{% /callout %}

{% browsers_list /%}
