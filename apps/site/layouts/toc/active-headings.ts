import { useNavigation, useRouter } from '@vessel-js/svelte';
import { onMount, tick } from 'svelte';
import { get, writable, type Readable } from 'svelte/store';

import { env } from '$lib/env';
import { isExtraLargeScreen, isLargeScreen } from '$lib/stores/screen';
import { createDisposalBin } from '$lib/utils/events.js';
import { throttleAndDebounce } from '$lib/utils/timing';

import type { OnThisPageConfig } from './context';

export function useActiveHeaderLinks(config: Readable<OnThisPageConfig>) {
  const router = useRouter();
  const navigation = useNavigation();
  const index = writable(-1);

  const scrollDisposal = createDisposalBin();
  const destroyDisposal = createDisposalBin();

  let SCROLL_OFFSET = 96;

  destroyDisposal.add(
    isLargeScreen.subscribe(($is) => {
      SCROLL_OFFSET = $is ? 96 : 192;
    }),
  );

  if (env.browser) {
    router.afterNavigate(() => {
      index.set(-1);
    });
  }

  let canUpdateHash: OnThisPageConfig['canUpdateHash'] = undefined;
  destroyDisposal.add(
    config.subscribe((config) => {
      canUpdateHash = config.canUpdateHash;
    }),
  );

  async function gotoHash(hash: string) {
    if (canUpdateHash && !canUpdateHash(hash)) return;
    router.hashChanged(hash);
  }

  const setActiveHash = async () => {
    if (get(navigation)) return;

    const links = [].slice.call(
      document.querySelectorAll(`.on-this-page a`),
    ) as HTMLAnchorElement[];

    const anchors = [].slice
      .call(document.querySelectorAll(`a.header-anchor`))
      .filter((anchor: HTMLAnchorElement) => {
        return links.some((link) => {
          return link.hash === anchor.hash;
        });
      }) as HTMLAnchorElement[];

    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const offsetHeight = document.body.offsetHeight;
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;

    // page bottom - highlight last one
    if (anchors.length && isBottom) {
      index.set(anchors.length - 1);
      await gotoHash(anchors[anchors.length - 1].hash);
      return;
    }

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];
      const nextAnchor = anchors[i + 1];
      const hash = isAnchorActive(i, anchor, nextAnchor);
      if (hash) {
        index.set(i);
        await gotoHash(hash);
        return;
      }
    }
  };

  function getAnchorTop(anchor: HTMLAnchorElement): number {
    const rect = anchor.getBoundingClientRect();
    return rect.top + window.scrollY - SCROLL_OFFSET - rect.height / 2;
  }

  function isAnchorActive(
    index: number,
    anchor: HTMLAnchorElement,
    nextAnchor: HTMLAnchorElement | undefined,
  ): string | null {
    const scrollTop = window.scrollY;
    if (index === 0 && scrollTop === 0) return null;
    if (scrollTop < getAnchorTop(anchor)) return null;
    if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) return anchor.hash;
    return null;
  }

  const onScroll = throttleAndDebounce(() => setActiveHash(), 100);

  onMount(() => {
    const init = () => {
      onScroll();
      window.addEventListener('scroll', onScroll);
      scrollDisposal.add(() => window.removeEventListener('scroll', onScroll));
    };

    destroyDisposal.add(
      isExtraLargeScreen.subscribe(($is) => {
        if ($is) {
          tick().then(init);
        } else {
          scrollDisposal.dispose();
        }
      }),
    );

    return () => {
      scrollDisposal.dispose();
      destroyDisposal.dispose();
    };
  });

  return index;
}
