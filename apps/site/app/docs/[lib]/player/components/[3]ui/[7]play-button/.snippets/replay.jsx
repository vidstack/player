import { Media, PlayButton } from '@vidstack/player-react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <PlayButton>
        <svg className="media-play-icon" aria-hidden="true" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
          />
        </svg>
        <svg className="media-pause-icon" aria-hidden="true" viewBox="0 0 24 24">
          <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
        <svg className="media-replay-icon" aria-hidden="true" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
          />
        </svg>
      </PlayButton>
    </Media>
  );
}
