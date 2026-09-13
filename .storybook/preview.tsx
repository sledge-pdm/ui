/** @jsxRuntime automatic */
/** @jsxImportSource solid-js */
import { createJSXDecorator, definePreview } from 'storybook-solidjs-vite';
import '../src/theme/global.css';
import { applyTheme } from '../src/theme/Theme';
import './preview.css';

export const solidDecorator = createJSXDecorator((Story, context) => {
  applyTheme(context.globals.theme);
  return (
    <main>
      <Story />
    </main>
  );
});

export default definePreview({
  addons: [],
  parameters: {
    // automatically create action args for all props that start with 'on'
    actions: {
      argTypesRegex: '^on.*',
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'dark-gy-flip', title: 'Dark (GY Flip)' },
          { value: 'black', title: 'Black' },
          { value: 'os', title: 'OS' },
        ],
      },
    },
  },
  decorators: [solidDecorator],
});
