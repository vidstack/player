import * as React from 'react';

import { useSignal } from 'maverick.js/react';
import { isBoolean } from 'maverick.js/std';
import {
  type DefaultLayoutProps as BaseLayoutProps,
  type MediaPlayerQuery,
  type MediaStreamType,
} from 'vidstack';

import { useMediaContext } from '../../../hooks/use-media-context';
import { useMediaState } from '../../../hooks/use-media-state';
import { createComputed } from '../../../hooks/use-signals';
import type { PrimitivePropsWithRef } from '../../primitives/nodes';
import { DefaultLayoutContext } from './context';
import type { DefaultLayoutIcons } from './icons';

/* -------------------------------------------------------------------------------------------------
 * DefaultMediaLayout
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultLayoutProps<Slots = unknown>
  extends PrimitivePropsWithRef<'div'>,
    Omit<Partial<BaseLayoutProps>, 'when' | 'smallWhen' | 'customIcons'> {
  children?: React.ReactNode;
  /**
   * The icons to be rendered and displayed inside the layout.
   */
  icons: DefaultLayoutIcons;
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
  smallLayoutWhen?: boolean | MediaPlayerQuery;
  /**
   * Provide additional content to be inserted in specific positions.
   */
  slots?: Slots;
}

export interface CreateDefaultMediaLayout {
  type: 'audio' | 'video';
  smLayoutWhen: MediaPlayerQuery;
  renderLayout: (props: {
    streamType: MediaStreamType;
    isLoadLayout: boolean;
    isSmallLayout: boolean;
  }) => React.ReactNode;
}

export function createDefaultMediaLayout({
  type,
  smLayoutWhen,
  renderLayout,
}: CreateDefaultMediaLayout) {
  const Layout = React.forwardRef<HTMLDivElement, DefaultLayoutProps>(
    (
      {
        className,
        icons,
        thumbnails = null,
        translations,
        showMenuDelay,
        showTooltipDelay = 700,
        smallLayoutWhen = smLayoutWhen,
        noModal = false,
        menuGroup = 'bottom',
        hideQualityBitrate = false,
        sliderChaptersMinWidth = 325,
        disableTimeSlider = false,
        noGestures = false,
        noKeyboardActionDisplay = false,
        slots,
        children,
        ...props
      },
      forwardRef,
    ) => {
      const media = useMediaContext(),
        $load = useSignal(media.$props.load),
        $canLoad = useMediaState('canLoad'),
        $viewType = useMediaState('viewType'),
        $streamType = useMediaState('streamType'),
        $smallWhen = createComputed(() => {
          return isBoolean(smallLayoutWhen) ? smallLayoutWhen : smallLayoutWhen(media.player.state);
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
          {canRender && isMatch ? (
            <DefaultLayoutContext.Provider
              value={{
                disableTimeSlider,
                hideQualityBitrate,
                icons: icons,
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
              {renderLayout({ streamType: $streamType, isSmallLayout, isLoadLayout })}
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
