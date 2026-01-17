import { describe, expect, it, vi } from 'vitest';
import { watchOSTheme } from '../../src/theme/Theme';
import { mockMatchMedia, setupThemeTest } from './setup';

describe('watchOSTheme', () => {
  setupThemeTest();

  it('should setup and teardown event listener', () => {
    const mockAddEventListener = vi.fn();
    const mockRemoveEventListener = vi.fn();
    const callback = vi.fn();

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const stopWatching = watchOSTheme(callback);

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    stopWatching();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should call callback on theme change', () => {
    const callback = vi.fn();
    let changeHandler: (e: MediaQueryListEvent) => void;

    const mockAddEventListener = vi.fn((event, handler) => {
      if (event === 'change') {
        changeHandler = handler;
      }
    });

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: vi.fn(),
    });

    watchOSTheme(callback);

    // Simulate theme change
    changeHandler!({ matches: true } as MediaQueryListEvent);

    expect(callback).toHaveBeenCalledWith(true);
  });
});
