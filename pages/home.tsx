import { usePrivy ,useToken} from "@privy-io/react-auth";
import UserMenu from "../components/UserMenu";
import DeveloperCard from "../components/DeveloperCard";
import { useEffect,useState } from "react";
const dummyDevelopers = [
  { id: 1, githubUsername: "dev1", image: "/github.png", contributions: 50, score: 85 },
  { id: 2, githubUsername: "dev2", image: "/github.png", contributions: 30, score: 70 },
  { id: 3, githubUsername: "dev3",image: "/github.png",  contributions: 45, score: 90 },
];

const Home = () => {
  const { ready, authenticated, login,user } = usePrivy();
const {getAccessToken}  = useToken()
const [accessToken, setAccessToken] = useState(null);

useEffect(() => {
  const fetchAccessToken = async () => {
    if (authenticated) {
      try {
        const token = await getAccessToken();
        console.log("token",token)
        setAccessToken(token);
      } catch (error) {
        console.error('Failed to fetch access token:', error);
      }
    }
  };

  fetchAccessToken();
}, [authenticated, getAccessToken]);
  const disableLogin = !ready || (ready && authenticated);
console.log(user?.linkedAccounts)
  return (
    <div className="bg-gradient-to-b from-[#FED4CA] to-[#FFE3E1] min-h-screen p-5">
    

      <div className="p-10 mt-5 text-center relative rounded-3xl bg-white shadow-clay-card">
        <img src="/banner.svg" alt="Banner" className="absolute inset-0 object-cover w-full h-full opacity-50 rounded-3xl" />
        <h2 className="relative text-2xl font-bold text-blue-900">Showcase and hire developers based on their contributions and attestations on chain</h2>
        <p className="relative text-blue-700">
          Discover top developers and their contributions to open-source projects.
        </p>
        <button className="relative px-4 py-2 mt-4 text-white bg-blue-500 rounded shadow-clay-btn">Create a task</button>
      </div>

      <h3 className="mt-10 text-2xl font-semibold text-center">Top Developers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10 justify-items-center">
        {dummyDevelopers.map((developer) => (
          <DeveloperCard key={developer.id} developer={developer} />
        ))}
      </div>
    </div>
  );
};

export default Home;
