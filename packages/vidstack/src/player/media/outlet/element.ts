import { signal } from 'maverick.js';
import { defineCustomElement, onAttach, onConnect } from 'maverick.js/element';
import type { CaptionsFileFormat } from 'media-captions';

import { useMedia } from '../context';
import type { TextTrackInit } from '../tracks/text/text-track';
import type { MediaSrc } from '../types';
import { useSourceSelection } from './sources';
import { useTextTracks } from './tracks';
import type { MediaOutletElement } from './types';

export const OutletDefinition = defineCustomElement<MediaOutletElement>({
  tagName: 'media-outlet',
  setup({ host }) {
    const context = useMedia(),
      $rendered = signal(false),
      $domSources = signal<MediaSrc[]>([]),
      $domTracks = signal<TextTrackInit[]>([]);

    onAttach(() => {
      host.el!.keepAlive = true;
    });

    onConnect(() => {
      function onMutation() {
        const sources: MediaSrc[] = [],
          tracks: TextTrackInit[] = [],
          children = host.el!.children;

        for (const el of children) {
          if (el instanceof HTMLSourceElement) {
            sources.push({
              src: el.src,
              type: el.type,
            });
          } else if (el instanceof HTMLTrackElement) {
            tracks.push({
              id: el.id,
              src: el.src,
              kind: el.track.kind,
              language: el.srclang,
              label: el.label,
              default: el.default,
              type: el.getAttribute('data-type') as CaptionsFileFormat,
            });
          }
        }

        $domSources.set(sources);
        $domTracks.set(tracks);
      }

      onMutation();
      const observer = new MutationObserver(onMutation);
      observer.observe(host.el!, { childList: true });
      return () => observer.disconnect();
    });

    useSourceSelection($domSources, $rendered, context);
    useTextTracks($domTracks, context);

    return () => () => {
      const loader = context.$loader();

      if (!loader) {
        $rendered.set(false);
        return;
      }

      $rendered.set(true);
      return loader.render(context.$store);
    };
  },
});
