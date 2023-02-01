import { effect, peek, signal } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { isString } from 'maverick.js/std';

import { preconnect } from '../../../utils/network';
import { useMedia } from '../context';
import type { MediaProviderContext } from '../providers/types';
import type { MediaOutletElement } from './types';

export const OutletDefinition = defineCustomElement<MediaOutletElement>({
  tagName: 'media-outlet',
  setup({ host }) {
    const media = useMedia(),
      context: MediaProviderContext = { ...media, player: media.$player()! },
      $rendered = signal(false);

    onAttach(() => {
      host.el!.keepAlive = true;
    });

    effect(() => {
      if (!$rendered()) return;

      const loader = media.$loader();

      if (loader) {
        peek(() => {
          loader.preconnect?.(context);
          media.delegate.dispatch('provider-loader-change', { detail: loader });
          loader.load(context).then((provider) => {
            // The src/loader might've changed by the time we load the provider.
            if (peek(media.$loader) === loader) media.$provider.set(provider);
          });
        });
      }

      return () => {
        $rendered.set(false);
        media.$provider.set(null);
      };
    });

    effect(() => {
      const provider = media.$provider();

      media.delegate.dispatch('provider-change', { detail: provider });

      if (!provider) return;

      if (media.$store.canLoad) {
        peek(() => provider.setup(context));
        media.delegate.dispatch('provider-setup', { detail: provider });
        return;
      }

      peek(() => provider.preconnect?.(context));
    });

    effect(() => {
      const provider = media.$provider(),
        source = media.$store.source;

      if (media.$store.canLoad) {
        peek(() =>
          provider?.loadSource(
            source,
            peek(() => media.$store.preload),
          ),
        );
        return;
      }

      try {
        isString(source.src) && preconnect(new URL(source.src).origin, 'preconnect');
      } catch (e) {
        if (__DEV__) {
          media.logger
            ?.infoGroup(`Failed to preconnect to source: ${source.src}`)
            .labelledLog('Error', e)
            .dispatch();
        }
      }
    });

    return () => {
      $rendered.set(true);
      return media.$loader()?.render(media.$store);
    };
  },
});
