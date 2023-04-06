import { effect, peek } from 'maverick.js';
import { defineCustomElement, onConnect } from 'maverick.js/element';
import { listenEvent, setAttribute } from 'maverick.js/std';
import { CaptionsRenderer, renderVTTCueString, updateTimedVTTCueNodes } from 'media-captions';

import { useMedia } from '../../media/context';
import { CaptionsTextRenderer } from './captions-renderer';
import type { MediaCaptionsElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-captions': MediaCaptionsElement;
  }
}

export const CaptionsDefinition = defineCustomElement<MediaCaptionsElement>({
  tagName: 'media-captions',
  props: { textDir: { initial: 'ltr' } },
  setup({ host, props }) {
    onConnect(() => {
      const { $store: $media, textRenderers } = useMedia();

      const renderer = new CaptionsRenderer(host.el!),
        textRenderer = new CaptionsTextRenderer(renderer);

      effect(() => {
        setAttribute(host.el!, 'data-hidden', !$media.textTrack);
      });

      function setupAudio() {
        effect(() => {
          if (!$media.textTrack) return;

          listenEvent($media.textTrack, 'cue-change' as any, () => {
            host.el!.textContent = '';
            const currentTime = peek(() => $media.currentTime);
            for (const cue of $media.textTrack!.activeCues) {
              const el = document.createElement('div');
              el.setAttribute('part', 'cue');
              el.innerHTML = renderVTTCueString(cue, currentTime);
              host.el!.append(el);
            }
          });

          effect(() => {
            updateTimedVTTCueNodes(host.el!, $media.currentTime);
          });
        });

        return () => {
          host.el!.textContent = '';
        };
      }

      function setupVideo() {
        effect(() => {
          renderer.dir = props.$textDir();
        });

        effect(() => {
          if (!$media.textTrack) return;
          renderer.currentTime = $media.currentTime;
        });

        textRenderers.add(textRenderer);
        return () => {
          textRenderer.detach();
          textRenderers.remove(textRenderer);
        };
      }

      effect(() => {
        if ($media.viewType === 'audio') {
          return setupAudio();
        } else {
          return setupVideo();
        }
      });

      return () => {
        textRenderer.detach();
        textRenderers.remove(textRenderer);
        renderer.destroy();
      };
    });
  },
});
