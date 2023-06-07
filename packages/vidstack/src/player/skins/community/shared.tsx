import { computed, effect, signal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';
import { chaptersPaths, seekBackward10Paths, seekForward10Paths, settingsPaths } from 'media-icons';

import { Icon } from '../../../icons/icon';
import type { TooltipPosition } from '../../ui/tooltip/tooltip';
import { i18n, useCommunitySkin, useCommunitySkinI18n } from './context';

export function PlayButton({
  part,
  tooltip = 'top left',
}: {
  part?: string;
  tooltip?: TooltipPosition;
}) {
  const lang = useCommunitySkinI18n();
  return (
    <media-play-button default-appearance part={part}>
      <media-tooltip position={tooltip}>
        <span slot="play">{i18n(lang, 'Play')}</span>
        <span slot="pause">{i18n(lang, 'Pause')}</span>
      </media-tooltip>
    </media-play-button>
  );
}

export function MuteButton({ tooltip = 'top center' }: { tooltip?: TooltipPosition }) {
  const lang = useCommunitySkinI18n();
  return (
    <media-mute-button default-appearance>
      <media-tooltip position={tooltip}>
        <span slot="mute">{i18n(lang, 'Mute')}</span>
        <span slot="unmute">{i18n(lang, 'Unmute')}</span>
      </media-tooltip>
    </media-mute-button>
  );
}

export function CaptionButton({ tooltip = 'top center' }: { tooltip?: TooltipPosition }) {
  const lang = useCommunitySkinI18n();
  return (
    <media-caption-button default-appearance>
      <media-tooltip position={tooltip}>
        <span slot="on">{i18n(lang, 'Closed-Captions On')}</span>
        <span slot="off">{i18n(lang, 'Closed-Captions Off')}</span>
      </media-tooltip>
    </media-caption-button>
  );
}

export function PiPButton() {
  const lang = useCommunitySkinI18n();
  return (
    <media-pip-button default-appearance>
      <media-tooltip>
        <span slot="enter">{i18n(lang, 'Enter PiP')}</span>
        <span slot="exit">{i18n(lang, 'Exit PiP')}</span>
      </media-tooltip>
    </media-pip-button>
  );
}

export function FullscreenButton() {
  const lang = useCommunitySkinI18n();
  return (
    <media-fullscreen-button default-appearance>
      <media-tooltip position="top right">
        <span slot="enter">{i18n(lang, 'Enter Fullscreen')}</span>
        <span slot="exit">{i18n(lang, 'Exit Fullscreen')}</span>
      </media-tooltip>
    </media-fullscreen-button>
  );
}

export function SeekButton({
  seconds,
  tooltip = 'top center',
}: {
  seconds: number;
  tooltip?: TooltipPosition;
}) {
  const lang = useCommunitySkinI18n();
  return (
    <media-seek-button seconds={seconds}>
      <Icon paths={seconds >= 0 ? seekForward10Paths : seekBackward10Paths} />
      <media-tooltip position={tooltip}>
        <span>{i18n(lang, seconds >= 0 ? 'Seek Forward' : 'Seek Backward')}</span>
      </media-tooltip>
    </media-seek-button>
  );
}

export function VolumeSlider() {
  return (
    <media-volume-slider>
      <media-slider-value type="pointer" format="percent" slot="preview" />
    </media-volume-slider>
  );
}

export function MainTitle() {
  const {
    $media: { title },
  } = useCommunitySkin();
  return <span part="main-title">{title()}</span>;
}

export function ChapterTitleOrMainTitle() {
  const {
    $media: { title, textTracks, started },
  } = useCommunitySkin();

  const chapterTitle = signal(''),
    mainTitle = computed(() => (started() ? chapterTitle() || title() : title()));

  effect(() => {
    const track = textTracks().find(
      (track) => track.kind === 'chapters' && track.mode === 'showing',
    );

    track &&
      listenEvent(track, 'cue-change', () => {
        chapterTitle.set(track.activeCues[0]?.text || '');
      });

    return () => chapterTitle.set('');
  });

  return <span part="main-title">{mainTitle()}</span>;
}

export function ChaptersMenu({
  position = 'bottom',
  tooltip = 'bottom center',
}: {
  position?: 'top' | 'bottom';
  tooltip?: TooltipPosition;
}) {
  const lang = useCommunitySkinI18n();
  return (
    <media-menu position={position} part="chapters-menu">
      <media-menu-button>
        <Icon paths={chaptersPaths} />
        <media-tooltip position={tooltip}>{i18n(lang, 'Chapters')}</media-tooltip>
      </media-menu-button>
      <media-chapters-menu-items />
    </media-menu>
  );
}

export function SettingsMenu({
  position = 'bottom',
  tooltip = 'bottom right',
}: {
  position?: 'top' | 'bottom';
  tooltip?: TooltipPosition;
}) {
  const lang = useCommunitySkinI18n();
  return (
    <media-menu position={position} part="settings-menu">
      <media-menu-button>
        <Icon paths={settingsPaths} rotate />
        <media-tooltip position={tooltip}>{i18n(lang, 'Settings')}</media-tooltip>
      </media-menu-button>
      <media-menu-items>
        <media-menu>
          <media-audio-menu-button $prop:label={i18n(lang, 'Audio')} />
          <media-audio-menu-items $prop:emptyLabel={i18n(lang, 'Default')} />
        </media-menu>
        <media-menu>
          <media-playback-rate-menu-button $prop:label={i18n(lang, 'Speed')} />
          <media-playback-rate-menu-items $prop:normalLabel={i18n(lang, 'Normal')} />
        </media-menu>
        <media-menu>
          <media-quality-menu-button $prop:label={i18n(lang, 'Quality')} />
          <media-quality-menu-items $prop:autoLabel={i18n(lang, 'Auto')} />
        </media-menu>
        <media-menu>
          <media-captions-menu-button $prop:label={i18n(lang, 'Captions')} />
          <media-captions-menu-items $prop:offLabel={i18n(lang, 'Off')} />
        </media-menu>
      </media-menu-items>
    </media-menu>
  );
}

export function VideoGestures() {
  return (
    <div part="gestures">
      <media-gesture event="pointerup" action="toggle:paused" />
      <media-gesture event="pointerup" action="toggle:user-idle" />
      <media-gesture event="dblpointerup" action="toggle:fullscreen" />
      <media-gesture event="dblpointerup" action="seek:-10" />
      <media-gesture event="dblpointerup" action="seek:10" />
    </div>
  );
}

export function TimeSlider() {
  return (
    <media-time-slider>
      <div slot="preview">
        <media-slider-thumbnail />
        <div part="chapter-title" />
        <media-slider-value type="pointer" format="time" />
      </div>
    </media-time-slider>
  );
}

export function TimeGroup() {
  return (
    <div part="time-group">
      <media-time type="current" />
      <div part="time-divider">/</div>
      <media-time type="duration" />
    </div>
  );
}
