import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv } from "vite";
import { createGhPagesSpaPlugin } from "./scripts/gh-pages-spa";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isGhPages = env.VITE_ENV_NAME === "github-ci";
  const baseUrl = env.VITE_BASE_URL || "/";
  const apiHost = env.VITE_API_HOST;
  const plugins = [
    vue(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons({ autoInstall: true }),
    legacy(),
  ];
  if (isGhPages) {
    plugins.push(createGhPagesSpaPlugin(baseUrl));
  }
  return {
    plugins,
    base: baseUrl,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL('./src', import.meta.url)),
        "relationship.js": fileURLToPath(
          new URL("src/libs/relationship/src/relationship.js", import.meta.url)
        ),
      },
    },
    server: {
      proxy: apiHost
        ? {
            "/api": {
              target: apiHost,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  };
});
