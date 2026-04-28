# Habit Tracker PWA — Agent Task List

> This document is the implementation checklist for the Habit Tracker PWA (Stage 3).
> Work through stages **in order**. Do not skip ahead. Each stage must be fully complete before starting the next.
> After every stage, **stop and report** what was done, what files were created or modified, and any decisions made.

---

## STAGE 1 — Project Scaffolding & Configuration

> Goal: Get the project structure, tooling, and configs right before writing a single line of app code.

- [ ] 1.1 Initialise a new Next.js project with App Router and TypeScript (`npx create-next-app@latest`)
- [ ] 1.2 Install and configure Tailwind CSS
- [ ] 1.3 Install Vitest, React Testing Library, and `@vitest/coverage-v8`
- [ ] 1.4 Install Playwright and initialise its config (`npx playwright install`)
- [ ] 1.5 Create the required folder structure exactly as specified in the TRD:
  ```
  src/
    app/
      page.tsx
      login/page.tsx
      signup/page.tsx
      dashboard/page.tsx
    components/
      auth/
        LoginForm.tsx
        SignupForm.tsx
      habits/
        HabitCard.tsx
        HabitForm.tsx
      shared/
        SplashScreen.tsx
    lib/
      slug.ts
      validators.ts
      streaks.ts
      habits.ts
      storage.ts
    types/
      auth.ts
      habit.ts
  tests/
    unit/
      slug.test.ts
      validators.test.ts
      streaks.test.ts
      habits.test.ts
    integration/
      auth-flow.test.tsx
      habit-form.test.tsx
    e2e/
      app.spec.ts
  public/
    manifest.json
    sw.js
    icons/
      icon-192.png
      icon-512.png
  ```
- [ ] 1.6 Add all required `package.json` scripts:
  - `dev`, `build`, `start`, `test:unit`, `test:integration`, `test:e2e`, `test`
- [ ] 1.7 Configure `vitest.config.ts` (jsdom environment, coverage thresholds for `src/lib`)
- [ ] 1.8 Configure `playwright.config.ts` (base URL, browser targets)

**STOP. Report everything created. List every file and config decision made.**

---

## STAGE 2 — Types & Utility Functions

> Goal: Build and fully test the pure logic layer before touching any UI.

- [ ] 2.1 Define `User` and `Session` types in `src/types/auth.ts`
- [ ] 2.2 Define `Habit` type in `src/types/habit.ts`
- [ ] 2.3 Implement `getHabitSlug(name: string): string` in `src/lib/slug.ts`
  - lowercase, trim, collapse spaces to hyphens, strip non-alphanumeric (except hyphens)
- [ ] 2.4 Implement `validateHabitName(name)` in `src/lib/validators.ts`
  - reject empty, reject >60 chars, return trimmed value when valid
  - exact error messages as specified
- [ ] 2.5 Implement `calculateCurrentStreak(completions, today?)` in `src/lib/streaks.ts`
  - deduplicate, sort, count consecutive days backwards from today
- [ ] 2.6 Implement `toggleHabitCompletion(habit, date)` in `src/lib/habits.ts`
  - toggle date in completions, no mutation, no duplicates
- [ ] 2.7 Implement localStorage helpers in `src/lib/storage.ts`
  - getUsers / saveUsers
  - getSession / saveSession / clearSession
  - getHabits / saveHabits
- [ ] 2.8 Write all unit tests in `tests/unit/` with **exact describe block names and test titles** from the TRD
  - `getHabitSlug` — 3 required tests
  - `validateHabitName` — 3 required tests
  - `calculateCurrentStreak` — 5 required tests
  - `toggleHabitCompletion` — 4 required tests
- [ ] 2.9 Run `npm run test:unit` — all tests must pass, coverage ≥ 80% for `src/lib`

**STOP. Report all functions implemented, all tests written, test output results, and coverage numbers.**

---

## STAGE 3 — Auth Components & Routes

> Goal: Get signup, login, logout, and session management working end to end.

- [ ] 3.1 Build `src/components/auth/SignupForm.tsx`
  - required `data-testid` values: `auth-signup-email`, `auth-signup-password`, `auth-signup-submit`
  - validates: email required, password required, duplicate email → "User already exists"
  - on success: writes user to localStorage, creates session, redirects to `/dashboard`
- [ ] 3.2 Build `src/components/auth/LoginForm.tsx`
  - required `data-testid` values: `auth-login-email`, `auth-login-password`, `auth-login-submit`
  - validates: matching user + password → session; else "Invalid email or password"
  - on success: creates session, redirects to `/dashboard`
- [ ] 3.3 Build `src/app/signup/page.tsx` — renders `<SignupForm />`
- [ ] 3.4 Build `src/app/login/page.tsx` — renders `<LoginForm />`
- [ ] 3.5 Build `src/app/page.tsx` (the splash/boot route)
  - renders `<SplashScreen />` immediately (data-testid="splash-screen")
  - checks session after 800–2000ms delay
  - redirects to `/dashboard` if session exists, `/login` if not
- [ ] 3.6 Build `src/components/shared/SplashScreen.tsx`
  - shows "Habit Tracker", vertically and horizontally centered
  - exposes `data-testid="splash-screen"`
- [ ] 3.7 Write integration tests in `tests/integration/auth-flow.test.tsx` with **exact titles**:
  - submits the signup form and creates a session
  - shows an error for duplicate signup email
  - submits the login form and stores the active session
  - shows an error for invalid login credentials

**STOP. Report every component built, every route wired, all auth logic decisions, and integration test results.**

---

## STAGE 4 — Dashboard & Habit Management

> Goal: Build the protected dashboard, habit CRUD, completion toggling, and streak display.

- [ ] 4.1 Build `src/app/dashboard/page.tsx`
  - redirect to `/login` if no valid session
  - render only the current user's habits
  - `data-testid="dashboard-page"` on the root container
  - `data-testid="empty-state"` when no habits exist
  - logout button: `data-testid="auth-logout-button"`, clears session, redirects to `/login`
- [ ] 4.2 Build `src/components/habits/HabitForm.tsx`
  - required test ids: `create-habit-button`, `habit-form`, `habit-name-input`, `habit-description-input`, `habit-frequency-select`, `habit-save-button`
  - frequency defaults to and stays `daily`
  - validates name with `validateHabitName`
- [ ] 4.3 Build `src/components/habits/HabitCard.tsx`
  - slug-based test ids (e.g., `habit-card-drink-water`, `habit-streak-drink-water`)
  - complete toggle: `habit-complete-{slug}` — toggles today's date only
  - edit button: `habit-edit-{slug}` — opens form pre-filled
  - delete button: `habit-delete-{slug}` — requires confirmation via `confirm-delete-button`
  - streak display must update immediately after toggle
- [ ] 4.4 Edit habit behaviour: preserve `id`, `userId`, `createdAt`, `completions`
- [ ] 4.5 Write integration tests in `tests/integration/habit-form.test.tsx` with **exact titles**:
  - shows a validation error when habit name is empty
  - creates a new habit and renders it in the list
  - edits an existing habit and preserves immutable fields
  - deletes a habit only after explicit confirmation
  - toggles completion and updates the streak display

**STOP. Report all components built, all behaviours implemented, and integration test results.**

---

## STAGE 5 — PWA Setup

> Goal: Make the app installable and offline-capable.

- [ ] 5.1 Create `public/manifest.json` with all required fields:
  - `name`, `short_name`, `start_url`, `display`, `background_color`, `theme_color`, `icons` (192 and 512)
- [ ] 5.2 Create `public/sw.js` — service worker that caches the app shell
- [ ] 5.3 Add placeholder icon PNGs at `public/icons/icon-192.png` and `public/icons/icon-512.png`
- [ ] 5.4 Register the service worker on the client side (in a layout or root component)
- [ ] 5.5 Verify that loading the app once, then going offline, does not hard-crash it

**STOP. Report manifest contents, service worker caching strategy chosen, and how registration was wired.**

---

## STAGE 6 — End-to-End Tests

> Goal: Write all Playwright E2E tests with exact titles and meaningful assertions.

- [ ] 6.1 Write `tests/e2e/app.spec.ts` inside `test.describe('Habit Tracker app', () => {})` with **exactly these test titles**:
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
- [ ] 6.2 Each test must have real assertions — not just "it loaded". Mentors will read the test logic.
- [ ] 6.3 Run `npm run test:e2e` and confirm all tests pass

**STOP. Report test results, any flaky tests found, and how the offline test was implemented.**

---

## STAGE 7 — Final QA & README

> Goal: Clean up, verify everything passes, and document the project.

- [ ] 7.1 Run the full test suite: `npm run test` — all unit, integration, and E2E tests must pass
- [ ] 7.2 Verify line coverage ≥ 80% for `src/lib`
- [ ] 7.3 Check accessibility: semantic HTML, visible labels, keyboard navigation, focus states
- [ ] 7.4 Check responsiveness: usable at 320px, readable on tablet/desktop
- [ ] 7.5 Write `README.md` including:
  - project overview
  - setup and run instructions
  - test instructions
  - localStorage structure explanation
  - PWA implementation explanation
  - trade-offs and limitations
  - test file → behaviour mapping table
- [ ] 7.6 Final check: all `data-testid` values match the TRD exactly. Do a grep across the codebase.

**STOP. Report final test results, coverage numbers, and confirm README is complete.**

---

## Quick Reference — Required `data-testid` Values

| Element | data-testid |
|---|---|
| Splash screen | `splash-screen` |
| Login email | `auth-login-email` |
| Login password | `auth-login-password` |
| Login submit | `auth-login-submit` |
| Signup email | `auth-signup-email` |
| Signup password | `auth-signup-password` |
| Signup submit | `auth-signup-submit` |
| Dashboard page | `dashboard-page` |
| Empty state | `empty-state` |
| Create habit button | `create-habit-button` |
| Habit form | `habit-form` |
| Habit name input | `habit-name-input` |
| Habit description input | `habit-description-input` |
| Frequency select | `habit-frequency-select` |
| Save button | `habit-save-button` |
| Habit card | `habit-card-{slug}` |
| Streak display | `habit-streak-{slug}` |
| Complete toggle | `habit-complete-{slug}` |
| Edit button | `habit-edit-{slug}` |
| Delete button | `habit-delete-{slug}` |
| Confirm delete | `confirm-delete-button` |
| Logout button | `auth-logout-button` |

## Quick Reference — Required Test Titles (exact wording)

### Unit
- `getHabitSlug` > returns lowercase hyphenated slug for a basic habit name
- `getHabitSlug` > trims outer spaces and collapses repeated internal spaces
- `getHabitSlug` > removes non alphanumeric characters except hyphens
- `validateHabitName` > returns an error when habit name is empty
- `validateHabitName` > returns an error when habit name exceeds 60 characters
- `validateHabitName` > returns a trimmed value when habit name is valid
- `calculateCurrentStreak` > returns 0 when completions is empty
- `calculateCurrentStreak` > returns 0 when today is not completed
- `calculateCurrentStreak` > returns the correct streak for consecutive completed days
- `calculateCurrentStreak` > ignores duplicate completion dates
- `calculateCurrentStreak` > breaks the streak when a calendar day is missing
- `toggleHabitCompletion` > adds a completion date when the date is not present
- `toggleHabitCompletion` > removes a completion date when the date already exists
- `toggleHabitCompletion` > does not mutate the original habit object
- `toggleHabitCompletion` > does not return duplicate completion dates

### Integration
- `auth flow` > submits the signup form and creates a session
- `auth flow` > shows an error for duplicate signup email
- `auth flow` > submits the login form and stores the active session
- `auth flow` > shows an error for invalid login credentials
- `habit form` > shows a validation error when habit name is empty
- `habit form` > creates a new habit and renders it in the list
- `habit form` > edits an existing habit and preserves immutable fields
- `habit form` > deletes a habit only after explicit confirmation
- `habit form` > toggles completion and updates the streak display

### E2E
- `Habit Tracker app` > shows the splash screen and redirects unauthenticated users to /login
- `Habit Tracker app` > redirects authenticated users from / to /dashboard
- `Habit Tracker app` > prevents unauthenticated access to /dashboard
- `Habit Tracker app` > signs up a new user and lands on the dashboard
- `Habit Tracker app` > logs in an existing user and loads only that user's habits
- `Habit Tracker app` > creates a habit from the dashboard
- `Habit Tracker app` > completes a habit for today and updates the streak
- `Habit Tracker app` > persists session and habits after page reload
- `Habit Tracker app` > logs out and redirects to /login
- `Habit Tracker app` > loads the cached app shell when offline after the app has been loaded once
