# LinkedIn banner

The banner is generated deterministically from `scripts/generate-linkedin-banner.mjs`.

```bash
npm run banner
```

This writes both upload-ready files to `output/linkedin/`:

- `linkedin-banner.svg`
- `linkedin-banner.png` at 1584 × 396

The PNG renderer automatically uses a locally installed Chrome or Chromium. Set `CHROME_BIN` if the browser executable is in a non-standard location. To generate only the editable SVG, run:

```bash
node scripts/generate-linkedin-banner.mjs --svg-only
```

The main controls are grouped at the top of the generator: `BAR_COUNT`, `BAR_CORNER_RADIUS`, `TOP_OPENING`, `BOTTOM_OPENING`, `LAYER_GAP`, text sizes, and the four curtain colours.
