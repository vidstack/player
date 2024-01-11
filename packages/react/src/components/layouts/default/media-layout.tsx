import * as React from 'react';

import { computed } from 'maverick.js';
import { useReactContext, useSignal } from 'maverick.js/react';
import { isBoolean } from 'maverick.js/std';
import {
  mediaContext,
  type DefaultLayoutTranslations,
  type MediaPlayerQueryCallback,
  type ThumbnailSrc,
} from 'vidstack';

import { useMediaState } from '../../../hooks/use-media-state';
import type { PrimitivePropsWithRef } from '../../primitives/nodes';
import { DefaultLayoutContext } from './context';
import type { DefaultLayoutIcons } from './icons';

/* -------------------------------------------------------------------------------------------------
 * DefaultMediaLayout
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMediaLayoutProps<Slots = unknown> extends PrimitivePropsWithRef<'div'> {
  children?: React.ReactNode;
  /**
   * The icons to be rendered and displayed inside the layout.
   */
  icons: DefaultLayoutIcons;
  /**
   * The thumbnails resource.
   *
   * @see {@link https://www.vidstack.io/docs/player/core-concepts/loading#thumbnails}
   */
  thumbnails?: ThumbnailSrc;
  /**
   * Translation map from english to your desired language for words used throughout the layout.
   */
  translations?: DefaultLayoutTranslations | null;
  /**
   * Specifies the number of milliseconds to wait before tooltips are visible after interacting
   * with a control.
   *
   * @defaultValue 700
   */
  showTooltipDelay?: number;
  /**
   * Specifies the number of milliseconds to wait before menus are visible after opening them.
   *
   * @defaultValue 0
   */
  showMenuDelay?: number;
  /**
   * Whether the bitrate should be hidden in the settings quality menu next to each option.
   *
   * @defaultValue false
   */
  hideQualityBitrate?: boolean;
  /**
   * Determines when the small (e.g., mobile) UI should be displayed.
   *
   * @defaultValue `({ width, height }) => width < 576 || height < 380`
   */
  smallLayoutWhen?: boolean | MediaPlayerQueryCallback;
  /**
   * Specifies whether menu buttons should be placed in the top or bottom controls group. This
   * only applies to the large video layout.
   *
   * @defaultValue 'bottom'
   */
  menuGroup?: 'top' | 'bottom';
  /**
   * Whether modal menus should be disabled when the small layout is active. A modal menu is
   * a floating panel that floats up from the bottom of the screen (outside of the player). It's
   * enabled by default as it provides a better user experience for touch devices.
   *
   * @defaultValue false
   */
  noModal?: boolean;
  /**
   * Provide additional content to be inserted in specific positions.
   */
  slots?: Slots;
  /**
   * The minimum width to start displaying slider chapters when available.
   *
   * @defaultValue 600
   */
  sliderChaptersMinWidth?: number;
  /**
   * Whether the time slider should be disabled.
   */
  disableTimeSlider?: boolean;
  /**
   * Whether all gestures such as pressing to play or seek should not be active.
   */
  noGestures?: boolean;
  /**
   * Whether keyboard actions should not be displayed.
   */
  noKeyboardActionDisplay?: boolean;
}

export interface CreateDefaultMediaLayout {
  type: 'audio' | 'video';
  smLayoutWhen: MediaPlayerQueryCallback;
  LoadLayout: React.FC;
  SmallLayout: React.FC;
  LargeLayout: React.FC;
  UnknownStreamType?: React.FC;
}

export function createDefaultMediaLayout({
  type,
  smLayoutWhen,
  LoadLayout,
  SmallLayout,
  LargeLayout,
  UnknownStreamType,
}: CreateDefaultMediaLayout) {
  const Layout = React.forwardRef<HTMLDivElement, DefaultMediaLayoutProps>(
    (
      {
        className,
        icons,
        thumbnails = null,
        translations,
        showMenuDelay,
        showTooltipDelay = type === 'video' ? 500 : 700,
        smallLayoutWhen = smLayoutWhen,
        noModal = false,
        menuGroup = 'bottom',
        hideQualityBitrate = false,
        sliderChaptersMinWidth = 600,
        disableTimeSlider = false,
        noGestures = false,
        noKeyboardActionDisplay = false,
        slots,
        children,
        ...props
      },
      forwardRef,
    ) => {
      const media = useReactContext(mediaContext)!,
        $load = useSignal(media.$props.load),
        $canLoad = useMediaState('canLoad'),
        $viewType = useMediaState('viewType'),
        $streamType = useMediaState('streamType'),
        $smallWhen = React.useMemo(() => {
          return computed(() =>
            isBoolean(smallLayoutWhen) ? smallLayoutWhen : smallLayoutWhen(media.player.state),
          );
        }, [smallLayoutWhen]),
        isMatch = $viewType === type,
        isSmallLayout = $smallWhen(),
        isForcedLayout = isBoolean(smallLayoutWhen),
        isLoadLayout = $load === 'play' && !$canLoad,
        canRender = $canLoad || isForcedLayout || isLoadLayout;

      useSignal($smallWhen);

      return (
        <div
          {...props}
          className={`vds-${type}-layout` + (className ? ` ${className}` : '')}
          data-match={isMatch ? '' : null}
          data-size={isSmallLayout ? 'sm' : null}
          ref={forwardRef}
        >
          {}
          {canRender && isMatch ? (
            <DefaultLayoutContext.Provider
              value={{
                disableTimeSlider,
                hideQualityBitrate,
                Icons: icons,
                isSmallLayout,
                menuGroup,
                noGestures,
                noKeyboardActionDisplay,
                noModal,
                showMenuDelay,
                showTooltipDelay,
                sliderChaptersMinWidth,
                slots,
                thumbnails,
                translations,
              }}
            >
              {isLoadLayout ? (
                <LoadLayout />
              ) : $streamType === 'unknown' ? (
                UnknownStreamType ? (
                  <UnknownStreamType />
                ) : null
              ) : isSmallLayout ? (
                <SmallLayout />
              ) : (
                <LargeLayout />
              )}
              {children}
            </DefaultLayoutContext.Provider>
          ) : null}
        </div>
      );
    },
  );

  Layout.displayName = 'DefaultMediaLayout';
  return Layout;
}
