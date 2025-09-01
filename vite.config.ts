import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
        env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY,
      ),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        env.SUPABASE_URL || env.VITE_SUPABASE_URL,
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        env.SUPABASE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY,
      ),
      global: 'globalThis',
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react'],
            utils: ['clsx', 'tailwind-merge'],
            firebase: ['firebase/app', 'firebase/functions'],
            supabase: ['@supabase/supabase-js'],
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.[^/.]+$/, '')
              : 'chunk';
            return `js/${facadeModuleId}-[hash].js`;
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Node.js polyfills for Twilio compatibility
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        util: 'util',
        buffer: 'buffer',
        process: 'process/browser',
        querystring: 'querystring-es3',
        url: 'url',
      },
    },
    optimizeDeps: {
      include: [
        'buffer',
        'process',
        'crypto-browserify',
        'stream-browserify',
        'querystring-es3',
        'url',
      ],
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico'],
        manifest: {
          name: 'CORNMAN - Strategic HQ',
          short_name: 'CORNMAN HQ',
          description: 'Urban Streetwear Business Operating System for Strategic Management',
          theme_color: '#39FF14',
          background_color: '#121212',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            { src: 'favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { src: 'favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
          ],
          categories: ['business', 'productivity'],
          lang: 'en-US',
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'gemini-api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 3, // 3 days
                },
                networkTimeoutSeconds: 10,
                plugins: [
                  {
                    cacheKeyWillBeUsed: async ({ request }) => {
                      // Create stable cache key based on request body content
                      const url = new URL(request.url);
                      if (request.method === 'POST' && request.body) {
                        const body = await request.clone().text();
                        const hash = await crypto.subtle.digest(
                          'SHA-256',
                          new TextEncoder().encode(body),
                        );
                        const hashArray = Array.from(new Uint8Array(hash));
                        const hashHex = hashArray
                          .map((b) => b.toString(16).padStart(2, '0'))
                          .join('');
                        return `${url.pathname}_${hashHex.substring(0, 16)}`;
                      }
                      return `${url.pathname}_${url.search}`;
                    },
                    cachedResponseWillBeUsed: async ({ cachedResponse }) => {
                      // Serve cached AI responses when offline
                      return cachedResponse;
                    },
                  },
                ],
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-stylesheets',
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'tailwind-cdn',
                expiration: {
                  maxEntries: 5,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                },
              },
            },
          ],
          skipWaiting: true,
          clientsClaim: true,
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    server: {
      proxy: {
        // Route to Firebase functions emulator
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
      },
    },
  };
});
