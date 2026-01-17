import { RGBAToHex, type RGBA } from '@sledge-pdm/core';
import { describe, expect, it, vi } from 'vitest';
import { applyBuiltinTheme, applyTheme, applyUserTheme, getBuiltinThemeVars, type UserTheme } from '../../src/theme/Theme';
import { getCSSProperty } from '../../src/theme/vars';
import { mockMatchMedia, setupThemeTest } from './setup';

const rgbaToCssValue = (color: RGBA): string => {
  const includeAlpha = color[3] !== 255;
  return RGBAToHex(color, { withSharp: true, excludeAlpha: !includeAlpha });
};

const expectThemeVar = (property: string, color: RGBA): void => {
  expect(getCSSProperty(property)).toBe(rgbaToCssValue(color));
};

describe('applyBuiltinTheme', () => {
  setupThemeTest();

  it('should apply light theme correctly', () => {
    applyBuiltinTheme('light');
    const lightTheme = getBuiltinThemeVars('light');

    expectThemeVar('--color-background', lightTheme['--color-background']);
    expectThemeVar('--color-accent', lightTheme['--color-accent']);
  });

  it('should apply dark theme correctly', () => {
    applyBuiltinTheme('dark');
    const darkTheme = getBuiltinThemeVars('dark');

    expectThemeVar('--color-background', darkTheme['--color-background']);
    expectThemeVar('--color-accent', darkTheme['--color-accent']);
  });

  it('should apply dark-gy-flip theme correctly', () => {
    applyBuiltinTheme('dark-gy-flip');
    const darkGyFlipTheme = getBuiltinThemeVars('dark-gy-flip');

    expectThemeVar('--color-background', darkGyFlipTheme['--color-background']);
    expectThemeVar('--color-accent', darkGyFlipTheme['--color-accent']);
    expectThemeVar('--color-active', darkGyFlipTheme['--color-active']);
  });

  it('should apply black theme correctly', () => {
    applyBuiltinTheme('black');
    const blackTheme = getBuiltinThemeVars('black');

    expectThemeVar('--color-background', blackTheme['--color-background']);
    expectThemeVar('--color-accent', blackTheme['--color-accent']);
  });

  it('should handle os theme based on system preference', () => {
    const lightTheme = getBuiltinThemeVars('light');
    const darkTheme = getBuiltinThemeVars('dark');

    // Test light OS theme
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    applyBuiltinTheme('os');
    expectThemeVar('--color-background', lightTheme['--color-background']);

    // Test dark OS theme
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    applyBuiltinTheme('os');
    expectThemeVar('--color-background', darkTheme['--color-background']);
  });
});

describe('applyUserTheme', () => {
  it('should apply user-defined CSS theme', () => {
    const customCSS = `
        :root {
          --color-background: #ff0000;
          --color-accent: #00ffff;
        }
      `;

    applyUserTheme(customCSS);

    expect(document.adoptedStyleSheets.length).toBe(1);
    // Note: In jsdom, we can't easily test CSS custom property values from adopted stylesheets
    // But we can test that the stylesheet was added
  });

  it('should replace existing user theme', () => {
    const firstCSS = ':root { --color-background: #ff0000; }';
    const secondCSS = ':root { --color-background: #00ff00; }';

    applyUserTheme(firstCSS);
    expect(document.adoptedStyleSheets.length).toBe(1);

    applyUserTheme(secondCSS);
    expect(document.adoptedStyleSheets.length).toBe(1);
  });
});

describe('applyTheme', () => {
  it('should handle builtin theme string', () => {
    applyTheme('dark');
    const darkTheme = getBuiltinThemeVars('dark');
    expectThemeVar('--color-background', darkTheme['--color-background']);
  });

  it('should handle user theme object', () => {
    const userTheme: UserTheme = {
      name: 'Custom Red',
      css: ':root { --color-background: #ff0000; }',
    };

    applyTheme(userTheme);
    expect(document.adoptedStyleSheets.length).toBe(1);
  });
});
