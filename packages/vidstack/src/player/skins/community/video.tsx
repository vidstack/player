import {
  CaptionButton,
  ChaptersMenu,
  ChapterTitleOrMainTitle,
  FullscreenButton,
  MuteButton,
  PiPButton,
  PlayButton,
  SettingsMenu,
  TimeGroup,
  TimeSlider,
  VideoGestures,
  VolumeSlider,
} from './shared';

export function renderVideo(isMobile: boolean) {
  return isMobile ? MobileUI() : DesktopUI();
}

function MobileUI() {
  return (
    <div part="media-ui vod live:dvr mobile">
      <VideoGestures />
      <media-captions />
      <media-buffering-indicator />

      <div part="scrim" />

      <div part="controls">
        <div part="controls-group">
          <div part="controls-spacer" />
          <CaptionButton tooltip="bottom center" />
          <ChaptersMenu />
          <SettingsMenu tooltip="bottom center" />
          <MuteButton tooltip="bottom right" />
        </div>

        <div part="controls-group">
          <PlayButton tooltip="top center" />
        </div>

        <div part="controls-group">
          <TimeGroup />
          <ChapterTitleOrMainTitle />
          <div part="controls-spacer"></div>
          <FullscreenButton />
        </div>

        <div part="controls-group">
          <TimeSlider />
        </div>
      </div>

      <div part="start-duration">
        <media-time type="duration" />
      </div>
    </div>
  );
}

function DesktopUI() {
  return (
    <div part="media-ui vod live:dvr desktop ">
      <VideoGestures />
      <media-captions />
      <media-buffering-indicator />

      <div part="scrim" />

      <div part="controls">
        <div part="controls-group">
          <div part="controls-spacer" />
          <ChaptersMenu />
          <SettingsMenu />
        </div>

        <div part="controls-group"></div>

        <div part="controls-group">
          <TimeSlider />
        </div>

        <div part="controls-group">
          <PlayButton />
          <MuteButton />
          <VolumeSlider />
          <TimeGroup />
          <ChapterTitleOrMainTitle />
          <CaptionButton />
          <PiPButton />
          <FullscreenButton />
        </div>
      </div>
    </div>
  );
}
