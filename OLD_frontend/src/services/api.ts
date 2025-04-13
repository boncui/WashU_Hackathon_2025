import axios from 'axios';

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in your .env.local file');
}

export interface MinimalSong {
  id: string;
  name: string;
  artists: string[];
}

export interface Song {
  id: string;
  name: string;
  artists: string[];
  uri: string;
  externalUrl: string;
  image: string;
}

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- API FUNCTIONS ----------

export const login = async (email: string, password: string) => {
  const res = await API.post('/users/login', { email, password });
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const register = async (userData: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const res = await API.post('/users/register', userData);
  return res.data;
};

export const createEvent = async (eventData: {
  eventName: string;
  location: string;
  dateTime: Date;
  eventSongList: string[];
  atmosphere: string;
}) => {
  const res = await API.post('/events/create', eventData);
  return res.data;
};

export const getTopTracks = async () => {
  const accessToken = localStorage.getItem('spotify_access_token');
  if (!accessToken) throw new Error('No Spotify access token found');

  const res = await API.get(`/spotify/top-tracks`, {
    params: { access_token: accessToken },
  });

  return res.data as Song[];
};

export const sendUserTop5Songs = async (eventId: string, songs: MinimalSong[]) => {
  const res = await API.post(`/events/${eventId}/updateSongs`, { songs });
  return res.data;
};

export const getEventById = async (eventId: string) => {
  const res = await API.get(`/events/${eventId}`);
  return res.data;
};

export const getAllEvents = async () => {
  const res = await API.get('/events');
  return res.data;
};

export const joinEvent = async (eventId: string) => {
  const res = await API.post(`/events/${eventId}/join`);
  return res.data;
};

export const leaveEvent = async (eventId: string) => {
  const res = await API.post(`/events/${eventId}/leave`);
  return res.data;
};

export const checkUserInEvent = async (eventId: string) => {
  const res = await API.get(`/events/${eventId}/checkUser`);
  return res.data;
};

export const checkUserIsHost = async (eventId: string) => {
  const res = await API.get(`/events/${eventId}/checkHost`);
  return res.data;
};

export const sendResetPasswordEmail = async (email: string) => {
  const res = await API.post('/users/reset', { email });
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await API.post(`/users/reset/${token}`, { newPassword });
  return res.data;
};

export const refreshToken = async (refresh_token: string) => {
  const res = await API.post('/spotify/refresh', { refresh_token });
  return res.data;
};
