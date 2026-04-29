# Habit Tracker PWA

This repository contains the Stage 3 Habit Tracker PWA implemented to the provided technical requirements document (TRD). It is a mobile-first, installable Progressive Web App built with Next.js (App Router), React, TypeScript and Tailwind CSS, using localStorage for persistence and Vitest / React Testing Library / Playwright for tests.

**Quick Links**
- **Code:** [src](src)
- **App entry (splash):** [src/app/page.tsx](src/app/page.tsx)
- **Dashboard:** [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)
- **Lib utilities:** [src/lib](src/lib)
- **Types:** [src/types](src/types)
- **Tests:** [tests](tests)
- **PWA manifest:** public/manifest.json
- **Service worker:** public/sw.js

**Tech stack**
- **Framework:** Next.js (App Router)
- **UI:** React + Tailwind CSS
- **Language:** TypeScript
- **Persistence:** localStorage (deterministic, local only)
- **Unit tests:** Vitest
- **Integration tests:** Vitest + React Testing Library
- **E2E tests:** Playwright

**Project structure (important files)**
- `src/app/page.tsx` - splash/boot route and redirect logic
- `src/app/login/page.tsx` - login route
- `src/app/signup/page.tsx` - signup route
- `src/app/dashboard/page.tsx` - protected dashboard route
- `src/components/shared/SplashScreen.tsx` - splash UI (data-testid="splash-screen")
- `src/components/auth/LoginForm.tsx` - login form (auth-login-* test ids)
- `src/components/auth/SignupForm.tsx` - signup form (auth-signup-* test ids)
- `src/components/habits/HabitForm.tsx` - habit create/edit form
- `src/components/habits/HabitCard.tsx` - habit card and controls
- `src/lib/slug.ts` - `getHabitSlug(name: string): string`
- `src/lib/validators.ts` - `validateHabitName(name: string)`
- `src/lib/streaks.ts` - `calculateCurrentStreak(completions, today?)`
- `src/lib/habits.ts` - `toggleHabitCompletion(habit, date)`
- `src/lib/storage.ts` - localStorage helpers and exact keys
- `src/types/auth.ts` - `User` and `Session` types
- `src/types/habit.ts` - `Habit` type

Setup

1. Install dependencies:
```bash
npm install
```

2. Run dev server:
```bash
npm run dev
```

3. Build and serve production:
```bash
npm run build
npm run start
```

Running tests

- Unit tests + coverage (Vitest):
```bash
npm run test:unit
```

- Integration tests (Vitest + RTL):
```bash
npm run test:integration
```

- End-to-end tests (Playwright):
```bash
npm run test:e2e
```

Note: If running tests in PowerShell causes execution policy errors, run them from Git Bash, WSL, or Command Prompt.

Persistence (localStorage)

Keys used exactly (TRD contract):
- `habit-tracker-users` — JSON array of `User` objects
- `habit-tracker-session` — either `null` or a `Session` object
- `habit-tracker-habits` — JSON array of `Habit` objects

Type shapes (files)
- `src/types/auth.ts` exports `User` and `Session` matching the TRD.
- `src/types/habit.ts` exports `Habit` matching the TRD.

PWA support

- Manifest: `public/manifest.json` contains name, short_name, start_url, display, background_color, theme_color and icons referencing `/icons/icon-192.png` and `/icons/icon-512.png`.
- Service worker: `public/sw.js` caches the app shell and serves cached assets when offline (cache-first strategy).
- Registration: `src/components/shared/ServiceWorkerRegister.tsx` registers `/sw.js` on client load, and `src/app/layout.tsx` includes the registration component and manifest in metadata.

Trade-offs and limitations

- Persistence is localStorage only — this keeps the app deterministic for tests but is not suitable for multi-device sync.
- Passwords are stored in plaintext in localStorage for the purpose of this exercise and deterministic testing; in production you must hash passwords and use a secure backend.
- The PWA service worker uses a minimal cache-first strategy for the shell; it is intentionally simple to satisfy TRD offline requirements.

Mapping of required tests to files & behavior (exact test file names and what they verify)

- Unit tests (tests/unit)
  - `tests/unit/slug.test.ts` — describe block `describe('getHabitSlug', () => {})`
    - returns lowercase hyphenated slug for a basic habit name
    - trims outer spaces and collapses repeated internal spaces
    - removes non alphanumeric characters except hyphens

  - `tests/unit/validators.test.ts` — describe block `describe('validateHabitName', () => {})`
    - returns an error when habit name is empty
    - returns an error when habit name exceeds 60 characters
    - returns a trimmed value when habit name is valid

  - `tests/unit/streaks.test.ts` — contains mentor audit marker and describe `describe('calculateCurrentStreak', () => {})`
    - returns 0 when completions is empty
    - returns 0 when today is not completed
    - returns the correct streak for consecutive completed days
    - ignores duplicate completion dates
    - breaks the streak when a calendar day is missing

  - `tests/unit/habits.test.ts` — describe `describe('toggleHabitCompletion', () => {})`
    - adds a completion date when the date is not present
    - removes a completion date when the date already exists
    - does not mutate the original habit object
    - does not return duplicate completion dates

- Integration tests (tests/integration)
  - `tests/integration/auth-flow.test.tsx` — describe `describe('auth flow', () => {})`
    - submits the signup form and creates a session
    - shows an error for duplicate signup email
    - submits the login form and stores the active session
    - shows an error for invalid login credentials

  - `tests/integration/habit-form.test.tsx` — describe `describe('habit form', () => {})`
    - shows a validation error when habit name is empty
    - creates a new habit and renders it in the list
    - edits an existing habit and preserves immutable fields
    - deletes a habit only after explicit confirmation
    - toggles completion and updates the streak display

- End-to-end tests (Playwright) — `tests/e2e/app.spec.ts`
  - test.describe('Habit Tracker app', () => {})
    - shows the splash screen and redirects unauthenticated users to /login
    - redirects authenticated users from / to /dashboard
    - prevents unauthenticated access to /dashboard
    - signs up a new user and lands on the dashboard
    - logs in an existing user and loads only that user's habits
    - creates a habit from the dashboard
    - completes a habit for today and updates the streak
    - persists session and habits after page reload
    - logs out and redirects to /login
    - loads the cached app shell when offline after the app has been loaded once

Coverage requirement
- Unit tests target `src/lib/*` coverage. Run `npm run test:unit` to generate coverage report. TRD requires ≥ 80% line coverage for files inside `src/lib`.

How to verify the PWA locally (quick)
1. Build and start the production server:
```bash
npm run build
npm run start
```
2. Open `http://localhost:3000` in Chrome.
3. Open DevTools → Application → Manifest and Service Workers to verify manifest loads and SW is activated.
4. Use Lighthouse (DevTools → Lighthouse → Progressive Web App) to run a PWA check.

Final notes
- Accessibility fixes applied: visible labels and focus styles were added to `src/components/auth/LoginForm.tsx` and `src/components/auth/SignupForm.tsx` to satisfy TRD accessibility requirements.
- Icons: your `public/icons` folder must contain `icon-192.png` and `icon-512.png` (the manifest and SW expect them). Add them if you haven't already.

If you'd like, I can:
- run the test suite here (I encountered PowerShell security restrictions; switching to Git Bash or WSL fixes that), or
- generate the missing PWA icons from an existing logo file if you confirm I should create them.

---
Repository maintained for the TRD evaluation. If you want, I can now run the test commands and copy the coverage report into the repo.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
