import {
  ChaptersMenu,
  ChapterTitleOrMainTitle,
  PlayButton,
  SeekButton,
  TimeGroup,
  VolumeSlider,
} from './shared';
import { MuteButton } from './shared';
import { SettingsMenu } from './shared';
import { CaptionButton } from './shared';
import { TimeSlider } from './shared';

export function renderAudio(isMobile: boolean) {
  return isMobile ? MobileUI() : DesktopUI();
}

function MobileUI() {
  return (
    <div part="media-ui aod live:dvr mobile">
      <media-captions />
      <div part="controls">
        <div part="controls-group">
          <MuteButton tooltip="top left" />
          <ChapterTitleOrMainTitle />
          <CaptionButton />
          <ChaptersMenu tooltip="top center" position="top" />
          <SettingsMenu tooltip="top right" position="top" />
        </div>

        <div part="controls-group">
          <TimeSlider />
        </div>

        <div part="controls-group">
          <media-time type="current" />
          <div part="controls-spacer"></div>
          <media-time type="duration" />
        </div>

        <div part="controls-group">
          <div part="controls-spacer"></div>
          <SeekButton seconds={-10} tooltip="top left" />
          <PlayButton tooltip="top center" />
          <SeekButton seconds={10} />
          <div part="controls-spacer"></div>
        </div>
      </div>
    </div>
  );
}

function DesktopUI() {
  return (
    <div part="media-ui aod live:dvr desktop">
      <media-captions />
      <div part="controls">
        <div part="controls-group">
          <TimeSlider />
        </div>

        <div part="controls-group">
          <SeekButton seconds={-10} tooltip="top left" />
          <PlayButton tooltip="top center" />
          <SeekButton seconds={10} />
          <TimeGroup />
          <ChapterTitleOrMainTitle />

          <MuteButton tooltip="top center" />
          <VolumeSlider />
          <CaptionButton />
          <ChaptersMenu tooltip="top center" position="top" />
          <SettingsMenu tooltip="top right" position="top" />
        </div>
      </div>
    </div>
  );
}
