'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/services/api'; 

interface ValidationError {
    msg: string;
  }

interface AxiosErrorWithData extends Error {
response?: {
    data?: {
    errors?: ValidationError[];
    error?: string;
    };
};
}

const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register({ fullName, email, password });
            setSuccessMessage('Registration successful! Redirecting to login...');

            // Optionally wait, then navigate:
            setTimeout(() => {
                router.push('/auth/login');
            }, 500);
        } catch (err: unknown) {
            const axiosError = err as AxiosErrorWithData;
        
            if (axiosError.response?.data?.errors) {
                const messages = axiosError.response.data.errors
                    .map((errorObj) => errorObj.msg)
                    .join('\n');
                setError(messages);
            } else if (axiosError.response?.data?.error) {
                setError(axiosError.response.data.error);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <form
                className="bg-opacity-20 p-6 rounded shadow-md w-80 border-2 border-[#F20D00] relative z-10 backdrop-blur-md"
                onSubmit={handleRegister}
            >
                <h1 className="text-[#F20D00] text-xl font-bold mb-4">Register</h1>
                
                {/* Display errors in red */}
                {error && (
                    <p className="text-red-500 text-sm mb-4">
                        {error}
                    </p>
                )}
                
                {/* Display success message in green */}
                {successMessage && (
                    <p className="text-green-500 text-sm mb-4">
                        {successMessage}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border p-2 w-full mb-4 rounded text-[#F20D00]"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-4 rounded text-[#F20D00]"
                    required
                />
                <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full mb-4 rounded text-[#F20D00]"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border p-2 w-full mb-4 rounded text-[#F20D00]"
                    required
                />
                <button
                    type="submit"
                    className="bg-[#F20D00] text-white py-2 px-4 w-full rounded hover:bg-[#F20D00]/70"
                >
                    Register
                </button>
                <div className="text-left mt-4">
                    <Link href="/auth/login" className="text-[#F20D00] hover:underline ">
                        Have an account? Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;