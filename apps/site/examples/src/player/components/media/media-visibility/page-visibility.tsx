import {
  Media,
  MediaVisibility,
  type MediaVisibilityChangeEvent,
  Video,
} from '@vidstack/player/react';

export default () => {
  function onMediaVisibilityChange(event: MediaVisibilityChangeEvent) {
    const { page } = event.detail;
    console.log(event);
    console.log('Page state ->', page);
  }

  return (
    <Media>
      <MediaVisibility
        enterPage="play"
        exitPage="pause"
        pageEnterDelay={0}
        onMediaVisibilityChange={onMediaVisibilityChange}
      >
        <Video controls autoplay muted>
          <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
        </Video>
      </MediaVisibility>
    </Media>
  );
};
