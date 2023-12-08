import { signal } from 'maverick.js';

export const RemotionThumbnail = signal<React.LazyExoticComponent<React.ComponentType<any>> | null>(
  null,
);

export const RemotionSliderThumbnail = signal<React.LazyExoticComponent<
  React.ComponentType<any>
> | null>(null);
