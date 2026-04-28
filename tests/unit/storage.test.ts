import { describe, it, expect, beforeEach } from 'vitest';
import { getUsers, saveUsers, getSession, saveSession, clearSession, getHabits, saveHabits } from '../../src/lib/storage';
import { User, Session } from '../../src/types/auth';
import { Habit } from '../../src/types/habit';

describe('storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('users storage', () => {
    expect(getUsers()).toEqual([]);
    const users: User[] = [{ id: '1', email: 'test@test.com', password: 'pwd', createdAt: '' }];
    saveUsers(users);
    expect(getUsers()).toEqual(users);
  });

  it('session storage', () => {
    expect(getSession()).toBeNull();
    const session: Session = { userId: '1', email: 'test@test.com' };
    saveSession(session);
    expect(getSession()).toEqual(session);
    clearSession();
    expect(getSession()).toBeNull();
  });

  it('habits storage', () => {
    expect(getHabits()).toEqual([]);
    const habits: Habit[] = [{ id: '1', userId: '1', name: 'H', description: '', frequency: 'daily', createdAt: '', completions: [] }];
    saveHabits(habits);
    expect(getHabits()).toEqual(habits);
  });
});
