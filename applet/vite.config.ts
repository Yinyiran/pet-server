import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'import'],
        additionalData: `@use "${path.resolve(__dirname, 'src/styles/variables.scss').replace(/\\/g, '/')}" as *;\n`,
      },
    },
  },
});
