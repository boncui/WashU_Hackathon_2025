'use client'; // Required for client-side functionality
import { useRouter } from 'next/navigation'; // Next.js navigation hook
const LogoutButton: React.FC = () => {
    const router = useRouter(); // Replace useNavigate with useRouter
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Clear user data
        localStorage.removeItem('spotify_access_token'); // Clear Spotify token
        
        localStorage.removeItem('spotify_refresh_token');

        router.push('/'); // Replace navigate with router.push
        window.location.reload(); // Refresh the app state
    };
    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
            Logout
        </button>
    );
};
export default LogoutButton;