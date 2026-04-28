'use client';

import React, { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { toggleHabitCompletion } from '@/lib/habits';
import { calculateCurrentStreak } from '@/lib/streaks';

type HabitCardProps = {
  habit: Habit;
  onDelete: () => void;
  onEdit: () => void;
  onUpdate: (habit: Habit) => void;
};

export default function HabitCard({ habit, onDelete, onEdit, onUpdate }: HabitCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  
  // For simplicity, we define "today" based on local time
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const currentStreak = calculateCurrentStreak(habit.completions, today);

  const handleToggle = () => {
    const updatedHabit = toggleHabitCompletion(habit, today);
    onUpdate(updatedHabit);
  };

  return (
    <div 
      data-testid={`habit-card-${slug}`}
      className={`p-5 border rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center transition-colors duration-300 ${isCompletedToday ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}
    >
      <div className="mb-4 md:mb-0">
        <h3 className={`text-xl font-bold ${isCompletedToday ? 'text-green-900' : 'text-gray-900'}`}>{habit.name}</h3>
        {habit.description && <p className={`mt-1 ${isCompletedToday ? 'text-green-700' : 'text-gray-500'}`}>{habit.description}</p>}
        <p className="mt-3 text-sm font-semibold flex items-center gap-1.5">
          <span className="text-orange-500">🔥</span> Streak: 
          <span data-testid={`habit-streak-${slug}`} className="bg-gray-100 px-2 py-0.5 rounded-full">{currentStreak}</span>
        </p>
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        <label className="flex items-center gap-2 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition">
          <input 
            type="checkbox" 
            checked={isCompletedToday}
            onChange={handleToggle}
            data-testid={`habit-complete-${slug}`}
            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-gray-900">
            {isCompletedToday ? 'Done' : 'Complete'}
          </span>
        </label>
        
        <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
          <button 
            onClick={onEdit}
            data-testid={`habit-edit-${slug}`}
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition"
          >
            Edit
          </button>

          {showConfirmDelete ? (
            <button 
              onClick={onDelete}
              data-testid="confirm-delete-button"
              className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 shadow-sm transition"
            >
              Confirm Delete
            </button>
          ) : (
            <button 
              onClick={() => setShowConfirmDelete(true)}
              data-testid={`habit-delete-${slug}`}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
