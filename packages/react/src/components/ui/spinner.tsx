import * as React from 'react';

/* -------------------------------------------------------------------------------------------------
 * Spinner
 * -----------------------------------------------------------------------------------------------*/

export interface RootProps
  extends React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>,
    React.RefAttributes<SVGElement | SVGSVGElement> {
  /**
   * The horizontal (width) and vertical (height) length of the spinner.
   *
   * @defaultValue 96
   */
  size?: number;
}

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/display/buffering-indicator}
 * @example
 * ```html
 * <Spinner.Root>
 *   <Spinner.Track />
 *   <Spinner.TrackFill />
 * </Spinner>
 * ```
 */
const Root = React.forwardRef<SVGElement | SVGSVGElement, RootProps>(
  ({ size = 96, children, ...props }: RootProps, forwardRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 120 120"
        aria-hidden="true"
        data-part="root"
        {...props}
        ref={forwardRef as React.Ref<any>}
      >
        {children}
      </svg>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Track
 * -----------------------------------------------------------------------------------------------*/

export interface TrackProps
  extends React.PropsWithoutRef<React.SVGProps<SVGCircleElement>>,
    React.RefAttributes<SVGCircleElement> {}

const Track = React.forwardRef<SVGCircleElement, TrackProps>(
  ({ width = 8, children, ...props }, ref) => (
    <circle
      cx="60"
      cy="60"
      r="54"
      stroke="currentColor"
      strokeWidth={width}
      data-part="track"
      {...props}
      ref={ref}
    >
      {children}
    </circle>
  ),
);

/* -------------------------------------------------------------------------------------------------
 * TrackFill
 * -----------------------------------------------------------------------------------------------*/

export interface TrackFillProps
  extends React.PropsWithoutRef<React.SVGProps<SVGCircleElement>>,
    React.RefAttributes<SVGCircleElement> {
  /**
   * The percentage of the track that should be filled.
   */
  fillPercent?: number;
}

const TrackFill = React.forwardRef<SVGCircleElement, TrackFillProps>(
  ({ width = 8, fillPercent = 50, children, ...props }, ref) => (
    <circle
      cx="60"
      cy="60"
      r="54"
      stroke="currentColor"
      pathLength="100"
      strokeWidth={width}
      strokeDasharray={100}
      strokeDashoffset={100 - fillPercent}
      data-part="track-fill"
      {...props}
      ref={ref}
    >
      {children}
    </circle>
  ),
);

export { Root, Track, TrackFill };
