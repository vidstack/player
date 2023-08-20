import React from 'react';

import { analytics, createAnalyticsDispatcher } from '@vidstack/nextjs';
import { AnalyticEvent, MediaAnalytics, MediaPlayer, MediaProvider } from '@vidstack/react';

// 📡 Server action.
const dispatcher = createAnalyticsDispatcher({
  provider: analytics.providers.vercel(),
  events: [
    AnalyticEvent.LoadTime({
      level: 'warn',
      filter: ({ duration }) => duration >= 5,
    }),
    AnalyticEvent.WatchPercent({
      percents: [25, 50, 75, 100],
    }),
    AnalyticEvent.BufferingDuration,
  ],
});

function WatchPage() {
  return (
    <MediaAnalytics dispatcher={dispatcher}>
      <MediaPlayer src="...">
        <MediaProvider />
        {/* 🎀 Beautiful custom UI here. */}
      </MediaPlayer>
    </MediaAnalytics>
  );
}
