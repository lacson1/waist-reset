# The Waist Reset

African–Mediterranean waist and metabolic protocol companion: React 19, Vite 8, Chart.js, Zustand (local progress), PWA-ready. Routes use **HashRouter** (`#/…`), so static hosting works without server rewrites.

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm run dev`  | Dev server (Vite)                    |
| `npm run build`| Typecheck + production build → `dist` |
| `npm run preview` | Serve `dist` locally              |
| `npm run lint` | ESLint                               |
| `npm run test:e2e` | Playwright (starts dev server)   |

Install uses **`legacy-peer-deps`** (see `.npmrc`) because `vite-plugin-pwa` peer range does not yet include Vite 8.

## Push to GitHub

From this directory (repo root):

1. Create an **empty** repository on GitHub (no README, no `.gitignore`), e.g. `waist-reset`.
2. Authenticate: `gh auth login` **or** use a [personal access token](https://github.com/settings/tokens) with `repo` scope.
3. Add remote and push (replace `YOUR_USER` and repo name if different):

```bash
git remote add origin https://github.com/YOUR_USER/waist-reset.git
git branch -M main
git push -u origin main
```

If `origin` already exists, use `git remote set-url origin https://github.com/...`.

## Deploy on Vercel

1. [vercel.com](https://vercel.com) → **Add New…** → **Project** → Import the GitHub repo.
2. Vercel detects **Vite**: leave defaults (**Build**: `npm run build`, **Output**: `dist`). The repo’s `.npmrc` ensures `npm install` succeeds.
3. Deploy. Open the production URL; use `https://YOUR-APP.vercel.app/#/start` (hash path) for deep links.

CLI alternative (after `npx vercel login`):

```bash
npx vercel link
npx vercel --prod
```
