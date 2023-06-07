<script>
  import FeatureItem from './FeatureItem.svelte';

  import PerformanceIcon from './icons/PerformanceIcon.svelte';
  import AccessibleIcon from './icons/AccessibleIcon.svelte';
  import CustomizableIcon from './icons/CustomizableIcon.svelte';
  import FrameworkIcon from './icons/FrameworkIcon.svelte';
  import StateManagementIcon from './icons/StateManagementIcon.svelte';
  import StreamTypeIcon from './icons/StreamTypeIcon.svelte';
</script>

<section class="flex flex-col items-center justify-center px-4 768:px-12">
  <div
    class="text-center w-full flex flex-col items-center mt-16 1200:mt-48 mb-16 768:mt-24 768:mb-20"
  >
    <div class="h-20 w-px bg-gradient-to-b from-brand/0 to-brand" />
    <h2
      class="mt-6 font-bold text-brand dark:text-transparent text-lg dark:bg-gradient-to-r from-brand to-[#FB7185] bg-clip-text"
    >
      Why Vidstack Player?
    </h2>
  </div>

  <div
    class="grid grid-cols-1 gap-y-10 768:grid-cols-2 992:grid-cols-3 992:gap-y-16 992:gap-x-10 gap-x-32 768:gap-y-20"
  >
    <FeatureItem title="Accessible">
      <AccessibleIcon slot="icon" />
      All components are built with accessibility in mind. We provide keyboard shortcuts, focus states,
      customizable captions, and apply all ARIA labels/roles according to WAI-ARIA standards.
    </FeatureItem>
    <FeatureItem title="Performant">
      <PerformanceIcon slot="icon" />
      We’re committed to delivering the lightest and fastest player package possible. Vidstack Player
      is built on signals, completely modular, lazy loads out of the box, and can render server-side
      (SSR).
    </FeatureItem>
    <FeatureItem title="Customizable">
      <CustomizableIcon slot="icon" />
      You'll find beautifully pre-styled skins and UI components which can be further customized. If
      you're building something completely unique, our headless option is a perfect fit.
    </FeatureItem>
    <FeatureItem title="Framework Agnostic">
      <FrameworkIcon slot="icon" />
      We strive to provide a smooth development experience regardless of which framework you choose.
      Vidstack Player integrates with Web Components, React, Vue (soon), Svelte (soon), and Tailwind
      CSS.
    </FeatureItem>
    <FeatureItem title="State Management">
      <StateManagementIcon slot="icon" />
      Managing media player state is hard. We handle it all and provide easy to work with hooks for reading
      and updating media state. You'll also find a rich event system for tracking state changes and how
      they were triggered.
    </FeatureItem>
    <FeatureItem title="Stream Types">
      <StreamTypeIcon slot="icon" />
      On-demand, live, and low-latency live stream types are supported through our HLS provider. Our
      UI components also adjust to the current stream type, ensuring a smooth user experience.
    </FeatureItem>
  </div>
</section>
