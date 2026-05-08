# LocumGP

UK GP locum management — rota & availability, bookings, credential wallet, compliance, invoicing, expenses, tax, NHS pension, and practice messaging in one app.

This repo is **scaffolded for a GSD spec-driven build**. The Dashboard is modelled on the design reference; every other sidebar route is a placeholder until the GSD flow plans and ships it.

## Stack

- React 19, Vite 6, TypeScript (strict)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router v7 (browser router)
- Chart.js + react-chartjs-2 (analytics & tax doughnut)
- Zustand (client state, when needed)
- lucide-react (icons)
- date-fns (date math)

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Vite dev server on http://localhost:5173 |
| `npm run build`   | Typecheck + production build → `dist` |
| `npm run preview` | Serve `dist` locally                 |
| `npm run lint`    | ESLint                               |
| `npm run typecheck` | `tsc -b --noEmit`                  |
| `npm run test`    | Vitest                               |

## Folder layout

```
src/
  components/        # AppShell + dashboard cards (RotaGrid, UrgentMatches, …)
  pages/             # Routed pages (Dashboard + placeholders)
  data/              # Mock data + nav config
  lib/               # Small utilities (cn)
  router.tsx         # Route table
  main.tsx
  index.css          # Tailwind v4 entry + @theme tokens
```

## Design tokens

`@theme` in `src/index.css` defines `brand-50…950` blues and an Inter font stack. Components use Tailwind utilities — no separate design-system layer yet (one of the things the GSD UI phase should design).

## Next: drive the build with GSD

1. **Restart Claude Code** so the GSD slash commands register (the installer warned this is needed).
2. `cd /home/user/locumgp`
3. Run `/gsd-new-project` and describe the product. Suggested seed:

   > UK GP locum management web app. Locums manage rota & availability, accept shift matches from practices and PCNs, store GMC/DBS/indemnity/BLS credentials, track compliance, invoice practices, log expenses, file Self Assessment, and submit NHS pension PCSE forms. Dashboard already scaffolded; expand into a full multi-page mock-data app, then a real backend.

4. GSD will research the domain, produce a roadmap and phase plans into `.planning/`, then execute phase by phase via `/gsd-plan-phase` and `/gsd-execute-phase`.

## Status

- [x] Dashboard layout (rota grid, urgent matches, compliance, sessions, credentials, invoices, expenses, tax doughnut, messages, NHS pension, 12-month analytics)
- [ ] Rota & Availability page
- [ ] Bookings
- [ ] Practices & PCNs
- [ ] Shift Matches
- [ ] Credential Wallet
- [ ] Compliance
- [ ] Invoices & Payments
- [ ] Expenses
- [ ] Tax & Reporting
- [ ] Pension (NHS)
- [ ] Messages
- [ ] Documents
- [ ] Settings
- [ ] Help & Support
- [ ] Auth (Google sign-in shown in mockup)
- [ ] Backend / persistence

## Disclaimer

Educational scaffold. Not a medical, legal, tax or financial product. Do not put real patient data in this repo.
