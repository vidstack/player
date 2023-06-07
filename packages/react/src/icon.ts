import {
  createElement,
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  type SVGProps,
} from 'react';

export { type IconType } from 'media-icons';

export interface IconProps
  extends PropsWithoutRef<SVGProps<SVGSVGElement>>,
    RefAttributes<SVGElement | SVGSVGElement> {
  /**
   * The horizontal (width) and vertical (height) length of the underlying `<svg>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/width}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/height}
   */
  size?: number;
  /**
   * @docs {@link https://www.vidstack.io/docs/player/styling/foundation#slots}
   */
  slot?: string;
  /**
   * @docs {@link https://www.vidstack.io/docs/player/styling/foundation#parts}
   */
  part?: string;
  /* @internal */
  __paths?: string;
}

export interface IconComponent extends ForwardRefExoticComponent<IconProps> {}

export const Icon: IconComponent = /* #__PURE__*/ forwardRef((props, ref) => {
  const { width, height, size = 32, __paths, ...restProps } = props;
  return createElement('svg', {
    ...restProps,
    width: width ?? size,
    height: height ?? size,
    viewBox: '0 0 32 32',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true',
    focusable: 'false',
    'data-media-icon': 'true',
    ref,
    dangerouslySetInnerHTML: { __html: __paths },
  });
});
