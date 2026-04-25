export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;
  completions: string[];
};

export function toggleHabitCompletion(habit: Habit, date: string): Habit;