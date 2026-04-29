'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, saveUsers, saveSession } from '@/lib/storage';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      setError('User already exists');
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password, // In a real app this would be hashed
      createdAt: new Date().toISOString()
    };

    saveUsers([...users, newUser]);
    saveSession({ userId: newUser.id, email: newUser.email });
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex flex-col">
        <label htmlFor="signup-email" className="block mb-1 font-medium text-gray-700">Email</label>
        <input
          id="signup-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="auth-signup-email"
          className="p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="signup-password" className="block mb-1 font-medium text-gray-700">Password</label>
        <input
          id="signup-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="auth-signup-password"
          className="p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button 
        type="submit" 
        data-testid="auth-signup-submit"
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Sign Up
      </button>
    </form>
  );
}
