import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  // Clear localStorage before each test using a separate page or evaluating
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    const splash = page.getByTestId('splash-screen');
    await expect(splash).toBeVisible();
    
    // Wait for the redirect after the timeout (1000ms)
    await page.waitForURL('/login');
    await expect(page.getByTestId('auth-login-submit')).toBeVisible();
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'test@example.com' }));
    });

    await page.goto('/');
    const splash = page.getByTestId('splash-screen');
    await expect(splash).toBeVisible();

    await page.waitForURL('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/login');
    await expect(page.getByTestId('auth-login-submit')).toBeVisible();
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{ id: 'u1', email: 'user@test.com', password: 'password', createdAt: new Date().toISOString() }]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{
        id: 'h1', userId: 'u1', name: 'My Habit', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: []
      }]));
    });

    await page.getByTestId('auth-login-email').fill('user@test.com');
    await page.getByTestId('auth-login-password').fill('password');
    await page.getByTestId('auth-login-submit').click();

    await page.waitForURL('/dashboard');
    await expect(page.getByTestId('habit-card-my-habit')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    // Setup session
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'user@example.com' }));
    });
    
    await page.goto('/dashboard');
    
    // Create habit
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('2L daily');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByText('Drink Water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'user@example.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{
        id: 'h2', userId: 'u1', name: 'Exercise', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: []
      }]));
    });
    
    await page.goto('/dashboard');
    
    const streakLocator = page.getByTestId('habit-streak-exercise');
    await expect(streakLocator).toHaveText('0');
    
    const toggle = page.getByTestId('habit-complete-exercise');
    await toggle.check();
    
    await expect(streakLocator).toHaveText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'user@example.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{
        id: 'h3', userId: 'u1', name: 'Read', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: []
      }]));
    });
    
    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-card-read')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('habit-card-read')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'user@example.com' }));
    });
    
    await page.goto('/dashboard');
    await page.getByTestId('auth-logout-button').click();

    await page.waitForURL('/login');
    await expect(page.getByTestId('auth-login-submit')).toBeVisible();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ context, page }) => {
    // Navigate once to cache the shell
    await page.goto('/login');
    
    // Wait for the service worker to install and cache assets
    await page.waitForTimeout(2000); 

    // Go offline
    await context.setOffline(true);

    // Reload the page
    await page.reload();
    
    // Check that we're still seeing the page and not a generic chrome offline error
    await expect(page.getByTestId('auth-login-submit')).toBeVisible();
  });
});
