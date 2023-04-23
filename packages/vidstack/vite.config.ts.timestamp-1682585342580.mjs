// vite.config.ts
import { vite as maverick } from "file:///Users/v.rahim.alwer/Desktop/Projects/vidstack/node_modules/.pnpm/@maverick-js+compiler@0.35.2/node_modules/@maverick-js/compiler/dist/index.js";
import { defineConfig } from "file:///Users/v.rahim.alwer/Desktop/Projects/vidstack/node_modules/.pnpm/vite@4.2.1/node_modules/vite/dist/node/index.js";
var SERVER = !!process.env.SERVER;
var vite_config_default = defineConfig({
  define: {
    __DEV__: "true",
    __TEST__: "true",
    __SERVER__: SERVER ? "true" : "false"
  },
  resolve: {
    alias: {
      "$test-utils": "/src/test-utils",
      "vidstack/elements": "/src/elements",
      "vidstack/player": "/src/player"
    }
  },
  optimizeDeps: {
    exclude: ["maverick.js"]
  },
  plugins: [
    maverick({
      include: ["src/**/*.{jsx,tsx}"],
      hydratable: (id) => !id.includes("time-slider/chapters"),
      diffArrays: false
    })
  ],
  // https://vitest.dev/config
  test: {
    include: ["src/**/*.test.ts"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/test-utils/setup.ts"],
    testTimeout: 2500
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdi5yYWhpbS5hbHdlci9EZXNrdG9wL1Byb2plY3RzL3ZpZHN0YWNrL3BhY2thZ2VzL3ZpZHN0YWNrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdi5yYWhpbS5hbHdlci9EZXNrdG9wL1Byb2plY3RzL3ZpZHN0YWNrL3BhY2thZ2VzL3ZpZHN0YWNrL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy92LnJhaGltLmFsd2VyL0Rlc2t0b3AvUHJvamVjdHMvdmlkc3RhY2svcGFja2FnZXMvdmlkc3RhY2svdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgeyB2aXRlIGFzIG1hdmVyaWNrIH0gZnJvbSAnQG1hdmVyaWNrLWpzL2NvbXBpbGVyJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCBTRVJWRVIgPSAhIXByb2Nlc3MuZW52LlNFUlZFUjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgZGVmaW5lOiB7XG4gICAgX19ERVZfXzogJ3RydWUnLFxuICAgIF9fVEVTVF9fOiAndHJ1ZScsXG4gICAgX19TRVJWRVJfXzogU0VSVkVSID8gJ3RydWUnIDogJ2ZhbHNlJyxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnJHRlc3QtdXRpbHMnOiAnL3NyYy90ZXN0LXV0aWxzJyxcbiAgICAgICd2aWRzdGFjay9lbGVtZW50cyc6ICcvc3JjL2VsZW1lbnRzJyxcbiAgICAgICd2aWRzdGFjay9wbGF5ZXInOiAnL3NyYy9wbGF5ZXInLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbWF2ZXJpY2suanMnXSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIG1hdmVyaWNrKHtcbiAgICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoue2pzeCx0c3h9J10sXG4gICAgICBoeWRyYXRhYmxlOiAoaWQpID0+ICFpZC5pbmNsdWRlcygndGltZS1zbGlkZXIvY2hhcHRlcnMnKSxcbiAgICAgIGRpZmZBcnJheXM6IGZhbHNlLFxuICAgIH0pLFxuICBdLFxuICAvLyBodHRwczovL3ZpdGVzdC5kZXYvY29uZmlnXG4gIHRlc3Q6IHtcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnRlc3QudHMnXSxcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6IFsnc3JjL3Rlc3QtdXRpbHMvc2V0dXAudHMnXSxcbiAgICB0ZXN0VGltZW91dDogMjUwMCxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsUUFBUSxnQkFBZ0I7QUFDakMsU0FBUyxvQkFBb0I7QUFFN0IsSUFBTSxTQUFTLENBQUMsQ0FBQyxRQUFRLElBQUk7QUFFN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsWUFBWSxTQUFTLFNBQVM7QUFBQSxFQUNoQztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsZUFBZTtBQUFBLE1BQ2YscUJBQXFCO0FBQUEsTUFDckIsbUJBQW1CO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsYUFBYTtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUEsTUFDUCxTQUFTLENBQUMsb0JBQW9CO0FBQUEsTUFDOUIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsc0JBQXNCO0FBQUEsTUFDdkQsWUFBWTtBQUFBLElBQ2QsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBLEVBRUEsTUFBTTtBQUFBLElBQ0osU0FBUyxDQUFDLGtCQUFrQjtBQUFBLElBQzVCLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVksQ0FBQyx5QkFBeUI7QUFBQSxJQUN0QyxhQUFhO0FBQUEsRUFDZjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
