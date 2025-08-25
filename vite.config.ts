/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    projects: [
      // プロジェクト1：通常のユニットテスト用
      {
        // ★ 修正点: testオブジェクトの中に設定を記述
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          include: ['src/**/*.test.{js,ts,jsx,tsx}'],
        },
      },

      // プロジェクト2：Storybookのテスト用
      {
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            name: 'chromium',
          },
          include: ['src/**/*.stories.test.{js,ts,jsx,tsx}'],
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});