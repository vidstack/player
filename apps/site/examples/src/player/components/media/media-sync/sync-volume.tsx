import { Media, MediaSync, type MediaVolumeSyncEvent, Video } from '@vidstack/player/react';

export default () => {
  function onMediaVolumeSync(event: MediaVolumeSyncEvent) {
    const { volume, muted } = event.detail;
    console.log(event);
    console.log(`Synced volume to ->`, volume);
    console.log(`Synced muted to ->`, muted);
  }

  return (
    <>
      <Media>
        <MediaSync syncVolume onMediaVolumeSync={onMediaVolumeSync}>
          <Video controls>
            <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
          </Video>
        </MediaSync>
      </Media>

      <Media>
        <MediaSync syncVolume>
          <Video controls>
            <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
          </Video>
        </MediaSync>
      </Media>
    </>
  );
};
