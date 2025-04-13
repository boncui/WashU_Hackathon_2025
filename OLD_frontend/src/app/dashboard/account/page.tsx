'use client'

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

interface UserData {
  fullName: string
  email: string
  _id: string
}

const Account: React.FC = () => {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [spotifyMessage, setSpotifyMessage] = useState<string | null>(null)
  const [hideSpotifyButton, setHideSpotifyButton] = useState(false)

  useEffect(() => {

    console.log('✅ ENV from Account component:', process.env.NEXT_PUBLIC_API_BASE_URL);
    const fetchData = async () => {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found. Please log in.')
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setUserData(response.data)
      } catch {
        setError('Failed to load user details.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) handleSpotifyAuth(code)

    setHideSpotifyButton(!!localStorage.getItem('spotify_access_token'))
    setSpotifyMessage(
      localStorage.getItem('spotify_access_token')
        ? '✅ Spotify login successful!'
        : null
    )
  }, [user])

  const handleSpotifyAuth = async (code: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/spotify/auth`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        }
      )

      const data = await response.json()

      if (data.access_token) {
        setSpotifyMessage('Spotify login successful!')
        setHideSpotifyButton(true)
        localStorage.setItem('spotify_access_token', data.access_token)

        const updatedUrl = new URL(window.location.href)
        updatedUrl.searchParams.delete('code')
        window.history.replaceState({}, document.title, updatedUrl.toString())
      } else {
        setSpotifyMessage('Failed to login with Spotify.')
      }
    } catch {
      setSpotifyMessage('Error during Spotify login.')
    }
  }

  const handleSpotifyLogin = () => {
    if (loading) return
    setLoading(true)
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'your-client-id'
    const redirectUri = `${window.location.origin}/redirect`
    const scope = 'user-read-private user-read-email user-top-read'
    const authUrl = new URL('https://accounts.spotify.com/authorize')
    authUrl.search = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope,
    }).toString()
    window.location.href = authUrl.toString()
  }

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    )
      return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('No authentication token found. Please log in.')
        return
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      alert('Your account has been deleted successfully.')
      logout()
    } catch {
      alert('Failed to delete account. Please try again.')
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="p-6">
      {userData ? (
        <div>
          {/* Profile Info */}
          <h1 className="text-2xl font-bold mb-4 text-[#F20D00]">Profile</h1>
          <p className="text-[#F20D00] mb-1"><strong>Name:</strong> {userData.fullName}</p>
          <p className="text-[#F20D00] mb-4"><strong>Email:</strong> {userData.email}</p>
          

          <hr className="my-6 border-t border-gray-300" />

          {/* Spotify Login */}
          <h2 className="text-xl font-bold mb-2 text-[#F20D00] pt-4">Spotify Connection</h2>
          {!hideSpotifyButton && (
            <button
              onClick={handleSpotifyLogin}
              className="mt-2 bg-[#F20D00] text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Login with Spotify
            </button>
          )}
          {spotifyMessage && <p className="mt-4 text-[#F20D00]">{spotifyMessage}</p>}

          <hr className="my-6 border-t border-gray-300" />

          {/* Past Events */}
          <h2 className="text-xl font-bold mb-2 text-[#F20D00] pt-4">Past Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            <div
              className="bg-white border border-gray-200 shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => window.location.href = '/dashboard/sync-space-detail'}
            >
              <h3 className="text-xl font-bold mb-1 text-[#F20D00]">Electric Dreams Festival</h3>
              <p className="text-gray-600">March 15, 2025</p>
            </div>
          </div>

          <hr className="my-6 border-t border-gray-300" />

          {/* Saved Combinations */}
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold text-[#F20D00]">Saved Combinations</h2>
            <button className="p-1 text-[#F20D00] hover:text-red-700">
              <AddRoundedIcon />
            </button>
          </div>

          <hr className="my-6 border-t border-gray-300" />

          {/* Danger Zone */}
          <div className="p-4"></div>
          <h1 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h1>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Account
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Your account has been deleted or you are not logged in.</p>
      )}
    </div>
  )
}

export default Account
