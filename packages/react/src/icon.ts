import {
  createElement,
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  type SVGProps,
} from 'react';

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
  part?: string;
  /* @internal */
  paths?: string;
}

export interface IconComponent extends ForwardRefExoticComponent<IconProps> {}

const Icon: IconComponent = /* #__PURE__*/ forwardRef((props, ref) => {
  const { width, height, size = 32, className, paths, ...restProps } = props;
  return createElement('svg', {
    ...restProps,
    className: (className ? `${className} ` : '') + 'vds-icon',
    width: width ?? size,
    height: height ?? size,
    viewBox: '0 0 32 32',
    fill: 'none',
    'aria-hidden': 'true',
    focusable: 'false',
    xmlns: 'http://www.w3.org/2000/svg',
    ref,
    dangerouslySetInnerHTML: { __html: paths },
  });
});

Icon.displayName = 'VidstackIcon';
export { Icon };
