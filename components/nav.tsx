import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import UserMenu from './UserMenu'; 
import Link from 'next/link';
const NavBar = () => {
  const { ready, authenticated, login } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  return (
    <nav className="flex items-center justify-between p-5 bg-white shadow-md rounded-xl">
      <div className="flex items-center space-x-4">
        <Link href="/">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        </Link>
      </div>
      <div className="flex space-x-4">
       
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
