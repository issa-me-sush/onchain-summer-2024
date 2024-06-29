import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAccessToken } from '@privy-io/react-auth';

const Refresh = () => {
  const router = useRouter();

  useEffect(() => {
    const refreshSession = async () => {
      const token = await getAccessToken();

      if (token) {
        const redirectUri = router.query.redirect_uri || '/';
        router.replace(redirectUri);
      } else {
        router.replace('/login');
      }
    };

    refreshSession();
  }, [router]);

  return <div>Refreshing session...</div>;
};

export default Refresh;
