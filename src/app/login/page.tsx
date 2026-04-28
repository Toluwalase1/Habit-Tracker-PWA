import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <LoginForm />
      <p className="mt-4">
        Need an account? <Link href="/signup" className="text-blue-500">Sign Up</Link>
      </p>
    </main>
  );
}
