# The Interactive Neuron

A 3D study webpage for psychology students. Rotate a neuron, inspect its structures, and learn how they work together through connected anatomy labels.

## Just want to use the webpage?

Open https://interactive-neuron-study.qs6bpnpyr8.chatgpt.site in your browser. The hosted site is currently private: only its owner has access. A student cannot access it until the owner changes its sharing settings. You do not need to install anything to use the hosted version when you have access.

## Run your own copy — no GitHub knowledge needed

Running a copy on your computer does not require a GitHub account, Git, a paid account, or an API key. You need an internet connection for the initial installation and a browser that supports WebGL. The instructions below start a local server: a small program that serves the webpage to your browser while its terminal window stays open.

### 1. Get the project folder

If someone sent you a ZIP file, extract/unzip it. If you are viewing the files on GitHub, select the green **Code** button, then **Download ZIP**, and extract it. You do not need to clone a repository. Private GitHub repositories still require access from their owner.

If you already have the `TheInteractiveNeuron` folder, use that folder directly. The correct folder contains `package.json`, `pnpm-lock.yaml`, `vite.config.ts`, and the `app` folder. Keep the hidden `.openai` folder too; it contains build configuration, not an API key.

### 2. Install Node.js

Download the Node.js 24 installer for your computer from https://nodejs.org/en/download and run it using the normal installer steps. This project requires Node.js 22.13 or newer; Node.js 24 is a suitable choice. Node.js includes a command called `npm`, which we will use once to install the project's package manager.

After installation, close any open terminal windows and open a new one:

- **Mac:** Open **Terminal** using Spotlight (Command + Space, then type Terminal).
- **Windows:** Open **PowerShell** from the Start menu. If your computer blocks npm scripts in PowerShell, use **Command Prompt** instead; you do not need to change your security settings.

Type the following and press Enter:

```sh
node --version
```

You should see a version number such as `v24.x.x`. Next, install the package manager used by this project:

```sh
npm install --global pnpm@11.19.0
```

If a managed school computer denies installation, ask your IT administrator to install Node.js and pnpm. Do not change system permissions just to make these commands work.

### 3. Open the project folder in the terminal

The terminal must be inside the extracted folder containing `package.json`.

**Mac:** Type `cd ` (include a space after cd), drag the project folder from Finder into the terminal window, then press Enter.

**Windows:** Open the project folder in File Explorer. Click the address bar, type `cmd`, and press Enter. A Command Prompt window opens in that folder.

`cd` means “change directory,” or move into a folder. Paths with spaces need quotation marks if you type them yourself. For example:

```sh
cd "path/to/TheInteractiveNeuron"
```

Replace that example path with the real location on your computer; do not type it literally.

### 4. Install the project's dependencies

Dependencies are the libraries the webpage needs. Run:

```sh
pnpm install
```

This may take several minutes the first time. The project uses a lockfile to keep dependency versions consistent; keep it in the folder.

If installation reports **ignored build scripts** or asks you to approve builds, run:

```sh
pnpm approve-builds
```

In the list, use the arrow keys and Space to select only `esbuild`, `sharp`, and `workerd` if offered, then press Enter and confirm. These are the project's build/image/local-server dependencies. Run `pnpm install` again afterward. Other dependency-security or release-age errors should be shown to the project maintainer; do not disable those policies.

### 5. Start the webpage

Run:

```sh
pnpm dev
```

Leave this terminal window open. Look for a line starting with **Local:**, such as:

```text
Local: http://localhost:3000/
```

Open that exact address in your browser. If port 3000 is busy, the program may show 3001 or another port instead. `localhost` means your own computer; sending this address to a student will not let them access your copy.

### 6. Stop or reopen the webpage

To stop the local server, click the terminal window and press **Ctrl + C** (also on a Mac). To reopen it later, open a terminal in the same project folder, run `pnpm dev`, and open the Local address again. You generally only need to install dependencies again after downloading changes to the project.

## Study controls

- **Rotate:** Drag the model with the mouse or one finger.
- **Zoom:** Point at a feature and scroll to zoom toward it. Touch pinch zooms around the midpoint between your fingers. The + and − buttons zoom around the current view target.
- **Reset:** Use the circular-arrow button.
- **Preview a label:** Hold the mouse still over a structure for 0.6 seconds. Moving the cursor dismisses the preview and starts a fresh delay if it is still over a structure.
- **Pin a label:** Click or tap a structure. Its label stays visible when the cursor moves, and its leader line follows the selected location as you rotate the model.
- **Change target:** Click another structure, or open **Structure index** in the top-right corner and select its name. The menu closes after selection. Hover previews take priority over a pinned label. When the hover ends, the last clicked label returns.
- **Close a label:** Click its X button or press Escape.
- **Keyboard:** Tab to the Structure index button and press Enter or Space to open it. Tab through its structure buttons and press Enter or Space to pin a label. Escape closes an open index; when it is closed, Escape clears the anatomy label. Touch and keyboard users do not need hover.

Labels float outward from the selected point, connected by a leader line. They remain inside the screen, may overlap part of the neuron, and scroll internally on smaller screens. Opening a label does not resize the model. If the selected point goes out of view, its connecting line is hidden until the point returns.

## Common problems

**“node,” “npm,” or “pnpm” is not recognized / command not found:** Finish the installation in step 2, then reopen your terminal. Check that `node --version` works first.

**“No package.json” or “No importer manifest found”:** You are in the wrong folder. Repeat step 3 and select the folder containing `package.json`.

**The browser says it cannot connect:** Keep `pnpm dev` running and use the exact Local address it prints. If the terminal shows an error, the server has not started successfully.

**A blank or unavailable 3D view:** Use a WebGL-capable browser and enable graphics/hardware acceleration in its settings, if your school allows it. The Structure Index still provides the anatomy explanations when WebGL is unavailable.

**Installation fails:** Check your internet connection and copy the full error for the project maintainer. A school network or managed computer may restrict downloads or local servers.

**Double-clicking a file does not open the app:** This project is not a single HTML file. Start it with `pnpm dev` instead.

## For someone editing the project

- `app/page.tsx`: 3D geometry, anatomy content, HUD, and connected labels.
- `app/globals.css`: colors, type, layout, and responsive styling.
- `lib/hover-preview.ts`: delayed hover behavior and cancellation.
- `lib/label-layout.ts`: hover priority and outward label positioning.
- `lib/neuron-model.ts`: organic geometry, membrane texture, and physical materials.
- `tests/hover-preview.test.mjs`: timing and cancellation checks.

Save a source change while `pnpm dev` is running; the browser normally refreshes automatically.

Optional checks:

```sh
pnpm exec tsc --noEmit
node --experimental-strip-types --test tests/hover-preview.test.mjs tests/label-layout.test.mjs
pnpm build
```

`pnpm build` prepares the production files. It does not publish the site. Publishing and sharing are separate actions handled through Sites. Running the local copy does not change the hosted webpage.

## Educational scope

This is an illustrative multipolar neuron with organic surface detail, dendritic spines, and layered myelin, not a microscope reconstruction of a specific cell. Colors distinguish structures, sizes are not to scale, and the soma is translucent to reveal the nucleus. Neuron shapes and myelination vary across the nervous system.

Reference: [Nerve Cells — Neuroscience, NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK11103/).

## Adjust popup placement and zoom limits

`lib/label-layout.ts` contains the main settings. `LABEL_LAYOUT.gap` is the pixel gap from the projected model edge. Placement compares eight candidates (left, right, above, below, and four diagonals), preferring positions with less overlap and keeping the label inside the HUD margins. On small screens some overlap may remain.

`INITIAL_MODEL_SCREEN_FRACTION = 0.78` controls the starting view only. Close-up limits are configured in `lib/zoom-controls.ts`: `minimumDistance: 3.5` and `surfaceClearance: 0.65`. Cursor and pinch zoom use the built-in `controls.zoomToCursor = true` behavior. A surface check stops zoom-in motion before it passes through the membrane; all zoom methods use the same minimum distance. Reset returns to the starting view.

`popupScale()` in `lib/label-layout.ts` makes the label smaller as you zoom in, down to 75% of its original size. Zooming out restores it. Placement and leader lines use the scaled dimensions, and long pinned labels remain scrollable. `HOVER_DELAY_MS = 600` in `lib/hover-preview.ts` controls the hover delay in milliseconds.

The compact-label rules at the end of `app/globals.css` set the popup width to 300px and maximum height to 380px (smaller when required by the screen). Longer text scrolls inside a pinned popup. Main paragraph text stays at 16px.
