import * as React from 'react';

export interface IconProps
  extends React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>,
    React.RefAttributes<SVGElement | SVGSVGElement> {
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

export interface IconComponent extends React.ForwardRefExoticComponent<IconProps> {}

const Icon: IconComponent = /* #__PURE__*/ React.forwardRef((props, ref) => {
  const { width, height, size = null, paths, ...restProps } = props;
  return React.createElement('svg', {
    ...restProps,
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
