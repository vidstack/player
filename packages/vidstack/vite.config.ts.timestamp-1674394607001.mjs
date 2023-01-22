// vite.config.ts
import { vite as maverick } from "file:///Users/v.rahim.alwer/Desktop/Projects/vidstack/node_modules/.pnpm/@maverick-js+compiler@0.30.0/node_modules/@maverick-js/compiler/dist/index.js";
import { defineConfig } from "file:///Users/v.rahim.alwer/Desktop/Projects/vidstack/node_modules/.pnpm/vite@4.0.4/node_modules/vite/dist/node/index.js";
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
      hydratable: true,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdi5yYWhpbS5hbHdlci9EZXNrdG9wL1Byb2plY3RzL3ZpZHN0YWNrL3BhY2thZ2VzL3ZpZHN0YWNrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdi5yYWhpbS5hbHdlci9EZXNrdG9wL1Byb2plY3RzL3ZpZHN0YWNrL3BhY2thZ2VzL3ZpZHN0YWNrL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy92LnJhaGltLmFsd2VyL0Rlc2t0b3AvUHJvamVjdHMvdmlkc3RhY2svcGFja2FnZXMvdmlkc3RhY2svdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgeyB2aXRlIGFzIG1hdmVyaWNrIH0gZnJvbSAnQG1hdmVyaWNrLWpzL2NvbXBpbGVyJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCBTRVJWRVIgPSAhIXByb2Nlc3MuZW52LlNFUlZFUjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgZGVmaW5lOiB7XG4gICAgX19ERVZfXzogJ3RydWUnLFxuICAgIF9fVEVTVF9fOiAndHJ1ZScsXG4gICAgX19TRVJWRVJfXzogU0VSVkVSID8gJ3RydWUnIDogJ2ZhbHNlJyxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnJHRlc3QtdXRpbHMnOiAnL3NyYy90ZXN0LXV0aWxzJyxcbiAgICAgICd2aWRzdGFjay9lbGVtZW50cyc6ICcvc3JjL2VsZW1lbnRzJyxcbiAgICAgICd2aWRzdGFjay9wbGF5ZXInOiAnL3NyYy9wbGF5ZXInLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbWF2ZXJpY2suanMnXSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIG1hdmVyaWNrKHtcbiAgICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoue2pzeCx0c3h9J10sXG4gICAgICBoeWRyYXRhYmxlOiB0cnVlLFxuICAgICAgZGlmZkFycmF5czogZmFsc2UsXG4gICAgfSksXG4gIF0sXG4gIC8vIGh0dHBzOi8vdml0ZXN0LmRldi9jb25maWdcbiAgdGVzdDoge1xuICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoudGVzdC50cyddLFxuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWydzcmMvdGVzdC11dGlscy9zZXR1cC50cyddLFxuICAgIHRlc3RUaW1lb3V0OiAyNTAwLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxRQUFRLGdCQUFnQjtBQUNqQyxTQUFTLG9CQUFvQjtBQUU3QixJQUFNLFNBQVMsQ0FBQyxDQUFDLFFBQVEsSUFBSTtBQUU3QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixZQUFZLFNBQVMsU0FBUztBQUFBLEVBQ2hDO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsTUFDZixxQkFBcUI7QUFBQSxNQUNyQixtQkFBbUI7QUFBQSxJQUNyQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxhQUFhO0FBQUEsRUFDekI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFNBQVM7QUFBQSxNQUNQLFNBQVMsQ0FBQyxvQkFBb0I7QUFBQSxNQUM5QixZQUFZO0FBQUEsTUFDWixZQUFZO0FBQUEsSUFDZCxDQUFDO0FBQUEsRUFDSDtBQUFBO0FBQUEsRUFFQSxNQUFNO0FBQUEsSUFDSixTQUFTLENBQUMsa0JBQWtCO0FBQUEsSUFDNUIsU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWSxDQUFDLHlCQUF5QjtBQUFBLElBQ3RDLGFBQWE7QUFBQSxFQUNmO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
