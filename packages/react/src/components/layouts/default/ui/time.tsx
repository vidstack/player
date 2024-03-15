import * as React from 'react';

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeGroup
 * -----------------------------------------------------------------------------------------------*/

import { useMediaState } from '../../../../hooks/use-media-state';
import { Time } from '../../../ui/time';
import { slot } from '../slots';
import { DefaultLiveButton } from './buttons';

interface DefaultTimeGroupSlots {
  currentTime?: React.ReactNode;
  timeSeparator?: React.ReactNode;
  endTime?: React.ReactNode;
}

function DefaultTimeGroup({ slots }: { slots?: DefaultTimeGroupSlots }) {
  const $duration = useMediaState('duration');

  if (!$duration) return null;

  return (
    <div className="vds-time-group">
      {slot(slots, 'currentTime', <Time className="vds-time" type="current" />)}
      {slot(slots, 'timeSeparator', <div className="vds-time-divider">/</div>)}
      {slot(slots, 'endTime', <Time className="vds-time" type="duration" />)}
    </div>
  );
}

DefaultTimeGroup.displayName = 'DefaultTimeGroup';
export { DefaultTimeGroup };

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeInfo
 * -----------------------------------------------------------------------------------------------*/

interface DefaultTimeInfoSlots extends DefaultTimeGroupSlots {
  liveButton?: React.ReactNode;
}

function DefaultTimeInfo({ slots }: { slots?: DefaultTimeInfoSlots }) {
  const $live = useMediaState('live');
  return $live ? (
    slot(slots, 'liveButton', <DefaultLiveButton />)
  ) : (
    <DefaultTimeGroup slots={slots} />
  );
}

DefaultTimeInfo.displayName = 'DefaultTimeInfo';
export { DefaultTimeInfo };

/* -------------------------------------------------------------------------------------------------
 * DefaultTimeInvert
 * -----------------------------------------------------------------------------------------------*/

function DefaultTimeInvert({ slots }: { slots?: DefaultTimeInfoSlots }) {
  const $live = useMediaState('live'),
    $duration = useMediaState('duration');
  return $live
    ? slot(slots, 'liveButton', <DefaultLiveButton />)
    : slot(
        slots,
        'endTime',
        $duration ? <Time className="vds-time" type="current" toggle remainder /> : null,
      );
}

DefaultTimeInvert.displayName = 'DefaultTimeInvert';
export { DefaultTimeInvert };
