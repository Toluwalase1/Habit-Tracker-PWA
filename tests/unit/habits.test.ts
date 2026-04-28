import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../src/lib/habits';
import { Habit } from '../../src/types/habit';

describe('toggleHabitCompletion', () => {
  const baseHabit: Habit = {
    id: '1',
    userId: 'user1',
    name: 'Read',
    description: '',
    frequency: 'daily',
    createdAt: '2026-04-28T00:00:00.000Z',
    completions: ['2026-04-27']
  };

  it('adds a completion date when the date is not present', () => {
    const updated = toggleHabitCompletion(baseHabit, '2026-04-28');
    expect(updated.completions).toContain('2026-04-28');
    expect(updated.completions).toContain('2026-04-27');
    expect(updated.completions).toHaveLength(2);
  });

  it('removes a completion date when the date already exists', () => {
    const updated = toggleHabitCompletion(baseHabit, '2026-04-27');
    expect(updated.completions).not.toContain('2026-04-27');
    expect(updated.completions).toHaveLength(0);
  });

  it('does not mutate the original habit object', () => {
    const originalCompletions = [...baseHabit.completions];
    toggleHabitCompletion(baseHabit, '2026-04-28');
    expect(baseHabit.completions).toEqual(originalCompletions);
  });

  it('does not return duplicate completion dates', () => {
    const duplicateHabit = { ...baseHabit, completions: ['2026-04-28', '2026-04-28'] };
    const updated = toggleHabitCompletion(duplicateHabit, '2026-04-28');
    // It should remove '2026-04-28' because it toggles if present
    expect(updated.completions).not.toContain('2026-04-28');
    
    // Test adding duplicate directly via toggle
    const updated2 = toggleHabitCompletion(baseHabit, '2026-04-28');
    expect(new Set(updated2.completions).size).toBe(updated2.completions.length);
  });
});