import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import UserMenu from './UserMenu'; // Adjust the import path as needed

const NavBar = () => {
  const { ready, authenticated, login } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  return (
    <nav className="flex items-center justify-between p-5 bg-white shadow-md rounded-xl">
      <div className="flex items-center space-x-4">
        <img src="/logo.svg" alt="Logo" className="h-8" />
      </div>
      <div className="flex space-x-4">
        <button className="px-4 py-2 text-blue-500 bg-white rounded shadow-clay-btn">Create Task</button>
        {authenticated ? (
          <UserMenu />
        ) : (
          <button disabled={disableLogin} onClick={login} className="px-4 py-2 text-blue-500 bg-white rounded shadow-clay-btn">
            Log in
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
