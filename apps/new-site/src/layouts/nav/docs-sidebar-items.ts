import { basename, extname } from 'node:path';

import BookIcon from '~icons/lucide/book';
import CodeIcon from '~icons/lucide/code-2';
import NetworkIcon from '~icons/lucide/network';

import type { CollectionEntry } from 'astro:content';

import { kebabToCamelCase, kebabToTitleCase } from '../../utils/string';

export type DocsFileIdentifiers = CollectionEntry<'docs'>['id'];

export type DocsPagination = {
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
};

export const sidebarItemsOrder: Record<string, DocsFileIdentifiers[]> = {
  Overview: [
    'player/overview/getting-started/introduction.mdx',
    // Getting Started
    'player/overview/getting-started/installation/index.mdx',
    'player/overview/getting-started/editor-setup.mdx',
    'player/overview/getting-started/browser-support.mdx',
    'player/overview/getting-started/architecture.mdx',
    'player/overview/getting-started/accessibility.mdx',
    // Core Concepts
    'player/overview/core-concepts/loading.mdx',
    'player/overview/core-concepts/events.mdx',
    'player/overview/core-concepts/state-management.mdx',
    // Styling
    'player/overview/styling/introduction.mdx',
    'player/overview/styling/layouts.mdx',
    'player/overview/styling/responsive-design.mdx',
    'player/overview/styling/tailwind.mdx',
  ],
  API: [
    // Root
    'player/api/autoplay.mdx',
    'player/api/fullscreen.mdx',
    'player/api/picture-in-picture.mdx',
    'player/api/live.mdx',
    'player/api/keyboard.mdx',
    'player/api/audio-tracks.mdx',
    'player/api/text-tracks.mdx',
    'player/api/video-quality.mdx',
    // Providers
    'player/api/providers/audio.mdx',
    'player/api/providers/video.mdx',
    'player/api/providers/hls.mdx',
    // Hooks
    'player/api/react/hooks/use-media-player.mdx',
    'player/api/react/hooks/use-media-provider.mdx',
    'player/api/react/hooks/use-media-remote.mdx',
    'player/api/react/hooks/use-media-state.mdx',
    'player/api/react/hooks/use-slider-state.mdx',
    'player/api/react/hooks/use-player-query.mdx',
    'player/api/react/hooks/use-thumbnails.mdx',
    'player/api/react/hooks/use-text-track.mdx',
    'player/api/react/hooks/use-active-text-cues.mdx',
    'player/api/react/hooks/use-active-text-track.mdx',
    'player/api/react/hooks/use-audio-options.mdx',
    'player/api/react/hooks/use-caption-options.mdx',
    'player/api/react/hooks/use-chapter-options.mdx',
    'player/api/react/hooks/use-playback-rate-options.mdx',
    'player/api/react/hooks/use-video-quality-options.mdx',
  ],
  Components: [
    // Root
    'player/components/index.mdx',
    'player/components/player.mdx',
    'player/components/provider.mdx',
    'player/components/poster.mdx',
    'player/components/controls.mdx',
    'player/components/gesture.mdx',
    'player/components/thumbnail.mdx',
    'player/components/time.mdx',
    // Layouts
    'player/components/layouts/default-layout.mdx',
    'player/components/layouts/plyr-layout.mdx',
    // Buttons
    'player/components/buttons/toggle-button.mdx',
    'player/components/buttons/play-button.mdx',
    'player/components/buttons/mute-button.mdx',
    'player/components/buttons/caption-button.mdx',
    'player/components/buttons/pip-button.mdx',
    'player/components/buttons/fullscreen-button.mdx',
    'player/components/buttons/live-button.mdx',
    'player/components/buttons/seek-button.mdx',
    'player/components/buttons/tooltip.mdx',
    // Sliders
    'player/components/sliders/slider.mdx',
    'player/components/sliders/volume-slider.mdx',
    'player/components/sliders/time-slider.mdx',
    'player/components/sliders/slider-preview.mdx',
    'player/components/sliders/slider-value.mdx',
    'player/components/sliders/slider-video.mdx',
    'player/components/sliders/slider-thumbnail.mdx',
    'player/components/sliders/slider-chapters.mdx',
    // Menus
    'player/components/menus/menu.mdx',
    'player/components/menus/radio-group.mdx',
    'player/components/menus/audio-radio-group.mdx',
    'player/components/menus/captions-radio-group.mdx',
    'player/components/menus/chapters-radio-group.mdx',
    'player/components/menus/quality-radio-group.mdx',
    'player/components/menus/speed-radio-group.mdx',
  ],
};

export function resolveRootCategory(id: string): string {
  return kebabToTitleCase(id.split('/')[0].replace('api', 'API'));
}

export function resolveSubCategory(id: string) {
  const segment = id.split('/').slice(0, -1)[1];
  return segment ? kebabToTitleCase(segment) : '';
}

export function resolvePageTitle(page: CollectionEntry<'docs'>) {
  const fileName = basename(page.id, extname(page.id));

  if (page.data.title) {
    return page.data.title;
  } else if (/^use-/.test(fileName)) {
    return kebabToCamelCase(fileName);
  }

  return kebabToTitleCase(fileName);
}

export function resolveFeatureIcon(title: string) {
  switch (title) {
    case 'Overview':
      return BookIcon;
    case 'API':
      return CodeIcon;
    case 'Components':
      return NetworkIcon;
  }
}
