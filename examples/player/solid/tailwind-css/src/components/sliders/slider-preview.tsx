import { Show, type JSX } from 'solid-js';

export function SliderPreview(props: SliderPreviewProps) {
  return (
    <media-slider-preview
      class="flex flex-col items-center opacity-0 transition-opacity duration-200 data-[visible]:opacity-100"
      noClamp={props.noClamp}
    >
      <Show when={props.thumbnails}>
        <media-slider-thumbnail
          class="block h-[var(--thumbnail-height)] max-h-[160px] min-h-[80px] w-[var(--thumbnail-width)] min-w-[120px] max-w-[180px] overflow-hidden border border-white bg-black"
          src={props.thumbnails}
        />
      </Show>

      {props.children}
    </media-slider-preview>
  );
}

export interface SliderPreviewProps {
  thumbnails?: string;
  noClamp?: boolean;
  children: JSX.Element;
}
