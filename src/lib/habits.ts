import { Habit } from '../types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const isCompleted = habit.completions.includes(date);
  
  const newCompletions = isCompleted 
    ? habit.completions.filter(d => d !== date)
    : [...habit.completions, date];

  const uniqueCompletions = Array.from(new Set(newCompletions));

  return {
    ...habit,
    completions: uniqueCompletions
  };
}