import { effect, peek, signal } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';

import { useMedia } from '../context';
import type { MediaOutletElement } from './types';

export const OutletDefinition = defineCustomElement<MediaOutletElement>({
  tagName: 'media-outlet',
  setup({ host }) {
    const context = useMedia(),
      $rendered = signal(false);

    onAttach(() => {
      host.el!.keepAlive = true;
    });

    effect(() => {
      const loader = context.$loader();
      if (!$rendered() || !loader) return;
      peek(() => {
        loader.load(context).then((provider) => {
          if (!peek($rendered)) return;
          // The src/loader might've changed by the time we load the provider.
          if (peek(context.$loader) === loader) {
            context.delegate.dispatch('provider-change', {
              detail: provider,
            });
          }
        });
      });
    });

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
