<script>
  import { addJSLibToPath, jsLib } from '$src/stores/js-lib';

  import Button from '$src/components/base/Button.svelte';
  import RadialGradient from '$src/components/base/RadialGradient.svelte';
</script>

<section class="576:px-8 992:px-14 992:pt-12 1200:pb-16 mx-auto min-w-full max-w-6xl px-4">
  <RadialGradient
    color="pink"
    class="992:-translate-x-[70%] absolute top-16 left-0 z-0 -translate-x-[60%] transform"
  />
  <RadialGradient
    color="rose"
    class="992:translate-x-[75%] absolute top-12 right-0 z-0 translate-x-[60%] translate-y-20 transform"
  />
  <RadialGradient
    color="orange"
    class="992:translate-y-80 absolute top-12 right-0 z-10 translate-x-[35%] translate-y-64 transform"
  />

  <div class="relative z-20 mt-4 flex flex-col">
    <div class="flex flex-col items-center justify-center">
      <div
        class="border-inverse 992:text-base flex items-center space-x-2 rounded-full px-4 py-1.5 text-sm text-gray-600 shadow-md"
        style="background: var(--gradient-linear-rose);"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.581 8.47821L13.6371 6.64821L11.791 0.597652C11.7561 0.484003 11.6857 0.384538 11.5901 0.313875C11.4945 0.243212 11.3788 0.205078 11.2599 0.205078C11.141 0.205078 11.0253 0.243212 10.9297 0.313875C10.8341 0.384538 10.7637 0.484003 10.7288 0.597652L8.88322 6.64821L3.93878 8.47821C3.83227 8.51757 3.74039 8.58862 3.67549 8.68179C3.61059 8.77496 3.5758 8.88577 3.5758 8.99932C3.5758 9.11286 3.61059 9.22368 3.67549 9.31685C3.74039 9.41002 3.83227 9.48107 3.93878 9.52043L8.88045 11.3499L10.7271 17.5849C10.7611 17.6998 10.8314 17.8007 10.9275 17.8724C11.0236 17.9441 11.1402 17.9828 11.2601 17.9827C11.38 17.9826 11.4966 17.9438 11.5926 17.872C11.6886 17.8002 11.7588 17.6993 11.7927 17.5843L13.6393 11.3493L18.5816 9.51987C18.6883 9.48083 18.7805 9.40991 18.8457 9.31671C18.9108 9.22351 18.9457 9.11254 18.9456 8.99885C18.9456 8.88515 18.9105 8.77422 18.8453 8.68109C18.7801 8.58796 18.6878 8.51713 18.581 8.47821Z"
            fill="#161616"
          />
          <path
            d="M7.46989 14.5899L6.18433 14.1143L5.68433 12.281C5.65299 12.1628 5.58348 12.0584 5.48661 11.9838C5.38975 11.9092 5.27095 11.8688 5.14871 11.8687C5.02648 11.8686 4.90764 11.909 4.8107 11.9834C4.71375 12.0579 4.64413 12.1623 4.61267 12.2804L4.11267 14.1138L2.82767 14.5893C2.72116 14.6287 2.62928 14.6997 2.56438 14.7929C2.49948 14.8861 2.46469 14.9969 2.46469 15.1104C2.46469 15.224 2.49948 15.3348 2.56438 15.428C2.62928 15.5211 2.72116 15.5922 2.82767 15.6315L4.106 16.1054L4.60989 18.1177C4.64006 18.2378 4.70949 18.3443 4.80717 18.4205C4.90484 18.4966 5.02515 18.5379 5.149 18.5379C5.27284 18.5378 5.39311 18.4964 5.4907 18.4201C5.5883 18.3439 5.65762 18.2372 5.68767 18.1171L6.19156 16.1049L7.46989 15.631C7.57675 15.5921 7.66907 15.5213 7.7343 15.4282C7.79954 15.3351 7.83453 15.2241 7.83453 15.1104C7.83453 14.9967 7.79954 14.8858 7.7343 14.7926C7.66907 14.6995 7.57675 14.6287 7.46989 14.5899ZM5.05989 2.55487L3.74656 2.06876L3.25989 0.754874C3.22077 0.648127 3.14981 0.555969 3.05661 0.490862C2.96341 0.425755 2.85247 0.390841 2.73878 0.390841C2.62509 0.390841 2.51414 0.425755 2.42094 0.490862C2.32774 0.555969 2.25679 0.648127 2.21767 0.754874L1.73156 2.06876L0.417668 2.55487C0.311163 2.59423 0.219275 2.66528 0.154377 2.75845C0.0894788 2.85162 0.0546875 2.96244 0.0546875 3.07599C0.0546875 3.18953 0.0894788 3.30035 0.154377 3.39352C0.219275 3.48669 0.311163 3.55774 0.417668 3.5971L1.73156 4.08321L2.21767 5.3971C2.25703 5.5036 2.32807 5.59549 2.42125 5.66039C2.51442 5.72529 2.62523 5.76008 2.73878 5.76008C2.85232 5.76008 2.96314 5.72529 3.05631 5.66039C3.14948 5.59549 3.22053 5.5036 3.25989 5.3971L3.746 4.08321L5.05989 3.5971C5.1664 3.55774 5.25828 3.48669 5.32318 3.39352C5.38808 3.30035 5.42287 3.18953 5.42287 3.07599C5.42287 2.96244 5.38808 2.85162 5.32318 2.75845C5.25828 2.66528 5.1664 2.59423 5.05989 2.55487Z"
            fill="#161616"
          />
        </svg>

        <span>Vidstack Player 1.0 will launch November</span>
      </div>

      <h1
        class="992:mt-6 768:text-5xl 768:leading-[3.5rem] 768:max-w-3xl 992:text-6xl 992:leading-[4.5rem] 992:max-w-5xl mt-8 text-center text-4xl font-extrabold leading-[3rem]"
      >
        Design a modern media player only using HTML
        <span class="992:hidden">&</span>
        <span class="992:inline hidden">and</span>
        CSS
      </h1>

      <p
        class="text-soft 992:text-lg 576:text-xl mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed"
      >
        Open-source, headless, accessible, and declarative player UI framework. Completely
        customizable, lightweight, and packed with rich events.
      </p>

      <div class="mt-12 flex space-x-4">
        <Button primary type="raised" href={addJSLibToPath(`/docs/player/`, $jsLib)}>
          Try Player Beta
        </Button>
        <!-- <Button type="raised" href="/blog/why-vidstack">Why Vidstack?</Button> -->
      </div>
    </div>
  </div>
</section>
