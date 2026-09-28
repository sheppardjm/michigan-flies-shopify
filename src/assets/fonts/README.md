# Fonts vendored for the Open Graph card

The site loads its web fonts through `next/font/google`. The link-preview
image (`src/app/opengraph-image.tsx`) is rendered server-side by Satori, which
needs raw font files, so two faces are vendored here as WOFF (v1):

- `zilla-slab-600.woff`: Zilla Slab SemiBold, by Typotheque for Mozilla.
- `mr-dafoe-400.woff`: Mr Dafoe Regular, by Sudtipos.

Both are released under the SIL Open Font License 1.1 and were downloaded
from Google Fonts on September 28, 2026. They are used only to draw the
preview card; nothing else reads them.
