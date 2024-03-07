import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import { flatRoutes } from "remix-flat-routes";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from "@vercel/remix/vite";

installGlobals();

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    remix({
      presets: [vercelPreset()],
      ignoredRouteFiles: ["**/.*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
    }),
    tsconfigPaths(),
  ],
});
