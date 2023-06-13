<MediaPlayer>
  <MediaOutlet>
    <MediaGesture className="top-0 left-0 h-full w-full" event="pointerup" action="toggle:paused" />
    <MediaGesture
      className="top-0 left-0 h-full w-full"
      event="dblpointerup"
      action="toggle:fullscreen"
    />
    <MediaGesture
      className="top-0 left-0 z-10 h-full w-1/5"
      event="dblpointerup"
      action="seek:-10"
    />
    <MediaGesture
      className="top-0 right-0 z-10 h-full w-1/5"
      event="dblpointerup"
      action="seek:10"
    />
  </MediaOutlet>
</MediaPlayer>;
