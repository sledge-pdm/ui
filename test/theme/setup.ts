import { afterEach, beforeEach, vi } from 'vitest';

// Mock for matchMedia
export const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

export function setupThemeTest() {
  beforeEach(() => {
    // Reset CSS properties
    document.documentElement.style.cssText = '';
    // Reset adopted stylesheets
    document.adoptedStyleSheets = [];

    // Default matchMedia mock
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
}
