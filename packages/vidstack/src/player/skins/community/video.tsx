import { useCommunitySkin } from './context';
import {
  CaptionButton,
  ChaptersMenu,
  FullscreenButton,
  MainTitle,
  MuteButton,
  PiPButton,
  PlayButton,
  SettingsMenu,
  TimeGroup,
  TimeSlider,
  VideoGestures,
  VolumeSlider,
} from './shared';

export function renderVideo() {
  const { $media } = useCommunitySkin();
  return $media.breakpointX() === 'sm' ? MobileUI() : DesktopUI();
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
          <media-time type="current" pad-minutes />
          <TimeSlider />
          <media-time type="current" remainder pad-minutes />
        </div>

        <div part="controls-group">
          <PlayButton />
          <MuteButton />
          <VolumeSlider />
          <MainTitle />
          <CaptionButton />
          <PiPButton />
          <FullscreenButton />
        </div>
      </div>
    </div>
  );
}
