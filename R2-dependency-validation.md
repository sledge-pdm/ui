# R2 dependency validation

Verified by Codex on 2026-09-29. R0 means the resolved version in the 2026-09-28 audit; R2 means that audit's candidate version. R1 is not used. Versions below are lockfile versions, not manifest lower bounds. Only direct dependencies are listed.

## Updates retained at R0

| Package | Retained R0 | R2 candidate | Reason |
|---|---|---|---|
| `@vitest/browser` | 4.1.4 | 5.0.2 | Vitest 5 is outside Storybook addon-vitest 10.6.0 peer support; retain the shared Vitest 4 family. |
| `@vitest/browser-playwright` | 4.1.4 | 5.0.2 | Vitest 5 is outside Storybook addon-vitest 10.6.0 peer support; retain the shared Vitest 4 family. |
| `@vitest/coverage-v8` | 4.1.4 | 5.0.2 | Vitest 5 is outside Storybook addon-vitest 10.6.0 peer support; retain the shared Vitest 4 family. |
| `typescript` | 6.0.2 | 7.0.2 | TypeScript 7 removes createLanguageService used by prettier-plugin-organize-imports 4.3.0, silently disabling import organization. |
| `vitest` | 4.1.4 | 5.0.2 | Vitest 5 is outside Storybook addon-vitest 10.6.0 peer support; retain the shared Vitest 4 family. |

## Unchanged because R0 already equals R2

These entries are not deferred upgrades.

| Package or crate | R0 | R2 target | Reason |
|---|---|---|---|
| `@chromatic-com/storybook` | 5.3.1 | 5.3.1 | R0 already equals the R2 target; no version update was required. |
| `@sledge-pdm/core` | 1.2.7 | 1.2.7 | R0 already equals the R2 target; no version update was required. |
| `@storybook/addon-a11y` | 10.6.0 | 10.6.0 | R0 already equals the R2 target; no version update was required. |
| `@storybook/addon-vitest` | 10.6.0 | 10.6.0 | R0 already equals the R2 target; no version update was required. |
| `prettier-plugin-organize-imports` | 4.3.0 | 4.3.0 | Already at the R2 target; this version is the TypeScript 7 compatibility blocker. |
| `storybook` | 10.6.0 | 10.6.0 | R0 already equals the R2 target; no version update was required. |

## Validation

- Type checking, Vitest, and the static Storybook build passed: 23 files, 60 tests, including component and Storybook tests.
- With local Core linked, actual Storybook previews were operated: Dropdown changed Small to Large, Checkbox changed from checked to unchecked, and MenuList invoked Edit and displayed the resulting selection. All three scenarios completed without browser exceptions or console errors.
- Local UI was also linked into Frasco and Sledge; their development-page drawing and history checks passed.
- Vite warned about `__dirname` in the test configuration and future native config loading; Node warned about deprecated `module.register()`. The Storybook build also reported a large preview chunk. These warnings did not fail the tested build or interactions.
- There is no Cargo project in this repository. Validation used Windows, pnpm 11.5.2, Node 26.10.0 for build/test commands, and Chromium for page interaction.
