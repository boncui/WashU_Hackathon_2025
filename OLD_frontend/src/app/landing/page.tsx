'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Landing: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-opacity-50 p-8 rounded-2xl border border-gray-700 shadow-lg max-w-2xl text-center w-full">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-[#F20D00] border-4 border-[#F20D00] p-6 rounded-2xl shadow-inner">
          Welcome to DevFest
        </h1>

        <p className="text-red-300 text-lg mb-8 font-medium">
          Blend genres. Sync vibes. Let your music match your moment.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push('/auth/register')}
            className="bg-[#F20D00] text-white px-8 py-3 rounded-full border border-[#F20D00] hover:bg-white hover:text-[#F20D00] transition duration-300"
          >
            Register
          </button>

          <button
            onClick={() => router.push('/auth/login')}
            className="bg-[#F20D00] text-white px-8 py-3 rounded-full border border-[#F20D00] hover:bg-white hover:text-[#F20D00] transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
