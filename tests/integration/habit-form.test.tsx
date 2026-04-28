import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../../src/app/dashboard/page';
import { saveSession, getHabits, saveHabits } from '../../src/lib/storage';
import React from 'react';

const mockPush = vi.fn();
const mockRouter = { push: mockPush };
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}));

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    
    // Setup a logged in user session
    saveSession({ userId: 'user1', email: 'test@example.com' });
  });

  it('shows a validation error when habit name is empty', () => {
    render(<DashboardPage />);
    
    // Click create button
    fireEvent.click(screen.getByTestId('create-habit-button'));
    
    // Submit empty form
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    expect(screen.getByText('Habit name is required')).toBeInTheDocument();
  });

  it('creates a new habit and renders it in the list', () => {
    render(<DashboardPage />);
    
    fireEvent.click(screen.getByTestId('create-habit-button'));
    
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Drink Water' } });
    fireEvent.change(screen.getByTestId('habit-description-input'), { target: { value: '2 liters a day' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    expect(screen.getByText('Drink Water')).toBeInTheDocument();
    expect(screen.getByText('2 liters a day')).toBeInTheDocument();
    
    const habits = getHabits();
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Drink Water');
  });

  it('edits an existing habit and preserves immutable fields', () => {
    const initialHabit = {
      id: 'h1',
      userId: 'user1',
      name: 'Read',
      description: '10 pages',
      frequency: 'daily' as const,
      createdAt: '2026-01-01T00:00:00.000Z',
      completions: ['2026-01-02']
    };
    saveHabits([initialHabit]);
    
    render(<DashboardPage />);
    
    fireEvent.click(screen.getByTestId('habit-edit-read'));
    
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Read Books' } });
    fireEvent.change(screen.getByTestId('habit-description-input'), { target: { value: '20 pages' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    expect(screen.getByTestId('habit-card-read-books')).toBeInTheDocument();
    
    const habits = getHabits();
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Read Books');
    expect(habits[0].id).toBe('h1'); // Preserved ID
    expect(habits[0].createdAt).toBe('2026-01-01T00:00:00.000Z'); // Preserved createdAt
    expect(habits[0].completions).toEqual(['2026-01-02']); // Preserved completions
  });

  it('deletes a habit only after explicit confirmation', () => {
    saveHabits([{
      id: 'h2', userId: 'user1', name: 'Exercise', description: '', frequency: 'daily' as const, createdAt: '', completions: []
    }]);
    
    render(<DashboardPage />);
    
    // First click shows confirmation
    fireEvent.click(screen.getByTestId('habit-delete-exercise'));
    expect(screen.getByTestId('habit-card-exercise')).toBeInTheDocument();
    
    // Second click confirms
    fireEvent.click(screen.getByTestId('confirm-delete-button'));
    expect(screen.queryByTestId('habit-card-exercise')).not.toBeInTheDocument();
    
    expect(getHabits()).toHaveLength(0);
  });

  it('toggles completion and updates the streak display', () => {
    saveHabits([{
      id: 'h3', userId: 'user1', name: 'Meditate', description: '', frequency: 'daily' as const, createdAt: '', completions: []
    }]);
    
    render(<DashboardPage />);
    
    const streakDisplay = screen.getByTestId('habit-streak-meditate');
    expect(streakDisplay.textContent).toBe('0');
    
    const toggle = screen.getByTestId('habit-complete-meditate');
    fireEvent.click(toggle);
    
    expect(streakDisplay.textContent).toBe('1');
    expect(getHabits()[0].completions).toHaveLength(1);
  });
});