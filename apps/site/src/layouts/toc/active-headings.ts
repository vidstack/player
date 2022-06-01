import { getRouter } from '@vitebook/svelte';
import { onMount, tick } from 'svelte';

import { isExtraLargeScreen, isLargeScreen } from '$src/stores/screen';
import { createDisposalBin } from '$src/utils/events.js';
import { throttleAndDebounce } from '$src/utils/timing';

import type { OnThisPageConfig, OnThisPageContext } from './context';

export function useActiveHeaderLinks(context: OnThisPageContext) {
  const router = getRouter();

  const scrollDisposal = createDisposalBin();
  const destroyDisposal = createDisposalBin();

  let SCROLL_OFFSET = 96;

  destroyDisposal.add(
    isLargeScreen.subscribe(($is) => {
      SCROLL_OFFSET = $is ? 96 : 192;
    }),
  );

  let canUpdateHash: OnThisPageConfig['canUpdateHash'] = undefined;
  destroyDisposal.add(
    context.subscribe((ctx) => {
      canUpdateHash = ctx.canUpdateHash;
    }),
  );

  async function gotoHash(hash: string) {
    if (canUpdateHash && !canUpdateHash(hash)) return;
    await router.go(hash, {
      replace: true,
      keepfocus: true,
      scroll: () => false,
    });
  }

  const setActiveHash = async () => {
    if (router.navigating) return;

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
    const isBottom = scrollY + innerHeight === offsetHeight;

    // page bottom - highlight last one
    if (anchors.length && isBottom) {
      await gotoHash(anchors[anchors.length - 1].hash);
      return;
    }

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];
      const nextAnchor = anchors[i + 1];
      const hash = isAnchorActive(i, anchor, nextAnchor);
      if (hash) {
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
}
