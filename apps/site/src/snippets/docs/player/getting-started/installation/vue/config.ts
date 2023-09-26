vue({
  template: {
    compilerOptions: {
      // @hl-start
      isCustomElement: (tag) => tag.startsWith('media-'),
      // @hl-end
    },
  },
});
