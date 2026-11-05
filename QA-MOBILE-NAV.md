# Mobile navigation regression checks

Verified 5 November 2026 on the local production build of `fix/mobile-navigation-20261105` using Chrome's viewport override. These are browser viewport tests, not a physical-phone or Safari claim.

## Fix

- Prevent the JavaScript-enabled mobile header from wrapping.
- Scale the full wordmark only on narrow phones, leaving desktop and the no-JavaScript navigation rules unchanged.
- Keep the Menu button at least 44px high and prevent it from shrinking.
- Anchor the dropdown below the header rather than over the logo.
- Bound the dropdown to the available viewport height and allow internal scrolling on short screens.

## Browser evidence

The unmodified local site reproduced the problem at 320px: the button extended to approximately 83px below the top of a 70px header, and the open dropdown began at y=0 over the logo.

On the fixed production build, all requested widths passed:

| Viewport width | Header height | Button bottom | Dropdown top | Logo visible | Escape and repeated toggle |
| --- | --- | --- | --- | --- | --- |
| 320px | 70px | 57px | 70px | Yes | Pass |
| 333px | 70px | 57px | 70px | Yes | Pass |
| 360px | 70px | 57px | 70px | Yes | Pass |
| 400px | 70px | 57px | 70px | Yes | Pass |
| 500px | 70px | 57px | 70px | Yes | Pass |

Each width was checked for non-overlapping logo/button bounds, the button staying inside the header, the logo remaining the hit-test target while the menu is open, the expanded state, and returning keyboard focus to Menu after Escape.

Additional checks:

- Services navigation loaded the destination with the menu closed. Back and Forward also returned with the menu closed.
- Scrolling kept the logo visible and the dropdown aligned with the header's bottom border.
- At 500 x 200px the dropdown remained inside the viewport, with 250px of content inside a 129px scrollable area.
- Tab from the open Menu button focused Services. Escape from that link closed the menu and returned focus to Menu.
- At 1280px, the Menu button was hidden and the ordinary horizontal navigation remained visible.

## Automated checks

- `npm test`: 24 passed, 0 failed.
- `npm run build`: passed, including Astro checks across 58 files with 0 errors, warnings or hints. The build retains the existing advisory about the large Three.js scene chunk.
- `npm run validate:site`: passed for all 16 generated HTML pages.
- `git diff --check`: passed.

No dependencies were installed or updated. No CMS changes, merge or production deployment were performed. Physical devices, Safari and a JavaScript-disabled browser session were not tested.