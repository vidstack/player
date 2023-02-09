export function Icon({ width = 32, height = 32, slot, paths }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      slot={slot}
      $prop:innerHTML={paths}
    ></svg>
  );
}

export interface IconProps {
  width?: number;
  height?: number;
  slot?: string;
  paths: string;
}
