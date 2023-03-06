// tsup.config.ts
import fs from "node:fs";
import "node:path";
import { esbuild as maverick } from "@maverick-js/compiler";
import { globbySync } from "globby";
import { defineConfig } from "tsup";
var defineEntries = globbySync("src/define/*.ts").reduce((entries, file) => {
  const entry = file.replace("src/", "").replace(/\.ts$/, "");
  entries[entry] = file;
  return entries;
}, {});
if (!fs.existsSync("define"))
  fs.mkdirSync("define");
for (const entry of Object.keys(defineEntries)) {
  fs.writeFileSync(entry + ".js", "// editor file - real file exists in `dist` dir");
}
var defaultStyles = fs.readFileSync("styles/base.css", "utf-8");
for (const file of fs.readdirSync("styles/ui", "utf-8")) {
  defaultStyles += "\n" + fs.readFileSync(`styles/ui/${file}`, "utf-8");
}
fs.writeFileSync("styles/defaults.css", defaultStyles);
var SERVER_CONFIG = dist({ dev: false, server: true, hydrate: false });
var DEV_CONFIG = dist({ dev: true, server: false, hydrate: true });
var PROD_CONFIG = dist({ dev: false, server: false, hydrate: true });
var CDN_DEV_CONFIG = cdn({ dev: true });
var CDN_PROD_CONFIG = cdn({ dev: false });
function dist({ dev, server, hydrate }) {
  return {
    entry: {
      index: "src/index.ts",
      elements: "src/elements.ts",
      ...defineEntries
    },
    format: server ? ["esm", "cjs"] : "esm",
    external: ["maverick.js", "hls.js"],
    clean: false,
    treeshake: true,
    bundle: true,
    tsconfig: "tsconfig.build.json",
    target: server ? "node16" : "esnext",
    platform: server ? "node" : "browser",
    outDir: server ? "dist/server" : dev ? "dist/dev" : "dist/prod",
    define: {
      __DEV__: dev ? "true" : "false",
      __SERVER__: server ? "true" : "false",
      __TEST__: "false"
    },
    esbuildPlugins: [
      maverick({
        include: "src/**/*.tsx",
        generate: server ? "ssr" : "dom",
        hydratable: hydrate,
        diffArrays: false
      })
    ],
    esbuildOptions(opts) {
      if (!dev && !server)
        opts.mangleProps = /^_/;
      opts.conditions = dev ? ["development", "production", "default"] : ["production", "default"];
      opts.chunkNames = "chunks/[name]-[hash]";
    }
  };
}
function cdn({ dev = false } = {}) {
  return {
    ...dist({ dev, server: false, hydrate: false }),
    entry: { [dev ? "dev" : "prod"]: "src/cdn.ts" },
    target: "es2020",
    minify: !dev,
    noExternal: ["maverick.js", "media-icons"],
    outDir: `dist/cdn`
  };
}
var tsup_config_default = defineConfig([
  SERVER_CONFIG,
  DEV_CONFIG,
  PROD_CONFIG,
  CDN_DEV_CONFIG,
  CDN_PROD_CONFIG
]);
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL3YucmFoaW0uYWx3ZXIvRGVza3RvcC9Qcm9qZWN0cy92aWRzdGFjay9wYWNrYWdlcy92aWRzdGFjay90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvVXNlcnMvdi5yYWhpbS5hbHdlci9EZXNrdG9wL1Byb2plY3RzL3ZpZHN0YWNrL3BhY2thZ2VzL3ZpZHN0YWNrXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9Vc2Vycy92LnJhaGltLmFsd2VyL0Rlc2t0b3AvUHJvamVjdHMvdmlkc3RhY2svcGFja2FnZXMvdmlkc3RhY2svdHN1cC5jb25maWcudHNcIjtpbXBvcnQgZnMgZnJvbSAnbm9kZTpmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuXG5pbXBvcnQgeyBlc2J1aWxkIGFzIG1hdmVyaWNrIH0gZnJvbSAnQG1hdmVyaWNrLWpzL2NvbXBpbGVyJztcbmltcG9ydCB7IGdsb2JieVN5bmMgfSBmcm9tICdnbG9iYnknO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCB0eXBlIE9wdGlvbnMgfSBmcm9tICd0c3VwJztcblxuLy8gQnVpbGQgZGVmaW5lIGRpcmVjdG9yeS5cblxuY29uc3QgZGVmaW5lRW50cmllcyA9IGdsb2JieVN5bmMoJ3NyYy9kZWZpbmUvKi50cycpLnJlZHVjZSgoZW50cmllcywgZmlsZSkgPT4ge1xuICBjb25zdCBlbnRyeSA9IGZpbGUucmVwbGFjZSgnc3JjLycsICcnKS5yZXBsYWNlKC9cXC50cyQvLCAnJyk7XG4gIGVudHJpZXNbZW50cnldID0gZmlsZTtcbiAgcmV0dXJuIGVudHJpZXM7XG59LCB7fSk7XG5cbmlmICghZnMuZXhpc3RzU3luYygnZGVmaW5lJykpIGZzLm1rZGlyU3luYygnZGVmaW5lJyk7XG5mb3IgKGNvbnN0IGVudHJ5IG9mIE9iamVjdC5rZXlzKGRlZmluZUVudHJpZXMpKSB7XG4gIGZzLndyaXRlRmlsZVN5bmMoZW50cnkgKyAnLmpzJywgJy8vIGVkaXRvciBmaWxlIC0gcmVhbCBmaWxlIGV4aXN0cyBpbiBgZGlzdGAgZGlyJyk7XG59XG5cbi8vIENTUyBtZXJnZS5cblxubGV0IGRlZmF1bHRTdHlsZXMgPSBmcy5yZWFkRmlsZVN5bmMoJ3N0eWxlcy9iYXNlLmNzcycsICd1dGYtOCcpO1xuXG5mb3IgKGNvbnN0IGZpbGUgb2YgZnMucmVhZGRpclN5bmMoJ3N0eWxlcy91aScsICd1dGYtOCcpKSB7XG4gIGRlZmF1bHRTdHlsZXMgKz0gJ1xcbicgKyBmcy5yZWFkRmlsZVN5bmMoYHN0eWxlcy91aS8ke2ZpbGV9YCwgJ3V0Zi04Jyk7XG59XG5cbmZzLndyaXRlRmlsZVN5bmMoJ3N0eWxlcy9kZWZhdWx0cy5jc3MnLCBkZWZhdWx0U3R5bGVzKTtcblxuLy8gQnVpbGQgY29uZmlndXJhdGlvbnMuXG5cbmNvbnN0IFNFUlZFUl9DT05GSUcgPSBkaXN0KHsgZGV2OiBmYWxzZSwgc2VydmVyOiB0cnVlLCBoeWRyYXRlOiBmYWxzZSB9KSxcbiAgREVWX0NPTkZJRyA9IGRpc3QoeyBkZXY6IHRydWUsIHNlcnZlcjogZmFsc2UsIGh5ZHJhdGU6IHRydWUgfSksXG4gIFBST0RfQ09ORklHID0gZGlzdCh7IGRldjogZmFsc2UsIHNlcnZlcjogZmFsc2UsIGh5ZHJhdGU6IHRydWUgfSksXG4gIENETl9ERVZfQ09ORklHID0gY2RuKHsgZGV2OiB0cnVlIH0pLFxuICBDRE5fUFJPRF9DT05GSUcgPSBjZG4oeyBkZXY6IGZhbHNlIH0pO1xuXG5pbnRlcmZhY2UgQnVuZGxlT3B0aW9ucyB7XG4gIGRldjogYm9vbGVhbjtcbiAgc2VydmVyOiBib29sZWFuO1xuICBoeWRyYXRlOiBib29sZWFuO1xufVxuXG5mdW5jdGlvbiBkaXN0KHsgZGV2LCBzZXJ2ZXIsIGh5ZHJhdGUgfTogQnVuZGxlT3B0aW9ucyk6IE9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIGVudHJ5OiB7XG4gICAgICBpbmRleDogJ3NyYy9pbmRleC50cycsXG4gICAgICBlbGVtZW50czogJ3NyYy9lbGVtZW50cy50cycsXG4gICAgICAuLi5kZWZpbmVFbnRyaWVzLFxuICAgIH0sXG4gICAgZm9ybWF0OiBzZXJ2ZXIgPyBbJ2VzbScsICdjanMnXSA6ICdlc20nLFxuICAgIGV4dGVybmFsOiBbJ21hdmVyaWNrLmpzJywgJ2hscy5qcyddLFxuICAgIGNsZWFuOiBmYWxzZSxcbiAgICB0cmVlc2hha2U6IHRydWUsXG4gICAgYnVuZGxlOiB0cnVlLFxuICAgIHRzY29uZmlnOiAndHNjb25maWcuYnVpbGQuanNvbicsXG4gICAgdGFyZ2V0OiBzZXJ2ZXIgPyAnbm9kZTE2JyA6ICdlc25leHQnLFxuICAgIHBsYXRmb3JtOiBzZXJ2ZXIgPyAnbm9kZScgOiAnYnJvd3NlcicsXG4gICAgb3V0RGlyOiBzZXJ2ZXIgPyAnZGlzdC9zZXJ2ZXInIDogZGV2ID8gJ2Rpc3QvZGV2JyA6ICdkaXN0L3Byb2QnLFxuICAgIGRlZmluZToge1xuICAgICAgX19ERVZfXzogZGV2ID8gJ3RydWUnIDogJ2ZhbHNlJyxcbiAgICAgIF9fU0VSVkVSX186IHNlcnZlciA/ICd0cnVlJyA6ICdmYWxzZScsXG4gICAgICBfX1RFU1RfXzogJ2ZhbHNlJyxcbiAgICB9LFxuICAgIGVzYnVpbGRQbHVnaW5zOiBbXG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIC0gc3ltbGluayBlcnJvciAoaWdub3JlKVxuICAgICAgbWF2ZXJpY2soe1xuICAgICAgICBpbmNsdWRlOiAnc3JjLyoqLyoudHN4JyxcbiAgICAgICAgZ2VuZXJhdGU6IHNlcnZlciA/ICdzc3InIDogJ2RvbScsXG4gICAgICAgIGh5ZHJhdGFibGU6IGh5ZHJhdGUsXG4gICAgICAgIGRpZmZBcnJheXM6IGZhbHNlLFxuICAgICAgfSksXG4gICAgXSxcbiAgICBlc2J1aWxkT3B0aW9ucyhvcHRzKSB7XG4gICAgICBpZiAoIWRldiAmJiAhc2VydmVyKSBvcHRzLm1hbmdsZVByb3BzID0gL15fLztcbiAgICAgIG9wdHMuY29uZGl0aW9ucyA9IGRldiA/IFsnZGV2ZWxvcG1lbnQnLCAncHJvZHVjdGlvbicsICdkZWZhdWx0J10gOiBbJ3Byb2R1Y3Rpb24nLCAnZGVmYXVsdCddO1xuICAgICAgb3B0cy5jaHVua05hbWVzID0gJ2NodW5rcy9bbmFtZV0tW2hhc2hdJztcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBjZG4oeyBkZXYgPSBmYWxzZSB9ID0ge30pOiBPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5kaXN0KHsgZGV2LCBzZXJ2ZXI6IGZhbHNlLCBoeWRyYXRlOiBmYWxzZSB9KSxcbiAgICBlbnRyeTogeyBbZGV2ID8gJ2RldicgOiAncHJvZCddOiAnc3JjL2Nkbi50cycgfSxcbiAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICAgIG1pbmlmeTogIWRldixcbiAgICBub0V4dGVybmFsOiBbJ21hdmVyaWNrLmpzJywgJ21lZGlhLWljb25zJ10sXG4gICAgb3V0RGlyOiBgZGlzdC9jZG5gLFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoW1xuICBTRVJWRVJfQ09ORklHLFxuICBERVZfQ09ORklHLFxuICBQUk9EX0NPTkZJRyxcbiAgQ0ROX0RFVl9DT05GSUcsXG4gIENETl9QUk9EX0NPTkZJRyxcbl0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VSxPQUFPLFFBQVE7QUFDN1YsT0FBaUI7QUFFakIsU0FBUyxXQUFXLGdCQUFnQjtBQUNwQyxTQUFTLGtCQUFrQjtBQUMzQixTQUFTLG9CQUFrQztBQUkzQyxJQUFNLGdCQUFnQixXQUFXLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxTQUFTLFNBQVM7QUFDNUUsUUFBTSxRQUFRLEtBQUssUUFBUSxRQUFRLEVBQUUsRUFBRSxRQUFRLFNBQVMsRUFBRTtBQUMxRCxVQUFRLFNBQVM7QUFDakIsU0FBTztBQUNULEdBQUcsQ0FBQyxD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
