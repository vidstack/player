<script lang="ts">
  import DocsLayout from '$components/layout/DocsLayout.svelte';
  import { createSidebarContext, toItems } from '$components/layout/sidebar/Sidebar.svelte';
  import { EXPERIMENTAL_TAG_NAMES } from '$stores/element';
  import { isReactPath } from '$stores/path';
  import { isString } from '@vidstack/foundation';
  import { derived } from 'svelte/store';

  const baseUrl = '/docs/player/';
  const baseSlug = (path: string) => `${baseUrl}${path}`;

  const gettingStartedSlug = (s) => baseSlug(`getting-started/${s}`);
  const coreConceptsSlug = (s) => baseSlug(`core-concepts/${s}`);
  const librariesSlug = (s) => baseSlug(`libraries/${s}`);

  const ext = () => ($isReactPath ? '/react' : '');
  const componentsSlug = (path: string) => `${baseUrl}components/${path}${ext()}`;
  const providers = (s) => componentsSlug(`providers/${s}`);
  const media = (s) => componentsSlug(`media/${s}`);
  const ui = (s) => componentsSlug(`ui/${s}`);

  const markAsExperimental = (s) => {
    const name = isString(s) ? s : s[0];
    if (!EXPERIMENTAL_TAG_NAMES.has(`vds-${name}`)) return s;
    const options = isString(s) ? {} : s[1];
    options.experimental = true;
    return [name, options];
  };

  function buildNav() {
    return {
      'Getting Started': [
        ['quickstart', { match: true }],
        'editor-setup',
        'foundation',
        'styling',
      ].map(toItems(gettingStartedSlug)),
      Libraries: ['react', 'svelte', 'vue', 'tailwind'].map(toItems(librariesSlug)),
      'Core Concepts': [
        'architecture',
        'lifecycle',
        'events',
        'skins',
        'autoplay',
        'fullscreen',
        'custom-elements',
      ].map(toItems(coreConceptsSlug)),
      Providers: [
        'audio',
        'video',
        ['hls', { title: 'HLS' }],
        'vimeo',
        ['youtube', { title: 'YouTube' }],
      ]
        .map(markAsExperimental)
        .map(toItems(providers, true)),
      Media: ['media-sync', 'media-visibility'].map(markAsExperimental).map(toItems(media, true)),
      UI: [
        'aspect-ratio',
        'poster',
        'gesture',
        'controls',
        'buffering-indicator',
        'toggle-button',
        'play-button',
        'mute-button',
        'fullscreen-button',
        'slider',
        'slider-value-text',
        'slider-video',
        'time-slider',
        'volume-slider',
        'time',
      ]
        .map(markAsExperimental)
        .map(toItems(ui, true)),
    };
  }

  const nav = derived(isReactPath, () => buildNav());
  const { activeCategory } = createSidebarContext(nav);
</script>

<DocsLayout>
  <div class="markdown prose z-10 dark:prose-invert">
    <p class="mb-3.5 text-[15px] font-semibold leading-6 text-brand">
      {$activeCategory}
    </p>

    <slot />
  </div>
</DocsLayout>
