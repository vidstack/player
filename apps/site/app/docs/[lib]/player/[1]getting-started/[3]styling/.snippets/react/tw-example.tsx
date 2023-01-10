function Example() {
  return (
    <div className="relative h-6 w-full bg-gray-200">
      <div
        className="
          media-waiting:bg-sky-500 absolute top-0 left-0 h-full w-full origin-left
          scale-x-[calc(var(--vds-current-time)/var(--vds-duration))]
          transform bg-gray-400 will-change-transform
        "
      />
    </div>
  );
}
