import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';

const UserMenu = () => {
  const { user, logout } = usePrivy();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 text-white bg-blue-500 rounded"
      >
        {user?.username || 'User'}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white rounded shadow-lg z-10">
          <button
            onClick={() => router.push('/profile')}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            View Profile
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
