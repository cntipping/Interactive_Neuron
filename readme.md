# The Interactive Neuron

An interactive 3D neuron study tool for psychology students.

## Run locally

Requirements: Node.js 22.13+ and pnpm 11.

1. Download or clone this project.
2. Open a terminal in the folder containing `package.json`.
3. Install dependencies:

   ```sh
   pnpm install
   ```

4. Start the development server:

   ```sh
   pnpm dev
   ```

5. Open the `Local` address printed in the terminal, usually `http://localhost:3000`.

Keep the terminal open while using the site. Press `Ctrl+C` to stop it.

## Controls

- Drag to rotate the neuron.
- Point at a feature and scroll to zoom toward it.
- Use the structure index to pin a label.
- Hover for 0.6 seconds to preview a structure.
- Press Escape to close the active label.

## Useful commands

```sh
pnpm build
node --experimental-strip-types --test tests/*.test.mjs
```

The site is deployed at https://interactive-neuron-study.qs6bpnpyr8.chatgpt.site.

## GitHub Pages

Push this project to a GitHub repository’s `main` branch. The included GitHub Actions workflow builds and publishes the static site automatically. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. After the workflow finishes, the site will be available at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

The workflow uses the repository name automatically, so no code change is needed for the URL path.
