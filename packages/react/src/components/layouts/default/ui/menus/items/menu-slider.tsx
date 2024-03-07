import * as React from 'react';

import * as Slider from '../../../../../ui/sliders/slider';
import type { DefaultLayoutIcon } from '../../../icons';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuSliderItem
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMenuSliderItemProps {
  label?: string;
  value?: string;
  UpIcon?: DefaultLayoutIcon;
  DownIcon?: DefaultLayoutIcon;
  children: React.ReactNode;
  isMin: boolean;
  isMax: boolean;
}

function DefaultMenuSliderItem({
  label,
  value,
  UpIcon,
  DownIcon,
  children,
  isMin,
  isMax,
}: DefaultMenuSliderItemProps) {
  const hasTitle = label || value,
    Content = (
      <>
        {DownIcon ? <DownIcon className="vds-icon down" /> : null}
        {children}
        {UpIcon ? <UpIcon className="vds-icon up" /> : null}
      </>
    );

  return (
    <div
      className={`vds-menu-item vds-menu-slider-item${hasTitle ? ' group' : ''}`}
      data-min={isMin ? '' : null}
      data-max={isMax ? '' : null}
    >
      {hasTitle ? (
        <>
          <div className="vds-menu-slider-title">
            {label ? <div>{label}</div> : null}
            {value ? <div>{value}</div> : null}
          </div>
          <div className="vds-menu-slider-body">{Content}</div>
        </>
      ) : (
        Content
      )}
    </div>
  );
}

DefaultMenuSliderItem.displayName = 'DefaultMenuSliderItem';
export { DefaultMenuSliderItem };

/* -------------------------------------------------------------------------------------------------
 * DefaultSliderParts
 * -----------------------------------------------------------------------------------------------*/

function DefaultSliderParts() {
  return (
    <>
      <Slider.Track className="vds-slider-track" />
      <Slider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <Slider.Thumb className="vds-slider-thumb" />
    </>
  );
}

DefaultSliderParts.displayName = 'DefaultSliderParts';
export { DefaultSliderParts };

/* -------------------------------------------------------------------------------------------------
 * DefaultSliderSteps
 * -----------------------------------------------------------------------------------------------*/

function DefaultSliderSteps() {
  return (
    <Slider.Steps className="vds-slider-steps">
      {(step) => <div className="vds-slider-step" key={String(step)} />}
    </Slider.Steps>
  );
}

DefaultSliderSteps.displayName = 'DefaultSliderSteps';
export { DefaultSliderSteps };
