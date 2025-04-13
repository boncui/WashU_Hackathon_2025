'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';




const Login: React.FC = () => {
    const { login, googleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard/home');
        } catch {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                className="bg-opacity-20 p-6 rounded shadow-md w-80 border-2 border-[#F20D00] relative z-10 backdrop-blur-md"
                onSubmit={handleLogin}
            >
                <h1 className="text-[#F20D00] text-xl font-bold mb-4">Login</h1>

                {/* Display errors in red */}
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
                    className="border p-2 w-full mb-4 rounded text-[#F20D00]"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full mb-4 rounded text-[#F20D00]"
                    required
                />
               
                <div className='mb-2'></div>
                {/* <div className="text-left mb-2 mt-2">
                    <Link href="/forgot-password" className="text-green-500 hover:underline">
                        Forgot Password?
                    </Link>
                </div> */}
                <button
                    type="submit"
                    className="bg-[#F20D00] text-white py-2 px-4 w-full rounded hover:bg-[#F20D00]/70"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="text-left mt-4">
                    <Link href="/auth/register" className="text-[#F20D00] hover:underline">
                        Don&apos;t have an account? Register
                    </Link>
                </div>
                <div className="text-left mt-4">
                    <Link href="/auth/forgot-password" className="text-[#F20D00] hover:underline">
                        Forgot Password?
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;