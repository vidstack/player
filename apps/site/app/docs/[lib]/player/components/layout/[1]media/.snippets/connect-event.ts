import { type MediaConnectEvent } from 'vidstack';

mediaParent.addEventListener('media-connect', (event: MediaConnectEvent) => {
  const mediaElement = event.detail; // <vds-media>
  const currentProvider = mediaElement.provider;
  // ...
});
