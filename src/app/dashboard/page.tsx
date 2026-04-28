'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, clearSession, getHabits, saveHabits } from '@/lib/storage';
import { Session } from '@/types/auth';
import { Habit } from '@/types/habit';
import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push('/login');
      return;
    }
    setSession(currentSession);
    const allHabits = getHabits();
    setHabits(allHabits.filter(h => h.userId === currentSession.userId));
  }, [router]);

  if (!session) return null; // Avoid flashing

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    const allHabits = getHabits();
    let updatedHabits;

    if (editingHabit) {
      // Edit mode: preserve immutable fields
      updatedHabits = allHabits.map(h => {
        if (h.id === editingHabit.id) {
          return {
            ...h,
            name: habitData.name!,
            description: habitData.description || '',
          };
        }
        return h;
      });
    } else {
      // Create mode
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session.userId,
        name: habitData.name!,
        description: habitData.description || '',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      };
      updatedHabits = [...allHabits, newHabit];
    }

    saveHabits(updatedHabits);
    setHabits(updatedHabits.filter(h => h.userId === session.userId));
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleDeleteHabit = (id: string) => {
    const allHabits = getHabits();
    const updatedHabits = allHabits.filter(h => h.id !== id);
    saveHabits(updatedHabits);
    setHabits(updatedHabits.filter(h => h.userId === session.userId));
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    const allHabits = getHabits();
    const updatedHabits = allHabits.map(h => h.id === updatedHabit.id ? updatedHabit : h);
    saveHabits(updatedHabits);
    setHabits(updatedHabits.filter(h => h.userId === session.userId));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50" data-testid="dashboard-page">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Habits</h1>
          <button 
            onClick={handleLogout}
            data-testid="auth-logout-button"
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {!showForm && (
          <button 
            onClick={() => { setShowForm(true); setEditingHabit(null); }}
            data-testid="create-habit-button"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition mb-6 font-medium"
          >
            Create New Habit
          </button>
        )}

        {showForm && (
          <HabitForm 
            initialData={editingHabit} 
            onSave={handleSaveHabit} 
            onCancel={() => { setShowForm(false); setEditingHabit(null); }} 
          />
        )}

        {habits.length === 0 ? (
          <div data-testid="empty-state" className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-8 text-gray-500">
            <p className="text-lg">You don't have any habits yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4 mt-6">
            {habits.map(habit => (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                onDelete={() => handleDeleteHabit(habit.id)}
                onEdit={() => { setEditingHabit(habit); setShowForm(true); }}
                onUpdate={handleUpdateHabit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
