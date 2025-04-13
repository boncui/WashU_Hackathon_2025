'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { resetPassword } from '@/services/api';

const ResetPassword: React.FC = () => {
    const params = useParams<{ token: string }>();
    const token = params?.token;
    
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || typeof token !== 'string') {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || typeof token !== 'string') return;

    setLoading(true);

    try {
      const res = await resetPassword(token, password);
      setMessage(res.message || 'Password reset successful!');
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setError('Something went wrong while resetting your password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || typeof token !== 'string') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Invalid or missing reset token. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="bg-white bg-opacity-20 p-6 rounded shadow-md w-80 border-2 border-green-500 relative z-10 backdrop-blur-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-green-500 text-xl font-bold mb-4">Reset Password</h1>

        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-700 text-white py-2 px-4 w-full rounded hover:bg-green-500"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
