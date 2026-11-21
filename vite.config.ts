import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'node:fs';
import path from 'node:path';

const versionTrackerPlugin = (): Plugin => {
  const buildTimestamp = Date.now().toString();
  const buildTimeIso = new Date().toISOString();
  const versionPayload = JSON.stringify(
    {
      version: buildTimestamp,
      buildTime: buildTimeIso,
    },
    null,
    2,
  );

  return {
    name: 'version-tracker-plugin',
    config: () => ({
      define: {
        __APP_VERSION__: JSON.stringify(buildTimestamp),
        __APP_BUILD_TIME__: JSON.stringify(buildTimeIso),
      },
    }),
    buildStart() {
      const publicDir = path.resolve(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(publicDir, 'version.json'),
        versionPayload,
        'utf-8',
      );
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/version.json')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader(
            'Cache-Control',
            'no-store, no-cache, must-revalidate',
          );
          res.end(versionPayload);
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: versionPayload,
      });
    },
  };
};

export default defineConfig({
  server: {
    port: 3030,
    strictPort: true,
  },
  plugins: [
    react(),
    versionTrackerPlugin(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'AssetFlow Admin',
        short_name: 'AssetFlow',
        description: 'AssetFlow Administration Dashboard',
        theme_color: '#10B981',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/logo-icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo-icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globIgnores: ['**/version.json', '**/index.html'],
        navigateFallback: null,
      },
    }),
  ],
});
