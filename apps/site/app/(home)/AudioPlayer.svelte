<div class="flex justify-center 1200:inline-block relative w-full 1200:w-[120%] 1280:w-[110%] z-10">
  <media-player
    class="z-50 top-0 w-full 1200:absolute 1200:-left-[20%] 1200:w-[120%] 1280:-left-[10%] 1280:w-[110%] h-full mb-1 mt-10 1200:mt-8 hero-audio 1200:hover:translate-y-8 data-[playing]:1200:translate-y-8 transition-transform"
    src="https://media-files.vidstack.io/sprite-fight/audio.mp3"
    title="Sprite Fight"
    view-type="audio"
    volume={0.2}
    key-target="document"
    crossorigin=""
    style="--audio-brand: rgb(124 58 237);"
  >
    <media-outlet>
      <track
        src="/media/sprite-fight.vtt"
        label="English"
        srclang="en-US"
        kind="subtitles"
        default
      />
      <track
        src="https://media-files.vidstack.io/sprite-fight/chapters.vtt"
        srclang="en-US"
        kind="chapters"
        default
      />
    </media-outlet>
    <media-community-skin />
  </media-player>
</div>

<style>
  media-community-skin {
    border: 1px solid rgb(255 255 255 / 0.1);
  }
</style>
