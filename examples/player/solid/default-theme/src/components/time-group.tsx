export function TimeGroup() {
  return (
    <div class="vds-time-group">
      <media-time class="vds-time" type="current" />
      <div class="vds-time-divider">/</div>
      <media-time class="vds-time" type="duration" />
    </div>
  );
}
