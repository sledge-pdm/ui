import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';
import { defineConfig } from 'vitest/config';

const browser = () => ({
  provider: playwright(),
  enabled: true,
  headless: true,
  instances: [{ browser: 'chromium' as const }],
  screenshotFailures: false,
});

export default defineConfig({
  resolve: {
    alias: {
      '~': path.join(__dirname, 'src'),
    },
  },
  test: {
    diff: {
      // truncate too long buffer diff
      truncateThreshold: 20,
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['test/**/*.test.ts'],
          exclude: ['**/node_modules/**', '**/dist/**'],
          browser: browser(),
        },
      },
      {
        // every story becomes a test: stories without a play function are smoke-tested
        // (renders without error), stories with one also run it
        extends: true,
        plugins: [storybookTest({ configDir: path.join(__dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: browser(),
        },
      },
    ],
  },
});
