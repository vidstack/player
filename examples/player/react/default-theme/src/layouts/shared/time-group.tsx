import { Time } from '@vidstack/react';

export function TimeGroup() {
  return (
    <div className="vds-time-group">
      <Time className="vds-time" type="current" />
      <div className="vds-time-divider">/</div>
      <Time className="vds-time" type="duration" />
    </div>
  );
}
