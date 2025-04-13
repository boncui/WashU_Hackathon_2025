'use client';
import React, { useState } from 'react';
import { sendResetPasswordEmail } from '@/services/api';
import Link from 'next/link';
import axios from 'axios';
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendResetPasswordEmail(email);
      setMessage('Password reset link sent to your email');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError('User not found');
      } else {
        setError('Failed to reset password');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="bg-white bg-opacity-20 p-6 rounded shadow-md w-80 border-2 border-[#F20D00] relative z-10 backdrop-blur-md"
        onSubmit={handleResetPassword}
      >
        <h1 className="text-[#F20D00] text-xl font-bold mb-4">Forgot Password</h1>
        {message && (
          <p className="text-[#F20D00] text-sm mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
          required
        />
        <button
          type="submit"
          className="bg-[#F20D00] text-white py-2 px-4 w-full rounded border border-[#F20D00] hover:bg-white hover:text-[#F20D00]"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
        <div className="text-left mt-4">
          <Link href="/login" className="text-[#F20D00] hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};
export default ForgotPassword;