'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? 'underline font-semibold' : '';

  return (
    <nav className="bg-white border-b border-[#F20D00] text-[#F20D00] px-4 py-4 flex justify-between items-center shadow-sm">
      {/* Left Side: Logo + Nav */}
      <div className="flex items-center space-x-6">
        <Link
          href="/dashboard/home"
          className="flex items-center space-x-2"
        >
          <Image src="/logo.png" alt="Echo Sync Logo" width={24} height={24} />
          <span className="text-xl font-montserrat tracking-wide">Echo Sync</span>
        </Link>

        {isAuthenticated && (
          <>
            {/* <Link
              href="/dashboard/home"
              className={`hover:underline ${isActive('/dashboard/home')}`}
            >
              Home
            </Link> */}

            <Link
              href="/dashboard/create-event"
              className={`hover:underline ${isActive('/dashboard/create-event')}`}
            >
              Create Event
            </Link>

            <Link
              href="https://www.echo-sync.org/about"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              About
            </Link>
            
            <Link
              href="https://www.echo-sync.org/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Contact
            </Link>

            
          </>
        )}
      </div>

      {/* Right Side: Auth Actions */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="font-semibold">{user?.fullName}</span>
            <Link
              href="/dashboard/account"
              className={`hover:underline ${isActive('/dashboard/account')}`}
            >
              Account
            </Link>
            <button onClick={logout} className="hover:underline">
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className={`hover:underline ${isActive('/auth/login')}`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
