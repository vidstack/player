import type { GridContentItem } from '../../sections/grid-content.astro';

export const openSourceProjects: GridContentItem[] = [
  {
    title: 'Player',
    stage: 'Beta',
    href: '/player',
    stars: '1.1k',
    description: 'UI component library for building video and audio players for the web.',
  },
  {
    title: 'Captions',
    stage: 'Beta',
    href: 'https://github.com/vidstack/media-captions',
    description: 'Modern media captions parser and renderer. Supports VTT, SRT, and SSA.',
  },
  {
    title: 'Icons',
    stage: 'Beta',
    href: '/media-icons',
    description: 'Beautifully hand-crafted collection of media icons designed for players.',
  },
  {
    title: 'Uploader',
    stage: 'Planned',
    description: 'UI component library for building your own media uploader.',
  },
  {
    title: 'Analytics',
    stage: 'Planned',
    description: 'Drop-in component for collecting media performance and user-behavior data.',
  },
  {
    title: 'Search',
    stage: 'Planned',
    description: 'UI components for building beautiful video/audio search experiences.',
  },
  {
    title: 'Plyr',
    stage: 'Archived',
    stars: '24.2k',
    href: 'https://github.com/sampotts/plyr',
    description: 'Simple, lightweight, accessible and customizable media player.',
  },
  {
    title: 'Vime',
    stage: 'Archived',
    stars: '2.6k',
    href: 'https://github.com/vime-js/vime',
    description: 'Customizable, extensible, accessible and framework-agnostic media player.',
  },
];
