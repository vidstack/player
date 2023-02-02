function SingleSource() {
  return <MediaPlayer src="https://media-files.vidstack.io/720p.mp4" />;
}

function MultipleSources() {
  return (
    <MediaPlayer
      src={[
        // Audio
        { src: 'https://media-files.vidstack.io/audio.mp3', type: 'audio/mpeg' },
        { src: 'https://media-files.vidstack.io/audio.ogg', type: 'audio/ogg' },
        // Video
        { src: 'https://media-files.vidstack.io/720p.ogv', type: 'video/ogg' },
        { src: 'https://media-files.vidstack.io/720p.avi', type: 'video/avi' },
        { src: 'https://media-files.vidstack.io/720p.mp4', type: 'video/mp4' },
        // HLS
        { src: 'https://media-files.vidstack.io/hls/index.m3u8', type: 'application/x-mpegurl' },
      ]}
    />
  );
}
