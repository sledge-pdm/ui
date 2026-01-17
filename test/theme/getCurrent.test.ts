import { describe, expect, it } from 'vitest';
import { applyBuiltinTheme, getCurrentBuiltinTheme } from '../../src/theme/Theme';
import { setupThemeTest } from './setup';

describe('getCurrentBuiltinTheme', () => {
  setupThemeTest();

  it('should detect light theme', () => {
    applyBuiltinTheme('light');
    expect(getCurrentBuiltinTheme()).toBe('light');
  });

  it('should detect dark theme', () => {
    applyBuiltinTheme('dark');
    expect(getCurrentBuiltinTheme()).toBe('dark');
  });

  it('should detect dark-gy-flip theme', () => {
    applyBuiltinTheme('dark-gy-flip');
    expect(getCurrentBuiltinTheme()).toBe('dark-gy-flip');
  });

  it('should detect black theme', () => {
    applyBuiltinTheme('black');
    expect(getCurrentBuiltinTheme()).toBe('black');
  });

  it('should return null for unknown theme', () => {
    // Set unknown background color
    document.documentElement.style.setProperty('--color-background', '#123456');
    expect(getCurrentBuiltinTheme()).toBe(null);
  });
});
