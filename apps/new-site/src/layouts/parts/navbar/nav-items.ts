import type { NavItem } from './navigation';

export const mainNavItems: NavItem[] = [
  {
    title: 'Features',
    grid: true,
    items: [
      {
        title: 'CMS',
        description: 'Manage video and audio assets including posters, captions, and more.',
        badge: 'Soon',
        icon: 'folders',
      },
      {
        title: 'Hosting',
        description: 'Upload, store, load, and play media assets from the cloud.',
        badge: 'Soon',
        icon: 'database',
      },
      {
        title: 'Streaming',
        description: 'Prepare video and audio assets for an optimized playback experience.',
        badge: 'Soon',
        icon: 'play-square',
      },
      {
        title: 'Secure Playback',
        description: 'Secure playback so only specified domains can access content.',
        badge: 'Soon',
        icon: 'file-lock',
      },
      {
        title: 'Custom Domains',
        description: 'Download assets and stream files from your own domain.',
        badge: 'Planned',
        icon: 'home',
      },
      {
        title: 'Analytics',
        description: 'Collect real-time performance and user behavior data.',
        badge: 'Planned',
        icon: 'area-chart',
      },
    ],
  },
  {
    title: 'Components',
    items: [
      {
        title: 'Vidstack Player',
        badge: 'Beta',
        description: 'UI library for building robust and accessible video/audio players.',
        featured: true,
        items: [
          {
            title: 'Product',
            description: 'See what makes Vidstack Player special and start building today.',
            href: '/player',
            icon: 'sparkle',
          },
          {
            title: 'Documentation',
            description: 'Get started installing and using Vidstack Player.',
            icon: 'book-open',
            href: '/docs/player',
          },
          {
            title: 'UI Components',
            description: 'Browse the complete collection of player UI components.',
            href: '/player/components',
            icon: 'boxes',
          },
          {
            title: 'Skins',
            description: 'Check out our fully customizable and production-ready player UIs.',
            href: '/player#skins',
            icon: 'wallpaper',
          },
          {
            title: 'Media Icons',
            description: 'A collection of handcrafted icons for building your player.',
            href: '/media-icons',
            icon: 'file-box',
          },
          {
            title: 'Releases',
            description: "Catch up on the latest player releases and see what's new.",
            icon: 'newspaper',
            href: 'https://github.com/vidstack/vidstack/discussions/categories/releases?discussions_q=is%3Aopen+category%3AReleases+label%3Aplayer',
          },
        ],
      },
      {
        title: 'Vidstack Uploader',
        description: 'Headless uploader for sending files directly up to storage or encoding.',
        badge: 'Planned',
      },
      {
        title: 'Vidstack Search',
        description: 'UI components for building beautiful video/audio search experiences.',
        badge: 'Planned',
      },
      {
        title: 'Vidstack Analytics',
        description: 'Component for collecting video/audio performance and user-behavior data.',
        badge: 'Planned',
      },
    ],
  },
  { title: 'Documentation', href: '/docs' },
  { title: 'Icons', href: '/media-icons' },
  {
    title: 'Releases',
    href: 'https://github.com/vidstack/vidstack/discussions/categories/releases',
  },
];
