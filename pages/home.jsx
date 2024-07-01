import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DeveloperCard from "../components/DeveloperCard"
const Home = () => {
  const { ready, authenticated, login, user } = usePrivy();
  const { wallets } = useWallets();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigateTo = (path) => {
    router.push(path);
  };
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch('/api/getDevs');
        const data = await response.json();
        setDevelopers(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching developers:', error);
      }
    };

    fetchDevelopers();
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#FED4CA] to-[#FFE3E1] min-h-screen p-5">
      <div className="relative p-10 mt-5 text-center bg-white rounded-3xl shadow-clay-card ">
        <img src="/banner.svg" alt="Banner" className="absolute inset-0 object-cover w-full h-full opacity-50 rounded-3xl" />
        <h2 className="relative text-2xl font-bold text-blue-900">
          Showcase and hire developers based on their contributions and attestations on chain
        </h2>
        <p className="relative text-blue-700">Discover top developers and their contributions to open-source projects.</p>
        <div className="flex justify-center space-x-4 mt-4">
  <div
    className="bg-blue-100 text-blue-700 border border-blue-300 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group cursor-pointer"
    onClick={() => navigateTo('/contribute')}
  >
    <span className="bg-blue-300 shadow-blue-300 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
    Contribute
  </div>
  <div
    className="bg-blue-100 text-blue-700 border border-blue-300 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group cursor-pointer"
    onClick={() => navigateTo('/open')}
  >
    <span className="bg-blue-300 shadow-blue-300 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
    Open for Contribution
  </div>
</div>

      </div>

      <h3 className="mt-10 text-2xl font-semibold text-center">Top Developers</h3>
      {loading ? (
        <p className="text-center">Loading developers...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
          {developers.map((developer) => (
            <DeveloperCard key={developer._id} developer={developer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
