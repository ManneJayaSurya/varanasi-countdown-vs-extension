# Varanasi Countdown

Varanasi Countdown brings full hype mode into VS Code. Open Explorer and you get a custom sidebar view with a bundled GIF, a clean release countdown, and pure fan energy building up to 7 Apr 2027.

This extension is made to feel less like a utility and more like an entry scene. Open the workspace, look at Explorer, and the mood is already set.

## Mass Features

- Adds a `Varanasi Countdown` section inside the Explorer sidebar.
- Shows the bundled `varanasi.gif` directly inside that custom view.
- Displays a days-only countdown to the release date.
- Refreshes the view automatically so the day count stays current while VS Code is open.

## Why This Hits In Explorer

VS Code's native file tree does not support arbitrary HTML or animated GIF rendering. So this extension uses a webview-backed Explorer view, which is the correct and supported way to bring rich media into the Explorer area without breaking VS Code's model.

Simple idea, sharp presentation, no nonsense.

## Setup

### Install dependencies

```bash
npm install
```

### Start the extension in development

```bash
npm run compile
```

Then press `F5` in VS Code to launch an Extension Development Host.

Once it launches, check the Explorer sidebar for `Varanasi Countdown`.

### Watch mode

```bash
npm run watch
```

### Lint

```bash
npm run lint
```

### Package build

```bash
npm run package
```

## Under The Hood

- The Explorer contribution is declared in `package.json` as a webview view.
- The extension implementation lives in `src/extension.ts`.
- Media assets are bundled from the `media` folder.
- The countdown is rendered from the extension side instead of running client-side webview scripts.

## Current Style

- Release date: 7 Apr 2027
- Countdown format: days only
- Placement: above the GIF in the Explorer view

## Known Limits

- The GIF appears in a custom Explorer section, not inside the native file/folder tree rows.
- The README does not currently include screenshots.

## Release Notes

### 0.0.1

- Initial release with a custom Explorer hype view
- Bundled GIF support in the sidebar
- Days-only countdown to 7 Apr 2027
