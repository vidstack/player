import * as React from 'react';

import { effect, signal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';
import { updateSliderPreviewPlacement, type SliderOrientation } from 'vidstack';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-slider-preview}
 */
export function useSliderPreview({
  clamp = false,
  offset = 0,
  orientation = 'horizontal',
}: UseSliderPreview = {}) {
  const [rootRef, setRootRef] = React.useState<HTMLElement | null>(null),
    [previewRef, setPreviewRef] = React.useState<HTMLElement | null>(null),
    [pointerValue, setPointerValue] = React.useState(0),
    [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!rootRef) return;

    const dragging = signal(false);

    function updatePointerValue(event: PointerEvent) {
      if (!rootRef) return;
      setPointerValue(getPointerValue(rootRef, event, orientation));
    }

    return effect(() => {
      if (!dragging()) {
        listenEvent(rootRef, 'pointerenter', () => {
          setIsVisible(true);
          previewRef?.setAttribute('data-visible', '');
        });

        listenEvent(rootRef, 'pointerdown', (event) => {
          dragging.set(true);
          updatePointerValue(event);
        });

        listenEvent(rootRef, 'pointerleave', () => {
          setIsVisible(false);
          previewRef?.removeAttribute('data-visible');
        });

        listenEvent(rootRef, 'pointermove', (event) => {
          updatePointerValue(event);
        });

        return;
      }

      previewRef?.setAttribute('data-dragging', '');

      listenEvent(document, 'pointerup', (event) => {
        dragging.set(false);
        previewRef?.removeAttribute('data-dragging');
        updatePointerValue(event);
      });

      listenEvent(document, 'pointermove', (event) => {
        updatePointerValue(event);
      });

      listenEvent(document, 'touchmove', (e) => e.preventDefault(), {
        passive: false,
      });
    });
  }, [rootRef]);

  React.useEffect(() => {
    if (previewRef) {
      previewRef.style.setProperty('--slider-pointer', pointerValue + '%');
    }
  }, [previewRef, pointerValue]);

  React.useEffect(() => {
    if (!previewRef) return;

    const update = () => {
      updateSliderPreviewPlacement(previewRef, {
        offset,
        clamp,
        orientation,
      });
    };

    update();
    const resize = new ResizeObserver(update);
    resize.observe(previewRef);
    return () => resize.disconnect();
  }, [previewRef, clamp, offset, orientation]);

  return {
    previewRootRef: setRootRef,
    previewRef: setPreviewRef,
    previewValue: pointerValue,
    isPreviewVisible: isVisible,
  };
}

export interface UseSliderPreview {
  /**
   * Whether the preview should be clamped to the start and end of the slider root. If `true` the
   * preview won't be placed outside the root bounds.
   */
  clamp?: boolean;
  /**
   * The distance in pixels between the preview and the slider root. You can also set
   * the CSS variable `--media-slider-preview-offset` to adjust this offset.
   */
  offset?: number;
  /**
   * The orientation of the slider.
   */
  orientation?: SliderOrientation;
}

function getPointerValue(root: HTMLElement, event: PointerEvent, orientation: SliderOrientation) {
  let thumbPositionRate: number,
    rect = root.getBoundingClientRect();

  if (orientation === 'vertical') {
    const { bottom: trackBottom, height: trackHeight } = rect;
    thumbPositionRate = (trackBottom - event.clientY) / trackHeight;
  } else {
    const { left: trackLeft, width: trackWidth } = rect;
    thumbPositionRate = (event.clientX - trackLeft) / trackWidth;
  }

  return round(Math.max(0, Math.min(100, 100 * thumbPositionRate)));
}

function round(num: number) {
  return Number(num.toFixed(3));
}
