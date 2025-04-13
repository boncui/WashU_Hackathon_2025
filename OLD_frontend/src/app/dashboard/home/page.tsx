'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllEvents } from '@/services/api';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { format } from 'date-fns';
import Image from 'next/image';
import axios from 'axios';
import { fetchTopTracksFromSpotify, saveTopTracksToUser, refreshSpotifyAccessToken } from '@/services/spotify';
import { useAuth } from '@/context/AuthContext';
import SongCard from '@/components/SongCard';

interface Attendee {
  _id: string;
  fullName?: string;
  email?: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  uri: string;
  externalUrl: string;
  image: string;
}

interface EventData {
  _id: string;
  eventName: string;
  location: string;
  dateTime: string;
  atmosphere: string;
  attendees?: Attendee[];
  [key: string]: string | number | string[] | Attendee[] | undefined;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [hideSpotifyAuthComponent, setHideSpotifyAuthComponent] = useState(false);
  const [spotifySuccessMessage, setSpotifySuccessMessage] = useState('');
  const router = useRouter();
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const { token, user } = useAuth();
  const [isProcessingSpotifyAuth, setIsProcessingSpotifyAuth] = useState(false);

  const handleSpotifyAuth = async (code: string) => {
    console.log('ENV:', process.env.NEXT_PUBLIC_API_BASE_URL);
    setIsProcessingSpotifyAuth(true);
    try {
      console.log('ENV:', process.env.NEXT_PUBLIC_API_BASE_URL);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/spotify/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
  
      const data = await response.json();
  
      if (data.access_token) {
        // Save the tokens to localStorage
        localStorage.setItem('spotify_access_token', data.access_token);
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
  
        // Clean the URL by removing the code query param
        const updatedUrl = new URL(window.location.href);
        updatedUrl.searchParams.delete('code');
        window.history.replaceState({}, document.title, updatedUrl.toString());
  
        // Show Spotify success message
        setHideSpotifyAuthComponent(true);
        setSpotifySuccessMessage('✅ Spotify connection successful!');
  
        // Fetch the user's top tracks and save them to the backend
        const topTracks = await fetchTopTracksFromSpotify(data.access_token);
        const token = localStorage.getItem('token');
        const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
        if (token && userId) {
          await saveTopTracksToUser(userId, token, topTracks);
          console.log('✅ Top 20 tracks saved to backend');
        }
  
        // Reset success message after a short delay
        setTimeout(() => setSpotifySuccessMessage(''), 5000);
      }
    } catch (error) {
      console.log('ENV:', process.env.NEXT_PUBLIC_API_BASE_URL);
      console.error("Spotify Auth Failed", error);
    } finally {
      console.log('ENV:', process.env.NEXT_PUBLIC_API_BASE_URL);
      setIsProcessingSpotifyAuth(false);
    }
  };
  

  // const fetchUserSavedTracks = async (userId: string, token: string) => {
  //   const response = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/spotify-songs`,
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   return response.data;
  // };

  const handleRefreshTopTracks = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken || !token || !user?._id) {
      alert("Missing authentication. Please reconnect to Spotify.");
      return;
    }

    try {
      const latestTracks = await fetchTopTracksFromSpotify(accessToken);
      await saveTopTracksToUser(user._id, token, latestTracks);
      setTopTracks(latestTracks);
      setSpotifySuccessMessage("✅ Top 20 songs refreshed!");
      setTimeout(() => setSpotifySuccessMessage(''), 4000);
    } catch (error) {
      console.error("Failed to refresh top songs:", error);
      alert("Something went wrong while refreshing your songs.");
    }
  };

  const handleSpotifyLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'your-client-id';
    const redirectUri = `${window.location.origin}/redirect`;  // ✅ This matches Spotify dashboard
    const scope = 'user-read-private user-read-email user-top-read';
  
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.search = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope,
    }).toString();
  
    window.location.href = authUrl.toString();
  };

  // Effect to fetch the Spotify tracks from the backend after login
  useEffect(() => {
    const fetchTracks = async () => {
      const accessToken = localStorage.getItem('spotify_access_token');
      if (accessToken) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/spotify/top-tracks`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setTopTracks(response.data);
        } catch (error) {
          console.error("Error fetching top tracks:", error);
        }
      }
    };

    fetchTracks();
  }, []);  // Only run once when the component mounts

  // Effect to fetch events and handle Spotify auth state
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (typeof window !== 'undefined') {
      const authCheck = async () => {
        const code = localStorage.getItem('spotify_auth_code');
        if (code) {
          await handleSpotifyAuth(code);
          localStorage.removeItem('spotify_auth_code');
          return;
        }

        const accessToken = localStorage.getItem('spotify_access_token');
        const refreshToken = localStorage.getItem('spotify_refresh_token');

        if (user?.spotifyConnected) {
          if (!accessToken && refreshToken) {
            try {
              const newAccessToken = await refreshSpotifyAccessToken(refreshToken);
              localStorage.setItem('spotify_access_token', newAccessToken);
            } catch (err) {
              console.warn("❌ Could not refresh Spotify token", err);
            }
          }
          setHideSpotifyAuthComponent(true);
        } else {
          setHideSpotifyAuthComponent(false);
        }
      };

      setTimeout(authCheck, 100);
    }

    fetchEvents();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 relative max-w-6xl mx-auto">
      {isProcessingSpotifyAuth && (
        <div className="w-full flex justify-center items-center max-w-6xl mx-auto mt-10">
          <p className="text-[#F20D00] font-semibold text-lg animate-pulse">
            🎧 Connecting to Spotify...
          </p>
        </div>
      )}

      <div className={isProcessingSpotifyAuth ? 'opacity-40 pointer-events-none w-full' : 'w-full'}>
        <h1 className="text-3xl font-montserrat mb-4 text-[#F20D00] p-4 rounded-md text-center">
          Echo Sync
        </h1>

        {!hideSpotifyAuthComponent && (
          <div className="w-full max-w-4xl border-2 border-black p-4 rounded-md mb-4 flex flex-col items-center">
            <p className="text-lg font-bold text-[#F20D00] mb-2 text-center">
              Login with Spotify to continue
            </p>
            <button
              onClick={handleSpotifyLogin}
              className="mt-2 bg-[#F20D00] text-white px-4 py-2 rounded border border-[#F20D00] hover:bg-white hover:text-[#F20D00]"
            >
              Login with Spotify
            </button>
          </div>
        )}

        {topTracks.length > 0 && (
          <div className="w-full max-w-6xl mx-auto mt-8">
            <h3 className="text-lg font-bold text-[#F20D00] mb-2">🎵 Your Top 20 Tracks</h3>
            <button
              onClick={handleRefreshTopTracks}
              className="mb-4 bg-[#F20D00] text-white px-4 py-2 rounded hover:bg-red-600"
            >
              🔄 Refresh My Top 20 Songs
            </button>
            <div className="w-full max-w-6xl overflow-x-auto px-1">
              <div className="flex space-x-4 w-max">
                {topTracks.map((track, index) => (
                  <SongCard
                    key={index}
                    name={track.name}
                    artists={track.artists}
                    image={track.image}
                    externalUrl={track.externalUrl}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-6xl mx-auto border-2 border-black p-4 rounded-md mt-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4 text-[#F20D00]">
            Sync Spaces Near Me
          </h2>

          {spotifySuccessMessage && (
            <div className="w-full max-w-4xl p-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded-md text-center font-semibold">
              {spotifySuccessMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ">
            {events.length > 0 ? (
              events.map((event) => {
                return new Date(event.dateTime) >= new Date() ? (
                <div
                  key={event._id}
                  className="bg-white shadow-md rounded-lg p-4 cursor-pointer border-2 border-black"
                  onClick={() => router.push(`/dashboard/sync-space/${event._id}`)}
                >
                  <Image
                    src="/placeholder.png"
                    alt={event.location}
                    width={400}
                    height={200}
                    priority
                    className="w-full h-32 object-cover mb-2 rounded-md"
                  />
                  <h3 className="text-xl text-[#F20D00] font-bold mb-2">{event.eventName}</h3>
                  <p className="text-[#F20D00]">{event.attendees?.length || 0} people attending</p>
                  <div className="flex items-center mt-4 gap-2">
                    <AccessTimeRoundedIcon sx={{ color: '#F20D00' }} />
                    <p className="text-[#F20D00]">
                      {format(new Date(event.dateTime), 'MMMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="flex items-center mt-2 gap-2">
                    <LocationOnRoundedIcon sx={{ color: '#F20D00' }} />
                    <p className="text-[#F20D00]">Event Location: {event.location}</p>
                  </div>
                </div>
              ) : null})
            ) : (
              <p className="text-gray-400">No events available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
