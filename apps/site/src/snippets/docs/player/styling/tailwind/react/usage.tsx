function Example() {
  return (
    <MediaPlayer>
      {/* show when paused */}
      <div className="media-paused:opacity-100 opacity-0"></div>

      {/* hide when paused  */}
      <div className="media-paused:opacity-0"></div>

      {/* hide when _not_ playing  */}
      <div className="not-media-playing:opacity-0"></div>
    </MediaPlayer>
  );
}
