'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CredentialResponse } from '@react-oauth/google';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API) {
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in your .env.local file');
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
  spotifyConnected?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  spotifyToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credentialResponse: CredentialResponse) => Promise<void>;
  exchangeSpotifyCode: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on first mount
  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedSpotifyToken = typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : null;

    if (storedToken) setToken(storedToken);
    if (storedSpotifyToken) setSpotifyToken(storedSpotifyToken);

    if (!storedToken) setIsLoading(false); // skip verification if no token
  }, []);

  // Verify user token after setting it
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${API}/users/login`, { email, password });
    const { token, user } = response.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `token=${token}; path=/; max-age=86400`;
    }

    setToken(token);
    setUser(user);
  };

  const googleLogin = async (credentialResponse: CredentialResponse) => {
    const response = await axios.post(`${API}/users/googlelogin`, {
      token: credentialResponse.credential,
    });

    const { token, user } = response.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `token=${token}; path=/; max-age=86400`;
    }

    setToken(token);
    setUser(user);
  };

  const exchangeSpotifyCode = async (code: string) => {
    try {
      const response = await axios.post(`${API}/spotify/auth`, { code });
      const { access_token, refresh_token } = response.data;

      localStorage.setItem('spotify_access_token', access_token);
      localStorage.setItem('spotify_refresh_token', refresh_token);
      setSpotifyToken(access_token);
    } catch (error) {
      console.error('Spotify code exchange failed:', error);
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.clear();
      document.cookie = 'token=; Max-Age=0; path=/;';
    }

    setUser(null);
    setToken(null);
    setSpotifyToken(null);
    window.location.href = '/'; // or use router.push('/') if using useRouter
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        spotifyToken,
        isAuthenticated: !!user,
        login,
        googleLogin,
        exchangeSpotifyCode,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
