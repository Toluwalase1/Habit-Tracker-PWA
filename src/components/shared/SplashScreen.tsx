import React from 'react';

export default function SplashScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white" data-testid="splash-screen">
      <h1 className="text-4xl font-bold tracking-tight">Habit Tracker</h1>
    </div>
  );
}
