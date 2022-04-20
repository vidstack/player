---
title: Buffering Indicator Docs
---

<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html copyHighlight|slot=styling{6-26}
<vds-media>
  <vds-video>
    <!-- ... -->
  </vds-video>

  <div class="media-buffering-container">
    <svg class="media-buffering-icon" fill="none" viewBox="0 0 120 120" aria-hidden="true">
      <circle
        class="media-buffering-track"
        cx="60"
        cy="60"
        r="54"
        stroke="currentColor"
        stroke-width="8"
      ></circle>
      <circle
        class="media-buffering-track-fill"
        cx="60"
        cy="60"
        r="54"
        stroke="currentColor"
        stroke-width="10"
        pathLength="100"
      ></circle>
    </svg>
  </div>
</vds-media>
```

</Docs>
