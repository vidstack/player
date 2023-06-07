export function Icon({ slot, part, paths, rotate }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-media-icon="true"
      data-rotate={rotate}
      slot={slot}
      part={part}
      $prop:innerHTML={paths}
    ></svg>
  );
}

export interface IconProps {
  slot?: string;
  part?: string;
  paths: string;
  rotate?: boolean;
}
