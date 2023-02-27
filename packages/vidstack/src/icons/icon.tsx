export function Icon({ slot, paths }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-media-icon="true"
      slot={slot}
      $prop:innerHTML={paths}
    ></svg>
  );
}

export interface IconProps {
  slot?: string;
  paths: string;
}
