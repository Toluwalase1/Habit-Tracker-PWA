'use client';

import React, { useState } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';

type HabitFormProps = {
  initialData?: Habit | null;
  onSave: (data: Partial<Habit>) => void;
  onCancel: () => void;
};

export default function HabitForm({ initialData, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSave({ name: validation.value, description });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      data-testid="habit-form" 
      className="p-6 border rounded-xl shadow-sm bg-white mb-6 border-gray-200"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800">{initialData ? 'Edit Habit' : 'Create Habit'}</h2>
      
      {error && <div className="text-red-500 font-bold text-sm mb-4 bg-red-50 p-3 rounded">{error}</div>}
      
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="habit-name-input"
          className="w-full text-black p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="e.g. Read 10 pages"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="habit-description-input"
          className="w-full p-3 border rounded-lg focus:ring-2 text-black focus:ring-blue-500 outline-none transition"
          placeholder="Why do you want to build this habit?"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700 ">Frequency</label>
        <select 
          disabled
          value="daily"
          data-testid="habit-frequency-select"
          className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button 
          type="submit" 
          data-testid="habit-save-button"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow hover:bg-blue-700 transition font-medium"
        >
          Save Habit
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
