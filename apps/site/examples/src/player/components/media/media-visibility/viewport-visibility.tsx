import {
  Media,
  MediaVisibility,
  type MediaVisibilityChangeEvent,
  Video,
} from '@vidstack/player/react';

export default () => {
  function onMediaVisibilityChange(event: MediaVisibilityChangeEvent) {
    const { viewport } = event.detail;
    console.log(event);
    console.log('Viewport state ->', viewport);
  }

  return (
    <Media>
      <MediaVisibility
        enterViewport="play"
        exitViewport="pause"
        intersectionThreshold={1}
        viewportEnterDelay={0}
        onMediaVisibilityChange={onMediaVisibilityChange}
      >
        <Video controls autoplay muted>
          <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
        </Video>
      </MediaVisibility>
    </Media>
  );
};
