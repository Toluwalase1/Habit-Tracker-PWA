'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, saveSession } from '@/lib/storage';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    saveSession({ userId: user.id, email: user.email });
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Log In</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex flex-col">
        <label htmlFor="login-email" className="block mb-1 font-medium text-gray-700">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="auth-login-email"
          className="p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="login-password" className="block mb-1 font-medium text-gray-700">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="auth-login-password"
          className="p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button 
        type="submit" 
        data-testid="auth-login-submit"
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Log In
      </button>
    </form>
  );
}
